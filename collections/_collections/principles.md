---
layout: post
title: Principles
date: 2022-06-05
description: |
  Just a list of principles that I collected over the years. Some apply to programming, some to
  software engineering, some to general life.
---

## Fundamentals


- Get it done.
- Nobody cares for your project / idea / app as long you can't show that it works.
- Strive for pragmatic solutions.
- Ownership is important, but don't get attached to your stuff.
- Take breaks and think it through.
- Expand your horizon, read papers and books, discuss, go to conferences, mingle.

## Interaction

- Be kind, not nice.
- A small, tight-knit team should be the aim to create things.
- Remember that most people have a different background and might interpret "context" differently.
- Listen, think, then talk.
- Don't work in isolation.

## Code

- Aim for pure functions. It keeps the mental load low.
- Types are there to help you, use them.
- Code for a in-use project will most-likely be adapted in the future, prepare for it, but don't
    overprepare. Think of it like a garden.
- Use a common and project-wide linter. Enforce it.
- Strive for maintainable code. You and the next engineer touching it will thank you.
- If possible create a local version of your platform.
- Prefer languages that are easily tracked using version control.
- Use a common internal tooling.

## Design

- There is no complex system that didn't originate from a simple one, thus start simple and iterate.
  [Gall's Law](https://en.wikipedia.org/wiki/John_Gall_(author)#Gall's_law).
- Prefer immutable state and flow.
- Look around how others have done something similar. Try not to shoebox your current problem.
- Data will change. Plan to handle this.
- Include unified logging and auditability from the very start. You'll need it.
- Everything is code, except for configuration.
- The **what** and the **how** are not the same, separate them and design your system is such a way
    that the **how** can be exchanged and can adapt to changes in the **what**.
- Aim towards being replaceable. You don't get payed for your solutions but for the way to achieve
    them.
- Code is buggy approximation of a wrong specification. Treat it as such.

## Quality

- If you don't test automatically and regularly and in production you only have yourself to blame.
- Being able to test end-to-end is the first priority (aka create a walking skeleton in production
    as soon as possible).
- Use git correctly.
- Deploying should either be automatically or a single click / command.

## Technology

- PostgreSQL can probably do it for now.
- Have a valid reason to use any other technology than PostgreSQL (e.g. Kafka).
- Keep up with the newest developments and tools but don't join the beta-testers and early-adaptors.

## Teams

- Good solutions require an holistic vision and direction, which is easier with ownership. But try
    to not rely on a single person.
- Never have a single point of failure.
- Team fit is crucial. Growing a team takes time. The build-up trust and reduction in
    communication-overhead is worth the effort.
