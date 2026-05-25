/*
 * llm-footprint.js
 *
 * Pure, dependency-free JavaScript for the LLM-footprint post. No build
 * step, no framework. Targets current browsers (Firefox included).
 *
 * One calculator per section. Each reads the inline <input> fields woven
 * into the prose and writes three things: the inline result spans, the
 * step-by-step breakdown in the margin, and the full tables at the end of
 * the post. Reader inputs are treated as exact; the only uncertainty lives
 * in the conversion constants, shown as a low-high range where it is real.
 *
 * Every figure is sourced in the post's methodology section.
 */
(function () {
  "use strict";

  // ---- Constants -----------------------------------------------------------

  // Basic per-task energy, in Wh. Anchored on Google's 0.24 Wh median text
  // prompt; heavier tasks are a stated multiple of it (see methodology).
  var TASK_WH = {
    email: 0.24,   // rewrite an email     ~ 1x  a median prompt
    doc: 2.4,      // summarise 30 pages   ~ 10x (large document to read)
    search: 0.72   // an involved search   ~ 3x  (multi-step, reads sources)
  };

  // Water scales with energy at Google's reported on-site intensity.
  var WATER_ML_PER_WH = 0.26 / 0.24; // ~1.083 ml per Wh

  // Dev energy per million tokens (Simon Couch, informal). Wide on purpose.
  var WH_PER_MTOK_LOW = 390;
  var WH_PER_MTOK_HIGH = 1950;

  // Everyday comparison anchors.
  var KETTLE_WH_PER_L = 116;        // real kettle, 15->100 C, ~85% efficient
  var PHONE_WH = 16.5;              // iPhone 17 Pro battery (~4250 mAh)
  var FLIGHT_CO2_G = 591000;        // ZRH->SIN, SWISS LX176, per passenger
  var BURGER_CO2_G = 7000;          // quarter-pound beef patty
  var BURGER_WATER_ML = 2500000;    // ~2,500 litres
  var DHAL_CO2_G = 400;             // one bowl of lentil dhal
  var DHAL_WATER_ML = 200000;       // ~200 litres

  // Extrapolation horizons.
  var DAYS_PER_YEAR = 365;          // basic use, assumed every day
  // Dev use: a working year. 52 weeks, less 5 weeks of holiday, less a
  // handful of public holidays (Zurich, the ones that fall on weekdays).
  // Vacation scales with the chosen days-per-week; the holidays are a flat
  // subtraction. Default 5-day week: (52 - 5) x 5 - 10 = 225 working days.
  var WEEKS_PER_YEAR = 52;
  var VACATION_WEEKS = 5;
  var PUBLIC_HOLIDAYS = 10;

  // Grid carbon intensity, g CO2 per kWh -- Ember 2024, generation-based.
  var GRID = [
    { name: "Switzerland", g: 41 },
    { name: "EU average", g: 211 },
    { name: "Germany", g: 336 },
    { name: "USA", g: 384 }
  ];
  // The single inline CO2 figure and the flight/meal rows need one grid.
  var REF_GRID = 211; // EU average

  // Coding intensity presets, millions of tokens per hour.
  var INTENSITY = { light: 4.17, typical: 8.33, maxed: 12.5 };

  // ---- Formatting ----------------------------------------------------------

  function sig(n) {
    if (!isFinite(n) || n === 0) return 0;
    var digits = Math.ceil(Math.log10(Math.abs(n)));
    var factor = Math.pow(10, 3 - digits);
    return Math.round(n * factor) / factor;
  }

  function num(n) {
    return sig(n).toLocaleString("en-US");
  }

  // Join a number to its unit with a non-breaking space.
  function unit(n, u) {
    return num(n) + " " + u;
  }

  function energyStr(wh) {
    if (wh < 1000) return unit(wh, "Wh");
    if (wh < 1e6) return unit(wh / 1000, "kWh");
    return unit(wh / 1e6, "MWh");
  }

  function waterStr(ml) {
    if (ml < 1000) return unit(ml, "ml");
    if (ml < 1e6) return unit(ml / 1000, "litres");
    return unit(ml / 1e6, "m³");
  }

  function massStr(g) {
    if (g < 1000) return unit(g, "g");
    if (g < 1e6) return unit(g / 1000, "kg");
    return unit(g / 1e6, "tonnes");
  }

  function boiledStr(wh) {
    var litres = wh / KETTLE_WH_PER_L;
    if (litres < 1) return unit(litres * 1000, "ml");
    return unit(litres, "litres");
  }

  function chargesStr(wh) {
    return num(wh / PHONE_WH) + "×";
  }

  // A value is a point or a low-high range; collapse if the two ends match.
  function range(lo, hi, fn) {
    var a = fn(lo);
    var b = fn(hi);
    return a === b ? a : a + " – " + b;
  }

  // ---- Derived quantities --------------------------------------------------

  // Everything is a function of energy (in Wh). These keep the three output
  // surfaces -- inline, breakdown, tables -- consistent.
  function waterMl(wh) { return wh * WATER_ML_PER_WH; }
  function co2g(wh, grid) { return (wh / 1000) * grid; }

  // ---- The end-of-post tables ---------------------------------------------

  // Build the three resource tables from a daily and yearly energy range.
  function renderTables(container, eLoDay, eHiDay, eLoYear, eHiYear) {
    if (!container) return;

    // data-label drives the mobile card layout (see the CSS).
    function cell(value, columnName) {
      return "<td data-label=\"" + columnName + "\">" + value + "</td>";
    }
    function row(label, fn) {
      return "<tr><th>" + label + "</th>" +
        cell(range(eLoDay, eHiDay, fn), "Per day") +
        cell(range(eLoYear, eHiYear, fn), "Per year") +
        "</tr>";
    }
    function table(caption, bodyRows) {
      return "<table class=\"fc-table\"><caption>" + caption + "</caption>" +
        "<thead><tr><th></th><th>Per day</th><th>Per year</th></tr></thead>" +
        "<tbody>" + bodyRows + "</tbody></table>";
    }

    // The "≈" rows are the same quantity re-pictured, not an extra cost.
    var energy = table("Energy",
      row("Energy used", energyStr) +
      row("≈ water boiled in a kettle", boiledStr) +
      row("≈ iPhone 17 Pro charges", chargesStr));

    var water = table("Water",
      row("Data-centre cooling", function (wh) {
        return waterStr(waterMl(wh));
      }) +
      row("≈ beef burgers", function (wh) {
        return num(waterMl(wh) / BURGER_WATER_ML);
      }) +
      row("≈ bowls of lentil dhal", function (wh) {
        return num(waterMl(wh) / DHAL_WATER_ML);
      }));

    var co2rows = "";
    GRID.forEach(function (c) {
      co2rows += row(c.name, function (wh) { return massStr(co2g(wh, c.g)); });
    });
    // Flight and meal equivalences use the EU-average grid (see methodology).
    co2rows += row("≈ ZRH→Singapore flights", function (wh) {
      return num(co2g(wh, REF_GRID) / FLIGHT_CO2_G);
    });
    co2rows += row("≈ beef burgers", function (wh) {
      return num(co2g(wh, REF_GRID) / BURGER_CO2_G);
    });
    co2rows += row("≈ bowls of lentil dhal", function (wh) {
      return num(co2g(wh, REF_GRID) / DHAL_CO2_G);
    });
    var co2 = table("CO₂, by grid — equivalences use the EU average", co2rows);

    container.innerHTML = energy + water + co2;
  }

  // ---- The margin breakdown ------------------------------------------------

  function bdLine(label, detail, value) {
    return "<tr><th>" + label + "</th><td>" + detail + "</td>" +
      "<td>" + value + "</td></tr>";
  }

  // ---- Basic-usage calculator ---------------------------------------------

  function wireBasic() {
    var emails = document.getElementById("basic-emails");
    var docs = document.getElementById("basic-docs");
    var searches = document.getElementById("basic-searches");
    if (!emails || !docs || !searches) return;

    function val(el) { return Math.max(0, parseFloat(el.value) || 0); }
    function set(id, text) {
      var el = document.getElementById(id);
      if (el) el.textContent = text;
    }

    function update() {
      var nE = val(emails), nD = val(docs), nS = val(searches);
      var whE = nE * TASK_WH.email;
      var whD = nD * TASK_WH.doc;
      var whS = nS * TASK_WH.search;
      var dayWh = whE + whD + whS;
      var yearWh = dayWh * DAYS_PER_YEAR;

      // Inline figures: today.
      set("basic-energy", energyStr(dayWh));
      set("basic-water", waterStr(waterMl(dayWh)));
      set("basic-co2", massStr(co2g(dayWh, REF_GRID)));

      // Inline figures: a year, as flights and meals.
      var yearCo2 = co2g(yearWh, REF_GRID);
      set("basic-flights", num(yearCo2 / FLIGHT_CO2_G));
      set("basic-burgers", num(yearCo2 / BURGER_CO2_G));
      set("basic-dhal", num(yearCo2 / DHAL_CO2_G));

      // Margin breakdown.
      var bd = document.getElementById("basic-breakdown");
      if (bd) {
        bd.innerHTML =
          "<table class=\"fc-bd\"><tbody>" +
          bdLine("Emails", nE + " × 0.24 Wh", energyStr(whE)) +
          bdLine("Documents", nD + " × 2.4 Wh", energyStr(whD)) +
          bdLine("Searches", nS + " × 0.72 Wh", energyStr(whS)) +
          "<tr class=\"fc-bd-sum\"><th>Energy / day</th><td></td><td>" +
          energyStr(dayWh) + "</td></tr>" +
          "<tr><th>Water / day</th><td></td><td>" +
          waterStr(waterMl(dayWh)) + "</td></tr>" +
          "<tr><th>CO₂ / day</th><td></td><td>" +
          massStr(co2g(dayWh, REF_GRID)) + "</td></tr>" +
          "</tbody></table>";
      }

      renderTables(document.getElementById("basic-tables"),
        dayWh, dayWh, yearWh, yearWh);
    }

    [emails, docs, searches].forEach(function (el) {
      el.addEventListener("input", update);
    });
    update();
  }

  // ---- Software-development calculator -------------------------------------

  function wireDev() {
    var intensity = document.getElementById("dev-intensity");
    var tokens = document.getElementById("dev-tokens");
    var hours = document.getElementById("dev-hours");
    var days = document.getElementById("dev-days");
    if (!intensity || !tokens || !hours || !days) return;

    function val(el) { return Math.max(0, parseFloat(el.value) || 0); }
    function set(id, text) {
      var el = document.getElementById(id);
      if (el) el.textContent = text;
    }

    function update() {
      var mtokPerHour = val(tokens);
      var hoursPerDay = val(hours);
      var daysPerWeek = val(days);

      var mtokPerDay = mtokPerHour * hoursPerDay;
      var loDay = mtokPerDay * WH_PER_MTOK_LOW;
      var hiDay = mtokPerDay * WH_PER_MTOK_HIGH;
      var workDays = Math.max(0,
        daysPerWeek * (WEEKS_PER_YEAR - VACATION_WEEKS) - PUBLIC_HOLIDAYS);
      var loYear = loDay * workDays;
      var hiYear = hiDay * workDays;

      // Inline figures: a single day, as a range.
      set("dev-energy", range(loDay, hiDay, energyStr));
      set("dev-water", range(loDay, hiDay, function (wh) {
        return waterStr(waterMl(wh));
      }));
      set("dev-co2", range(loDay, hiDay, function (wh) {
        return massStr(co2g(wh, REF_GRID));
      }));

      // Inline figures: a working year, as flights and meals.
      set("dev-workdays", num(workDays));
      set("dev-flights", range(loYear, hiYear, function (wh) {
        return num(co2g(wh, REF_GRID) / FLIGHT_CO2_G);
      }));
      set("dev-burgers", range(loYear, hiYear, function (wh) {
        return num(co2g(wh, REF_GRID) / BURGER_CO2_G);
      }));
      set("dev-dhal", range(loYear, hiYear, function (wh) {
        return num(co2g(wh, REF_GRID) / DHAL_CO2_G);
      }));

      // Margin breakdown.
      var bd = document.getElementById("dev-breakdown");
      if (bd) {
        bd.innerHTML =
          "<table class=\"fc-bd\"><tbody>" +
          bdLine("Tokens / day", num(mtokPerHour) + "M × " + num(hoursPerDay) + " h",
            num(mtokPerDay) + "M") +
          bdLine("Energy rate", "390–1,950 Wh / M", "") +
          "<tr class=\"fc-bd-sum\"><th>Energy / day</th><td></td><td>" +
          range(loDay, hiDay, energyStr) + "</td></tr>" +
          "<tr><th>Water / day</th><td></td><td>" +
          range(loDay, hiDay, function (wh) { return waterStr(waterMl(wh)); }) +
          "</td></tr>" +
          "<tr><th>CO₂ / day</th><td></td><td>" +
          range(loDay, hiDay, function (wh) {
            return massStr(co2g(wh, REF_GRID));
          }) + "</td></tr>" +
          "</tbody></table>";
      }

      renderTables(document.getElementById("dev-tables"),
        loDay, hiDay, loYear, hiYear);
    }

    // Picking an intensity prefills tokens-per-hour; the reader can edit it.
    intensity.addEventListener("change", function () {
      var preset = INTENSITY[intensity.value];
      if (preset !== undefined) tokens.value = preset;
      update();
    });
    [tokens, hours, days].forEach(function (el) {
      el.addEventListener("input", update);
    });
    update();
  }

  // ---- Boot ----------------------------------------------------------------

  function init() {
    wireBasic();
    wireDev();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
