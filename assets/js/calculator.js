/*
 * calculator.js
 *
 * A small declarative calculator engine for posts that opt in with
 * `calculator: true` in their front matter. Dependency-free, no build step.
 *
 * A post writes no JavaScript. It marks up named inputs and expression
 * outputs, and this file wires them together:
 *
 *   <input class="calc-in" data-calc-name="salary" value="150000">
 *   <input class="calc-in" data-calc-name="hours"  value="1504">
 *
 *   <span class="calc-out" data-calc-name="rate"
 *         data-calc="salary / hours" data-calc-format="money">99.73</span>
 *
 *   <span class="calc-out" data-calc="saving / rate"
 *         data-calc-decimals="1">18.3</span>
 *
 * Attributes
 *   data-calc-name      Publishes a value under this name. On a form field it
 *                       publishes what the reader typed; on any other element
 *                       it publishes the result of that element's expression.
 *                       Must be a valid JavaScript identifier.
 *   data-calc           The expression. Plain JavaScript over published names,
 *                       plus sum(), min(), max(), abs(), round(), floor(),
 *                       ceil() and Math. An element with this attribute is an
 *                       output; without it, a named element is an input.
 *   data-calc-group     One or more space-separated group names. sum(group)
 *                       adds up every output in that group — that is how a
 *                       column of line items becomes a total.
 *   data-calc-format    num (default) | money | compact | pct
 *   data-calc-decimals  Overrides the format's default decimal places.
 *
 * Currency symbols and units stay in the prose or the column header. The
 * formatters only ever emit a number.
 *
 * The text already inside an output element is its fallback: the correct,
 * hand-computed figure. It is what a reader without JavaScript sees, and it is
 * restored if an expression fails, so a broken formula degrades to a stale
 * number rather than to an error marker. Failures are reported once each on
 * the console, with the offending element.
 *
 * One namespace per page. Two calculators in one post means prefixing the
 * names (basic_*, dev_*).
 *
 * Note for posts that also set `math: true`: KaTeX replaces the DOM inside
 * \[...\] when it renders, which would destroy an output nested in display
 * math. Keep live values outside the math delimiters.
 */
(function (root) {
  "use strict";

  // ---- Formatting ----------------------------------------------------------

  var FORMAT_DECIMALS = { num: 0, money: 2, compact: 1, pct: 1 };

  function fixed(n, decimals) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function format(value, name, decimals) {
    var places = decimals;
    if (places === null || places === undefined || !isFinite(places)) {
      places = FORMAT_DECIMALS[name];
      if (places === undefined) places = FORMAT_DECIMALS.num;
    }
    if (name === "pct") return fixed(value * 100, places) + "%";
    if (name === "compact") {
      var size = Math.abs(value);
      if (size >= 1e6) return fixed(value / 1e6, places) + "M";
      if (size >= 1e3) return fixed(value / 1e3, places) + "k";
      return fixed(value, places);
    }
    // num and money differ only in their default decimal places.
    return fixed(value, places);
  }

  // ---- Expressions ---------------------------------------------------------

  // sum(kafka) takes a group name, not a value. Rewrite it to sum("kafka")
  // before scanning for dependencies, so the group name is not mistaken for
  // one and looked up as a number.
  var SUM_CALL = /\bsum\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\)/g;
  var STRING_LITERAL = /"[^"]*"|'[^']*'/g;
  var MEMBER_ACCESS = /\.\s*[A-Za-z_$][A-Za-z0-9_$]*/g;
  var IDENTIFIER = /[A-Za-z_$][A-Za-z0-9_$]*/g;

  var HELPER_NAMES = ["sum", "min", "max", "abs", "round", "floor", "ceil"];

  // Identifiers that resolve to something other than a published value, and
  // so are never dependencies.
  var NOT_A_DEPENDENCY = {
    Math: true, Number: true, Infinity: true, NaN: true,
    "true": true, "false": true, "null": true, "undefined": true
  };
  HELPER_NAMES.forEach(function (n) { NOT_A_DEPENDENCY[n] = true; });

  // Turn an expression string into { source, deps, groups, fn }. Throws on a
  // syntax error, which the caller reports against the offending element.
  function compile(expr) {
    var groups = [];
    var source = expr.replace(SUM_CALL, function (match, group) {
      groups.push(group);
      return "sum(\"" + group + "\")";
    });

    // Scan a copy with string bodies and member names removed, so neither a
    // group name nor the `min` in `Math.min` shows up as a dependency. The
    // copy only has to survive a regex, not parse.
    var scan = source.replace(STRING_LITERAL, "\"\"").replace(MEMBER_ACCESS, ".");
    var deps = [];
    var seen = {};
    var match;
    IDENTIFIER.lastIndex = 0;
    while ((match = IDENTIFIER.exec(scan)) !== null) {
      var name = match[0];
      if (NOT_A_DEPENDENCY[name] || seen[name]) continue;
      seen[name] = true;
      deps.push(name);
    }

    // Dependencies and helpers arrive as ordinary arguments, which keeps the
    // expression out of any enclosing scope without needing `with`.
    var params = deps.concat(HELPER_NAMES, ["return (" + source + ");"]);
    return {
      source: source,
      deps: deps,
      groups: groups,
      fn: Function.apply(null, params)
    };
  }

  // ---- Reading a field -----------------------------------------------------

  function readField(el) {
    var value = parseFloat(el.value);
    if (!isFinite(value)) value = 0;
    // Honour the field's own bounds, so a stray keystroke cannot push the
    // whole page into nonsense.
    var min = parseFloat(el.getAttribute("min"));
    var max = parseFloat(el.getAttribute("max"));
    if (isFinite(min) && value < min) value = min;
    if (isFinite(max) && value > max) value = max;
    return value;
  }

  // ---- The engine ----------------------------------------------------------

  function Engine() {
    this.fields = {};   // name -> form element
    this.named = {};    // name -> output node
    this.outputs = [];  // every output node, in document order
    this.groups = {};   // group name -> [output node]
    this.warned = {};
  }

  Engine.prototype.collect = function (scope) {
    var self = this;
    var elements = scope.querySelectorAll("[data-calc-name], [data-calc]");

    Array.prototype.forEach.call(elements, function (el) {
      var name = el.getAttribute("data-calc-name");
      var expr = el.getAttribute("data-calc");

      if (name !== null && (self.fields[name] || self.named[name])) {
        self.complain("duplicate name \"" + name + "\"", el);
        return;
      }

      if (expr === null) {
        // No expression: an input, read from its .value.
        if (name === null) return;
        if (typeof el.value === "undefined") {
          self.complain("\"" + name + "\" has no expression and no value", el);
          return;
        }
        self.fields[name] = el;
        return;
      }

      var compiled;
      try {
        compiled = compile(expr);
      } catch (err) {
        self.complain(err.message, el);
        return;
      }

      var decimals = parseInt(el.getAttribute("data-calc-decimals"), 10);
      var node = {
        el: el,
        name: name,
        expr: expr,
        compiled: compiled,
        format: el.getAttribute("data-calc-format") || "num",
        decimals: isFinite(decimals) ? decimals : null,
        fallback: el.textContent,
        state: null,
        value: 0,
        error: null
      };

      self.outputs.push(node);
      if (name !== null) self.named[name] = node;

      var groups = (el.getAttribute("data-calc-group") || "").split(/\s+/);
      groups.forEach(function (group) {
        if (!group) return;
        if (!self.groups[group]) self.groups[group] = [];
        self.groups[group].push(node);
      });
    });

    return this;
  };

  // Resolve a published name, whichever kind of node publishes it.
  Engine.prototype.value = function (name) {
    if (Object.prototype.hasOwnProperty.call(this.fields, name)) {
      return readField(this.fields[name]);
    }
    var node = this.named[name];
    if (!node) throw new Error("unknown value \"" + name + "\"");
    return this.evaluate(node);
  };

  Engine.prototype.sum = function (group) {
    var members = this.groups[group];
    if (!members) throw new Error("unknown group \"" + group + "\"");
    var self = this;
    var total = 0;
    members.forEach(function (node) { total += self.evaluate(node); });
    return total;
  };

  // Evaluate one output, pulling its dependencies in on demand. Memoised for
  // the duration of a render pass; the `running` state is what catches a
  // circular reference.
  Engine.prototype.evaluate = function (node) {
    if (node.state === "done") return node.value;
    if (node.state === "failed") throw node.error;
    if (node.state === "running") {
      throw new Error("circular reference through \"" +
        (node.name || node.expr) + "\"");
    }

    node.state = "running";
    var self = this;
    try {
      var args = node.compiled.deps.map(function (dep) {
        return self.value(dep);
      });
      var helpers = [
        function (group) { return self.sum(group); },
        Math.min, Math.max, Math.abs, Math.round, Math.floor, Math.ceil
      ];
      var result = node.compiled.fn.apply(null, args.concat(helpers));
      if (typeof result !== "number" || !isFinite(result)) {
        throw new Error("\"" + node.expr + "\" is not a finite number (" +
          result + ")");
      }
      node.value = result;
      node.state = "done";
      return result;
    } catch (err) {
      node.state = "failed";
      node.error = err;
      throw err;
    }
  };

  // Recompute everything. A page holds a few dozen nodes, so there is nothing
  // to gain from tracking which of them a keystroke actually touched.
  Engine.prototype.render = function () {
    var self = this;

    this.outputs.forEach(function (node) {
      node.state = null;
      node.value = 0;
      node.error = null;
    });

    this.outputs.forEach(function (node) {
      try {
        var value = self.evaluate(node);
        node.el.textContent = format(value, node.format, node.decimals);
      } catch (err) {
        node.el.textContent = node.fallback;
        self.complain(err.message, node.el);
      }
    });

    return this;
  };

  Engine.prototype.wire = function () {
    var self = this;
    var update = function () { self.render(); };
    Object.keys(this.fields).forEach(function (name) {
      self.fields[name].addEventListener("input", update);
      self.fields[name].addEventListener("change", update);
    });
    return this;
  };

  // Report a problem once, so a broken expression does not fill the console
  // on every keystroke.
  Engine.prototype.complain = function (message, el) {
    if (this.warned[message]) return;
    this.warned[message] = true;
    if (root.console && root.console.warn) {
      root.console.warn("calculator: " + message, el);
    }
  };

  // ---- Boot ----------------------------------------------------------------

  var api = {
    Engine: Engine,
    compile: compile,
    format: format,
    readField: readField,
    engine: null
  };

  function init() {
    api.engine = new Engine().collect(root.document).wire().render();
  }

  root.Calc = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (root.document) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})(typeof window !== "undefined" ? window : this);
