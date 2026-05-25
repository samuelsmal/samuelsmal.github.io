---
layout: post
title:  "Agentic Engineering"
date:   "2026-05-12"
tags:
  - agentic-engineering
  - software-development
---


## Definition

Agentic Engineering is the practice of building software with AI agents under the discipline of a real software development lifecycle — specification, design, implementation, verification, and review.

## Thesis

Agents don't speed up your org; they expose that the capacity to absorb changes was always the constraint.

## Reader

Head of Data at a Swiss insurance company, ~6.5k employees, old processes, has tried agentic tooling and concluded "we tried it, didn't see improvements." Has agency to restructure how work flows.

## Why now

- Models crossed a real quality threshold; toolchains have consolidated (chats → skills → frameworks).
- Enterprises have ~12 months of failed pilots — the lived disappointment is recent. The post answers *why* it failed for them.

## Spine

### Frame (opening)

You've read fifty tools/framework posts. This one is about why your org didn't accelerate after adopting them. The industry obsesses over tools; the value was always in outcomes.

### Opening scene

Commit to one artifact (don't list multiple):

- The colleague who runs an agent code reviewer then discards the output. (Strongest — one person doing the exact thing the post diagnoses.)
- Alternative: the staff engineer at a Swiss bank refusing to review a 1k-line PR.
- Alternative: the Head of Data's *"we tried it, didn't see improvements."*

### Section 1 — Two failure modes, one bottleneck

Junior-heavy orgs and strict-SDLC orgs are the same failure mode under different costumes. Both load the change-absorption bottleneck. The old SDLC was rational when code production was the constraint (Jenny Wen: three months of catastrophic rework). Hiring juniors was rational for the same reason. Both were responses to *the labor of producing working code* being the scarce resource. When that scarcity dissolves, the structures built around it become overhead.

### Section 2 — Trust envelope, not producer reliability

Steel-manned counter: *"Agentic output isn't trustworthy enough to deploy without senior review of every line; the bottleneck is technology maturity, not org shape."*

Rebuttal: trust has never come from the producer being reliable. We don't trust junior engineers; we trust the verification pipeline that catches their mistakes. The same envelope works for agents — specification → design → implementation → verification → review — if you build it. The producer's species doesn't matter.

(Avoid the weaker "humans make mistakes too" framing — leads with the wrong axis.)

### Section 3 — Cost asymmetry of waiting

The instinct to "wait for maturity" is calibrated to tools whose acquisition cost falls over time. Agentic engineering's real cost is *organizational restructure*, and that cost runs the other way: orgs calcify, talent leaves, competitive position decays. Waiting compounds the bill.

### Section 4 — Shrink the absorption surface

Principle, not headcount: shrink the absorption surface until review fits inside the team that produced the change. The 3-person team is one shape — max three people, peer-only review, strip SCRUM ceremonies and design review, only decision-makers in the room. Other shapes exist (smaller PRs, fewer approvers, co-located decision-makers). The principle is the point.

## Footnotes / parentheticals

- Planning and estimates are meaningless now.
- Juniors + agents = 10× mistakes loaded onto an already-overloaded review queue (the corollary of Section 1).
- Pointer to a future post: black-box testing as the right verification posture for agent-produced code.

## Payoff

> *How many people touch a change before it ships?*

One question. One unit. One number the reader can put on their own org tomorrow.

## Evidence inventory

- The colleague who runs an agent code reviewer and discards the output.
- The Swiss bank staff engineer refusing to review a 1k-line PR.
- The Head of Data at a Swiss insurance company, ~6.5k employees: *"we tried it, didn't see improvements."*
- Jenny Wen (Anthropic design lead) on three months of catastrophic design rework being the old failure mode that justified heavy upfront design.

## Steel-manned counter (for reference)

*"Even in a perfectly restructured org with three-person teams and stripped governance, agentic output isn't high enough quality to deploy without senior review of every line — so the actual bottleneck isn't org shape, it's that the technology isn't yet good enough to trust. Reorganizing around an immature capability is premature; the right move is to wait."*

Addressed by Sections 2 and 3.
