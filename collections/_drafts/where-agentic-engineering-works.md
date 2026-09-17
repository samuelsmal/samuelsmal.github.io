---
layout: post
title:  "Where Agentic Engineering Works"
date:   "2026-08-18"
tags:
  - agentic-engineering
  - software-development
  - organisation
charts:
  sdlc:
    caption: |
      Speedup is not uniform across the lifecycle. The slowest unchanged step sets
      end-to-end cycle time — which is why one person reports a tenfold gain and
      another reports none, and both are telling the truth about different steps.
    source: "Qualitative observation, client work and internal conversations, 2025–26. Not a measured result."
    bars:
      - label: "Ideate / explore"
        note: "prototyping, mockups"
        level: high
      - label: "Spec / design"
        note: "drafts, diagrams"
        level: mid
      - label: "Code / boilerplate"
        note: "the vendor benchmark"
        level: high
      - label: "Review"
        note: "human-bottlenecked"
        level: none
      - label: "Test"
        note: "generation helps"
        level: mid
      - label: "Deploy"
        note: "infra + policy"
        level: none
      - label: "Operate"
        note: "observability, RCA"
        level: mid
---





# Writing notes


Merged notes: the sharpening session (positive case, medical-device project) plus the ideas from
the earlier `agentic-engineering.md` draft (failure case). Bullets only — structure comes with
writing.

## Definition

- Agentic Engineering: building software with AI agents under the discipline of a real software
  development lifecycle — specification, design, implementation, verification, review.

## The claim, in pieces (still needs to be one sentence)

- Agents reduce time spent on coding. Nothing else.
- Therefore the gain you realise is bounded by the share of your time currently spent coding.
  If that share is small, output does not move.
- The other side of the same coin (earlier draft's thesis): *agents don't speed up your org; they
  expose that the capacity to absorb changes was always the constraint.*
- Small teams / high autonomy are a **precondition**, not the cause. They are what lets the freed
  capacity be reabsorbed. Long decision chains mean freed capacity has nowhere to go — you wait
  longer, with idle hands.
- Output ≠ value / outcome. Freed capacity spent on the wrong thing is worse than nothing.
  Still have to make good decisions on what to build — not tokenmaxxing.

## Reader

- Head of Data at a Swiss insurance company, ~6.5k employees, old processes. Has tried agentic
  tooling and concluded *"we tried it, didn't see improvements."* Has the agency to restructure how
  work flows.
- Test for every section: does this tell that person what to do on Monday?

## Why now

- Models crossed a real quality threshold; toolchains consolidated (chats → skills → frameworks).
- Enterprises have ~12 months of failed pilots behind them. The disappointment is recent and lived.
  The post answers *why* it failed for them — and what the success case actually looked like.

## The numbers in tension

- Google: ~2% company-wide productivity gain (TODO citation). Company-wide, end-to-end — a lot,
  at that scale.
- My claim: ~10x on one project. Not a hard measurement.
- The trap: the old slide already says *what someone measured determines what they see*. A post
  comparing 2% to 10x has to name the denominator or it commits the error it warns about.

## The project (medical device manufacturer) — first-hand evidence

- Went from overwhelmed with tasks → actually delivering.
- Months of building before the switch; after switching to agentic engineering, delivery got fast.
- Anecdote (the spine): modifying the dashboard after a round of user feedback used to take a couple
  of weeks. Now: an afternoon — development started *during* the session.
- Regulated industry. The last place a reader expects short decision chains. Use that tension,
  don't hide it.

## What did NOT speed up — the controlled experiment

- Talking to users. Long-term testing with them. Bounded by physical reality.
- But: we now have the *time* to do it.
- Time split changed: used to be mostly research/building → now talking to actual users, guiding
  agents, reviewing code and architecture, supporting the team.
- Organising experiments and meetings used to be tricky — it disrupted the team's flow. Now we are
  much more flexible.
- **This is the mechanism**: building stopped rationing everything else.

## Two failure modes, one bottleneck

- Junior-heavy orgs and strict-SDLC orgs are the same failure mode in different costumes. Both load
  the change-absorption bottleneck.
- The old SDLC was rational when code production was the constraint (Jenny Wen: three months of
  catastrophic design rework). Hiring juniors was rational for the same reason.
- Both were responses to *the labour of producing working code* being scarce. When that scarcity
  dissolves, the structures built around it become overhead.
- Corollary: juniors + agents = 10x the mistakes loaded onto an already-overloaded review queue.
  (Open question from the older draft: where do senior engineers come from then?)

## Trust is an envelope, not a property of the producer

- Steel-manned counter: *"Agentic output isn't trustworthy enough to deploy without senior review of
  every line; the bottleneck is technology maturity, not org shape. Reorganising around an immature
  capability is premature — the right move is to wait."*
- Rebuttal: trust never came from the producer being reliable. We don't trust junior engineers; we
  trust the verification pipeline that catches their mistakes. The same envelope works for agents —
  spec → design → implementation → verification → review — if you build it. The producer's species
  doesn't matter.
- Avoid the weaker "humans make mistakes too" framing. Wrong axis.

## Cost asymmetry of waiting

- The instinct to "wait for maturity" is calibrated to tools whose acquisition cost falls over time.
- Agentic engineering's real cost is *organisational restructure*, and that cost runs the other way:
  orgs calcify, talent leaves, competitive position decays. Waiting compounds the bill.

## Shrink the absorption surface

- Principle, not headcount: shrink the absorption surface until review fits inside the team that
  produced the change.
- The three-person team is one shape — peer-only review, SCRUM ceremonies and design review
  stripped, only decision-makers in the room. Other shapes exist: smaller PRs, fewer approvers,
  co-located decision-makers.
- The principle is the point, not the number three.

## The stage framing (old slides)

{% include chart-bars.html chart=page.charts.sdlc %}

- Speedup is not uniform across the SDLC: ideate, spec/design, code/boilerplate see gains; review
  and deploy essentially unchanged; test and operate modest.
- The slowest unchanged step dominates end-to-end cycle time.
- Still valid — useful to explore and explain the argument — but **incomplete**: it has no
  decision-making axis. Missing question: when a new idea appears, how long until it is validated,
  implemented and rolled out?
- This is the wrong-but-tempting version: it points at pipeline shape when the binding constraint is
  org shape.

## Process changes that fell out of it

- Writing Jira tasks *during* development.
- Task-level planning basically useless. Estimations off anyway.
- We changed a lot about how we work — the post should reflect that.
- Architecture debates (mono vs many repos, micro vs monolith) settled themselves: clear, small
  boundaries fit context windows and allow parallel work on 5–10 parts at once.

## Candidate opening scenes — commit to one

- The colleague who runs an agent code reviewer and then discards the output. (Strongest: one person
  doing the exact thing the post diagnoses.)
- The staff engineer at a Swiss bank refusing to review a 1k-line PR.
- The Head of Data's *"we tried it, didn't see improvements."*
- The dashboard changed in an afternoon, during the user session, at a medical device manufacturer.

## Payoff

- One question the reader can put on their own org tomorrow:
  **How many people touch a change before it ships?**

## Footnotes / parentheticals / future posts

- Planning and estimates are meaningless now.
- Black-box testing as the right verification posture for agent-produced code (future post).
- Security: supply-chain attack surface grows (TODO list them).
- Discovery and selection bias: LLMs reach for tools that occur often in training data
  (TODO citation).

## What others report — the spread, with sources

The numbers below are the post's raw material: they run from −19% to +109%, and
almost none of them are measuring the same thing. That spread *is* the argument.

### The pessimistic pole

- **METR, July 2025** — randomised controlled trial, 16 experienced open-source
  developers, 246 issues in repos they had worked on for ~5 years:
  > "When developers are allowed to use AI tools, they take 19% longer to complete issues"

  And the perception gap, which is the quotable part:
  > "developers expected AI to speed them up by 24%, and even after experiencing the
  > slowdown, they still believed AI had sped them up by 20%"

  Their own caveat, worth quoting so nobody else has to:
  > "We do not claim that our developers or repositories represent a majority or
  > plurality of software development work"

  <https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/>

- **DORA, 2024** — every 25% rise in AI adoption was associated with roughly a
  **1.5% drop in throughput**. A year later that sign flipped positive, while the
  negative relationship with delivery *stability* stayed.
  <https://dora.dev/insights/balancing-ai-tensions/>

### The middle — where the large-N studies land

- **Sundar Pichai (Lex Fridman Podcast, 2025)** — the number to use instead of the
  2% in my head; I could not source a 2% figure anywhere:
  > "The most important metric, and we carefully measure it, is how much has our
  > engineering velocity increased as a company due to AI?"

  His answer: about **10%**. Company-wide, end-to-end, measured as engineering
  capacity returned in hours per week.

- **Stanford, Denisov-Blanch et al.** — 100k+ developers, 600+ companies, senior
  engineers grading actual code changes: **15–20% on average**, but the average
  hides everything. Gains concentrate in greenfield, low-complexity, popular-language
  work; on complex brownfield code the effect can go negative.
  <https://yegordb.com/>

- **DORA, 2025** — 90% of developers use AI, >80% report a productivity gain, and
  AI's role is framed as an **amplifier**: it magnifies the strengths of
  high-performing organisations and the dysfunctions of struggling ones.
  <https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report>

### The optimistic pole — and what it cost them

- **Faros AI, July 2025** — 10,000+ developers, 1,255 teams:
  > "Developers using AI complete 21% more tasks and merge 98% more pull requests"

  Then the sentence that belongs in this post:
  > "PR review time increases 91%"

  and the one that belongs in bold:
  > "we observed no significant correlation between AI adoption and improvements at
  > the company level"

  Average PR size up 154%; bugs per developer up 9%.
  <https://www.faros.ai/blog/ai-software-engineering>

- **He, Agarwal, Denisov-Blanch, Azaletskiy, Koyejo, Vasilescu (arXiv 2607.01904,
  July 2026)** — *"AI Writes Faster Than Humans Can Review: A Longitudinal Study of
  an Enterprise 2x Mandate."* 802 developers, 196,212 pull requests, Jan 2024 –
  Apr 2026:
  > "per-capita throughput eventually doubled, reaching 2.09x the pre-mandate
  > baseline in April 2026, among the largest gains reported from a field deployment
  > of AI coding tools to our knowledge"

  How they paid for it — this is the absorption-capacity argument, measured:
  > "Adoption also restructured code review around automation: per-reviewer load
  > roughly doubled and automated review overtook human review, while merge and
  > revert rates held steady."

  <https://arxiv.org/abs/2607.01904>

### The arithmetic that reconciles them

- If coding is ~20% of the end-to-end cycle, making it 10x faster yields ~1.25x
  overall. Amdahl's law, wearing a hoodie. (Widely repeated in 2026 commentary;
  find a citable original before using it, or derive it myself — it is one line.)

### How to use this

- The spread is not noise and it is not people lying. METR measured senior devs on
  mature repos; Faros measured PR counts; the 2x-mandate paper measured merged PRs
  after they rebuilt review; Pichai measured hours returned across a company that
  cannot restructure its decision chain.
- Every one of them is honest about a different step. My 10x is honest about a
  different step again — and the post has to say which one before it claims anything.
- The 2x-mandate paper is the strongest evidence *for* my argument that I did not
  produce: the only org in the literature that doubled throughput is the one that
  rebuilt the absorption step instead of waiting for it to cope.


<label for="sn-ghost_engineers" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-ghost_engineers" class="margin-toggle"/><span class="sidenote">
As a sidenote, apparently ["\~9.5% of software engineers do virtually
nothing"](https://xcancel.com/yegordb/status/1859290734257635439). Which aligns quite surprisingly
well with Jack Welch's [vitality curve](https://en.wikipedia.org/wiki/Vitality_curve) from the
1980s.</span>

## Open

- The one-sentence claim.
- Who disagrees, by name, and what they say.
- Denominator for the 10x.
- Which opening scene.
