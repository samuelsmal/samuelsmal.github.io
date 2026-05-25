---
layout: post
title:  "Counting the footprint of your LLM use"
date:   "2026-05-18"
tags:
  - ai
  - environment
  - tool
---

<style>
/* ---- Inline fill-in-the-blank inputs and computed outputs ---- */
.fc-in {
  font: inherit;
  color: inherit;
  text-align: center;
  background: rgba(128, 128, 128, 0.12);
  border: none;
  border-bottom: 1.5px solid currentColor;
  border-radius: 2px 2px 0 0;
  padding: 0 0.15em;
  width: 3.2em;
}
select.fc-in {
  width: auto;
  text-align: left;
}
.fc-in:focus {
  outline: 2px solid rgba(120, 160, 255, 0.6);
  outline-offset: 1px;
}
.fc-out {
  font-weight: 700;
}
/* Keeps a value and its unit (e.g. "7 kg") from breaking across two lines. */
.nowrap {
  white-space: nowrap;
}

/* ---- Step-by-step breakdown, floated into the right margin ---- */
.fc-breakdown {
  float: right;
  clear: right;
  width: 50%;
  margin-right: -60%;
  margin-top: 0.3rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0.7rem;
  background: rgba(128, 128, 128, 0.07);
  border-radius: 3px;
  font-size: 1.05rem;
  line-height: 1.3;
}
.fc-breakdown .fc-bd {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
.fc-breakdown .fc-bd th,
.fc-breakdown .fc-bd td {
  text-align: left;
  padding: 0.15rem 0.35rem;
  vertical-align: top;
  font-weight: 400;
}
.fc-breakdown .fc-bd td:last-child {
  text-align: right;
}
.fc-breakdown .fc-bd-sum th,
.fc-breakdown .fc-bd-sum td {
  border-top: 1px solid currentColor;
  font-weight: 700;
}

/* ---- The full tables at the end of the post ---- */
.fc-tables {
  width: 55%;
}
.fc-tables .fc-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0.6rem 0 1.8rem;
  font-size: 1.15rem;
}
.fc-tables .fc-table caption {
  text-align: left;
  font-style: italic;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.fc-tables .fc-table th,
.fc-tables .fc-table td {
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  text-align: left;
  vertical-align: top;
  overflow-wrap: break-word;
}
.fc-tables .fc-table th:first-child,
.fc-tables .fc-table td:first-child {
  width: 42%;
}
.fc-tables .fc-table thead th {
  border-bottom: 1px solid rgba(128, 128, 128, 0.7);
}
.fc-tables .fc-table td {
  font-variant-numeric: tabular-nums;
}

/* The wide right margin is gone on narrow screens: the breakdown becomes
   an ordinary block, and the tables stack into labelled cards. */
@media (max-width: 760px) {
  .fc-breakdown {
    float: none;
    width: 100%;
    margin: 1.2rem 0;
    border: 1px solid rgba(128, 128, 128, 0.4);
  }
  .fc-tables {
    width: 100%;
  }
}
@media (max-width: 540px) {
  .fc-tables .fc-table thead {
    display: none;
  }
  .fc-tables .fc-table,
  .fc-tables .fc-table caption,
  .fc-tables .fc-table tbody,
  .fc-tables .fc-table tr,
  .fc-tables .fc-table th,
  .fc-tables .fc-table td {
    display: block;
    width: auto;
  }
  .fc-tables .fc-table tr {
    border: 1px solid rgba(128, 128, 128, 0.4);
    border-radius: 3px;
    margin-bottom: 0.6rem;
    padding: 0.15rem 0.7rem;
  }
  .fc-tables .fc-table th:first-child {
    font-weight: 700;
    padding: 0.4rem 0 0.3rem;
    border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  }
  .fc-tables .fc-table td {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: none;
    padding: 0.3rem 0;
  }
  .fc-tables .fc-table td::before {
    content: attr(data-label);
    font-weight: 600;
  }
}
</style>

Ever wondered how much energy, water and CO<sub>2</sub> your LLM / AI workflow is using? Ever read
an article that claims that LLMs are using an absurd amount of resources? Like that a single prompt
would boil a bottle of water?

And then ever read a few articles that claim that the usage is totally overblown?

And then ever wanted a calculator that gives you numbers and puts them into relation to something
that you can somewhat understand? Well, look no further.

Quick disclaimer: getting accurate values is extremely difficult and the definition of *usage* is
not clear either. About the latter, this calculator only counts inference, meaning the resources
used while running a model. Getting information about actual training costs is even more complex and
companies are not really open about their methodologies, including creating the datasets, which is
not cheap either. Getting inference resource usage down to a single prompt is also very
back-of-the-envelope style. An LLM very rarely processes a single prompt, a lot of prompts are
batched together for efficiency reasons, there is caching, harnesses that format both the in- and
output and much more that plays a role. All of these features are in heavy development and are
changing rapidly. Thus, what really is your part of all this?

For the former, not only are the models improving fast, the underlying hardware stack is as well.
Meaning that running the same model might be 33% cheaper next year — at least if you believe Google's
claims. And newer models and more attuned setups that use different and more fitting models for a
given task might influence the consumption as well.

Given that, expect these values to be inaccurate today, and probably very much off in a year.
See section [methodology](#methodology-and-sources) for the rest of the caveats.

## The raw numbers

A single, median, everyday prompt to a modern assistant — the kind that doesn't "think" before
answering, no reasoning model — costs roughly:

- **0.24 Wh** of energy,
- **0.26 ml** of water (used to cool the data centre), and
- about **0.03 g** of CO<sub>2</sub> on Google's own relatively clean electricity.

Those come from Google's 2025 measurements of their Gemini service, which is the most transparent
number anyone has published. They are small. 0.24 Wh is about four minutes of a modern 3.8 W LED bulb.
0.26 ml of water is about five drops.

## Everyday use

How does this relate to ordinary, everyday use — asking questions, drafting emails, helping
with homework, looking things up? Fill in the blanks; the breakdown in the
margin keeps the running sum.

<p class="fc-sentence">
Say that on a typical day you ask your favourite chatbot to rewrite
<input type="number" class="fc-in" id="basic-emails" value="5" min="0" step="1" inputmode="numeric">
emails, summarise
<input type="number" class="fc-in" id="basic-docs" value="2" min="0" step="1" inputmode="numeric">
thirty-page documents, and run
<input type="number" class="fc-in" id="basic-searches" value="4" min="0" step="1" inputmode="numeric">
more involved web searches. That comes to about
<span class="fc-out" id="basic-energy">…</span> of energy,
<span class="fc-out" id="basic-water">…</span> of water and
<span class="fc-out" id="basic-co2">…</span> of CO<sub>2</sub> for the day.
<span class="fc-breakdown" id="basic-breakdown"></span>
</p>

<p>
Keep that up every day for a year and the CO<sub>2</sub> adds up to roughly
<span class="fc-out" id="basic-flights">…</span> flights from Zurich to Singapore
— or, put as food, the carbon of <span class="fc-out" id="basic-burgers">…</span>
beef burgers, set against <span class="fc-out" id="basic-dhal">…</span> bowls of lentil
dhal.<label for="sn-burger_vs_dhal_explanation" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-burger_vs_dhal_explanation" class="margin-toggle"/><span class="sidenote">
Remember that a bowl of dhal is far lighter than a beef burger: about a seventeenth of the CO<sub>2</sub>
(<span class="nowrap">0.4 kg</span> against <span class="nowrap">7 kg</span>) and a twelfth of the water (200 against <span class="nowrap">2,500 litres</span>). That gap is
why the same yearly footprint works out to roughly seventeen times as many bowls of dhal as
burgers.</span></p>

The exact weights for the different tasks can be found below in the
[methodology](#methodology-and-sources) section. The water is literal — litres evaporated to
cool the servers, not a figure of speech. The CO<sub>2</sub> in the sentence uses the EU-average grid;
the [full breakdown](#the-full-breakdown) splits it across four countries.

For most people, this says something fairly calming: ordinary chatbot use, even every day for
a year, is a small thing next to a commute or a diet. 

## Software development

But for heavy users, among whom I count myself, the picture is different.

When you write software with an AI agent — Claude Code, and tools like it — you
are not sending a prompt and reading a reply. The agent uses a **reasoning** model, which
generates a long internal "thinking" pass before it answers, and it runs in a loop: read
files, edit, run tests, read the output, try again. It re-reads the context on every step. A
single instruction from you can quietly turn into millions of tokens of model work. So the
unit here is not "prompts" — it is **tokens per hour**.<label for="sn-heavy_usage_explanation" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-heavy_usage_explanation" class="margin-toggle"/><span class="sidenote">
Of course the full picture and explanation of the usage is more complicated. Coding agents also pull
in much more information, there is additional network traffic, caching of input and responses, and
much, much more. But the abstraction is useful to get you in the ballpark of the consumption.</span>

<p class="fc-sentence">
Now picture writing software with an AI agent. Working at
<select class="fc-in" id="dev-intensity">
<option value="light">light</option>
<option value="typical" selected>typical</option>
<option value="maxed">maxed-out</option>
</select>
intensity — about
<input type="number" class="fc-in" id="dev-tokens" value="8.33" min="0" step="0.01" inputmode="decimal">
million tokens an hour — for
<input type="number" class="fc-in" id="dev-hours" value="8" min="0" step="0.5" inputmode="decimal">
hours a day,
<input type="number" class="fc-in" id="dev-days" value="5" min="0" max="7" step="1" inputmode="numeric">
days a week, a single working day comes to
<span class="fc-out" id="dev-energy">…</span> of energy,
<span class="fc-out" id="dev-water">…</span> of water and
<span class="fc-out" id="dev-co2">…</span> of CO<sub>2</sub>.
<span class="fc-breakdown" id="dev-breakdown"></span>
</p>

<p>
Over a working year<label for="sn-working_year" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-working_year" class="margin-toggle"/><span class="sidenote">52 weeks, minus five weeks of holiday and ten public holidays, comes to about <span class="fc-out" id="dev-workdays">…</span> working days.</span> that is roughly <span class="fc-out" id="dev-flights">…</span>
Zurich–Singapore flights of CO<sub>2</sub> — the carbon of
<span class="fc-out" id="dev-burgers">…</span> beef burgers, against
<span class="fc-out" id="dev-dhal">…</span> bowls of lentil dhal.
</p>

Picking an intensity fills in the tokens-per-hour field — then change it to whatever you
like, the number is yours. For reference, the "maxed-out" preset is a 100-million-token day:
eight hours of near-continuous agentic coding, hammering a Claude Max 5× plan for roughly
what it will give you (at the time of writing). The "light" and "typical" presets are a third and
two thirds of that.

You will also notice the numbers come as a **range**, and a wide one. That is honest, not
sloppy. Nobody — not Anthropic, not anyone — has published measured energy data
for an AI coding agent (please let me know if you found a source). The range comes from Simon
Couch's careful back-of-the-envelope estimate, between 390 and <span class="nowrap">1,950 Wh</span>
per million tokens. He himself calls it informal. 

## Could running models locally fix this?

A reasonable thought, once you have seen the dev numbers: what if the model ran on your own
laptop instead of in a data centre? No cooling towers, no one else's grid.

Honestly, I don't know — as far as I can tell, nobody has calculated the impact.

What I can do is point at the shape of the answer:

- **The water mostly goes away.** Data-centre water is evaporative cooling. Your laptop has a
  small fan. The "data-centre cooling" line would drop towards zero. The water it took to
  *generate* your laptop's electricity is still there, but the dramatic number disappears.
- **The energy does not vanish — it moves, and probably grows per token.** A data
  centre is brutally optimised: purpose-built accelerators, high utilisation. A laptop is
  not. The same work likely costs *more* energy on your machine, not less — you have
  just moved it onto your own electricity bill and your own grid.
- **The big models won't fit.** The reasoning models that make agentic coding strong need
  far more memory than a laptop has. Locally you run a smaller, weaker model. So you are not
  comparing like with like: it is not "the same thing, cheaper", it is "a lesser thing". <label for="sn-local_models" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-local_models" class="margin-toggle"/><span class="sidenote">
But this is changing fast. You can now run [Gemma 4](https://deepmind.google/models/gemma/gemma-4/)
locally on your laptop. And this is a full-blown Mixture-of-Experts model. It might not be as
[performant](https://llm-stats.com/models/compare/claude-opus-4-6-vs-gemma-4-e4b-it), but it can
solve a lot of daily issues already.</span>

My honest guess is that local models change *who pays and how it is cooled* more than they
change the total energy. 

## The full breakdown

Now let's compile the above into a table, including some comparisions. They use the input from
above.

The **water boiled in a kettle** is how much cold tap water that electricity could bring to the
boil,<label for="sn-kettle" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-kettle" class="margin-toggle"/><span class="sidenote">Heating one litre of tap water from
<span class="nowrap">15 °C</span> to boiling takes about <span class="nowrap">99 Wh</span> in
theory; a real electric kettle is roughly <span class="nowrap">85 %</span> efficient, so call it
<span class="nowrap">116 Wh</span> per litre — the figure the "water boiled" line uses.</span> and
**iPhone 17 Pro charges** is how many times you could refill that phone. The flight and the two
meals convert the CO<sub>2</sub> using the EU-average grid.

### Everyday use

<div class="fc-tables" id="basic-tables"></div>

### A coding day

<div class="fc-tables" id="dev-tables"></div>

## Methodology and sources

A few things you should know before trusting any number above.

**Inference only.** Every figure is the cost of *running* a model, not training it. Training
is large and one-off; your daily use does not add to it.

**How the everyday tasks are weighted.** The everyday calculator does not treat every prompt
alike. Google's 0.24 Wh is a *median* prompt; rewriting a short email is about that, so it
counts as **1×**. Summarising a thirty-page document means feeding the model a far larger
text, so I count it as roughly **10×** a median prompt; an involved web search, which sends
the model off to read several pages, as about **3×**. 

**Your inputs are treated as exact.** When you type "five emails" or "eight hours", the
calculator believes you completely. All the uncertainty lives in the conversion factors
— and where that uncertainty is real, it is shown as a low–high range rather than
hidden behind a single number.

**Solid numbers vs. napkin maths.** The per-prompt figures (0.24 Wh, 0.26 ml) come from
Google's own published measurements and are about as good as public data gets. The
software-development figures do *not* have an equivalent — they rest on Simon Couch's
informal estimate. That is why the everyday sentence gives a point and the dev one gives a
range. Do not read the dev numbers as precise.

**Water is on-site only.** The "data-centre cooling" water is the water evaporated at the
data centre. It does not include the (often larger) water used by the power plants that made
the electricity. Counting that would push every water number up.

**CO<sub>2</sub> is computed from the grid.** The calculator takes the energy and multiplies it by each
country's electricity carbon intensity, using Ember's 2024 figures: **41 g/kWh** for
Switzerland, **211** for the EU average, **336** for Germany and **384** for the USA. These
are *generation-based* — the emissions of the electricity produced in that
country.<label for="sn-ch-grid" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-ch-grid" class="margin-toggle"/><span class="sidenote">Switzerland is the awkward one. The
electricity it generates is very clean, but it imports a lot, especially in winter. Counting those
imports, the carbon intensity of the electricity actually consumed in Switzerland is closer to <span
class="nowrap">98 g/kWh</span>.</span> The single CO<sub>2</sub> figure in the sentences, and the
flight and meal equivalences, use the EU-average grid; the tables split it across all four. Google's
own reported 0.03 g per prompt is lower than these because Google buys cleaner electricity than the
average.

**The flight and the meals.** The flight is one passenger, one-way, Zurich→Singapore on SWISS
(flight <span class="nowrap">LX 176</span>): **<span class="nowrap">591 kg CO<sub>2</sub>e</span>**,
from the Travel Impact Model that Google Flights uses. A typical airline on that route comes out a
little higher, near 700 kg. The beef burger is a quarter-pound patty at roughly **7 kg
CO<sub>2</sub>e** and **2,500 litres** of water; a bowl of lentil dhal at roughly **0.4 kg
CO<sub>2</sub>e** and **200 litres**. Food footprints vary widely between sources, farms and recipes
— treat these as order-of-magnitude, with the burger-to-dhal gap, not the exact digits, as the
message.

# Sources

- **Per-prompt energy and water:** Google, *Measuring the environmental impact of AI
  inference*
  ([blog](https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference/),
  [paper](https://arxiv.org/html/2508.15734v1)); Epoch AI,
  [*How much energy does ChatGPT use?*](https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use);
  Jegham et al., [*How Hungry is AI?*](https://arxiv.org/html/2505.09598v1); Hannah Ritchie,
  [*What's the carbon footprint of using ChatGPT?*](https://hannahritchie.substack.com/p/ai-footprint-august-2025).
- **AI coding agent energy:** Simon P. Couch,
  [*Electricity use of AI coding agents*](https://simonpcouch.com/blog/2026-01-20-cc-impact/)
  — the 390–1,950 Wh-per-million-tokens range.
- **AI water use:** [Brookings, *AI, data centers, and water*](https://www.brookings.edu/articles/ai-data-centers-and-water/);
  [ScienceDirect, *The carbon and water footprints of data centers*](https://www.sciencedirect.com/science/article/pii/S2666389925002788).
- **Grid carbon intensity (2024):** Ember,
  [*Global Electricity Review 2025*](https://ember-energy.org/latest-insights/global-electricity-review-2025/major-countries-and-regions/)
  (Switzerland, EU, Germany) and
  [*US Electricity 2025*](https://ember-energy.org/latest-insights/us-electricity-2025-special-report/insight-4-rising-demand-pushes-up-emissions-slight/)
  (USA); cross-checked against [Our World in Data](https://ourworldindata.org/grapher/carbon-intensity-electricity).
  The Swiss consumption-based figure is from
  [Energyscope, EPFL](https://www.energyscope.ch/en/questions/does-switzerland-emit-comparatively-little-cosub2/sub-thanks-to-its-very-clean-electricity/).
- **Flight emissions:** the
  [Travel Impact Model](https://travelimpactmodel.org/) (the data behind Google Flights),
  route ZRH–SIN.
- **Food footprints:** Our World in Data / Poore & Nemecek,
  [greenhouse-gas emissions per kg of food](https://ourworldindata.org/grapher/ghg-per-kg-poore);
  [Water Footprint Network](https://www.waterfootprint.org/time-for-action/what-can-consumers-do/)
  and the World Economic Forum,
  [*how much water is in your burger*](https://www.weforum.org/stories/2019/02/this-is-how-much-water-is-in-your-burger/).
- **Data-centre scale, for context:** [IEA, *Energy and AI*](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai);
  [Pew Research, *Energy use at U.S. data centers*](https://www.pewresearch.org/short-reads/2025/10/24/what-we-know-about-energy-use-at-us-data-centers-amid-the-ai-boom/).

<script src="{{ '/assets/js/llm-footprint.js' | relative_url }}"></script>
