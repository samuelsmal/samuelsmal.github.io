---
layout: post
title:  "About The One Prompt Claim"
date:   "2026-09-27"
description: |
    Why "give it a task and it gets it done" ignores what Waterfall taught us: usage drives understanding, and no single prompt survives the first round of user testing.
tags:
  - agentic engineering
  - software engineering
---

There is one claim that I am reading and hearing time and time again, the **one prompt claim**.
Coding agents will deliver a tool, product or solution after the user specified a single request or
prompt.

Here is a good one from Jensen Huang from a [recent
interview](https://www.nytimes.com/2026/09/23/opinion/ezra-klein-podcast-jensen-huang.html) with
Ezra Klein:

>Today, or soon, we’ll be able to know everything and do anything. That’s the concept that’s really
>quite exciting. That out of the ether, instead of doing a search and then going through one link
>after another link and reading all these different websites trying to figure out what’s going on,
>in the future, you just ask it a question, and it comes back with an answer. You give it a project,
>it comes back with a solution. **You give it a task, it comes back and gets it done.**

That is, in my experience, just nonsense. He is the CEO of Nvidia, so we can forgive him the marketing.

However, I also hear the same claim from clients and colleagues, whom I can't quote.
The issue is that the claim ignores the lessons learned from
[Waterfall](https://en.wikipedia.org/wiki/Waterfall_model). Any interesting, non-trivial question is
full of tradeoffs and clarifying follow-up questions. The claim that a) one can know all the issues,
decisions and tradeoffs that come up during the development and testing of a solution and b) that
one can specify them in a language that the implementing party — be it humans or AI agents —
understands without ambiguity is just pure fantasy and is not reflected in any shape or form in the
current status quo.

The old joke applies: the issue is imperfect human language, so we just need a language that is
clear enough and has no ambiguity — and that language turns out to be code. Ideas and concepts are
fuzzy and very, very difficult to explain or write down, even when the authors only want to express
them for themselves. It gets even harder if you want to do that as instructions for someone else.

The thought that we can solve this issue by having smarter and more capable models ignores the
origin of the issue, which is that language or any method of sharing ideas is incomplete and
error-prone. While the agents can and will ask clarifying questions, the assumption that this is a
single-pass approach just ignores reality. In my more than twenty years in software, no amount of
specification and clarifying questions survived the first round of development and user testing.
Even if an agent can think of all the different edge cases, I don't think the user (and the
assumption that the client is the user is already bold, and rarely true) can decide on them at that
stage. Requirements become clear only through multiple phases of developing, testing and
refining.

We will for sure need to rethink how we develop software in this new age, and I
agree that the traditional SDLC is no longer a good fit. Software engineers are still needed but
will work on a higher level, probably more along the lines of product owners who work directly
together with the users to figure out what is needed. One still has to know specialised information
and language to describe an issue or goal. A "normal" user can't decide where to put the key for
the end-to-end encryption; they probably don't even know what that means, nor can they really decide
even if given all the pros and cons. In the same way, I can't decide which tool a hairdresser
should use to cut my hair. I can rely on my past experience, but I don't know their skill set, nor do I have
a deep understanding of the material. The question is unanswerable for me.

The follow-up claim, that the agents will get smarter and will then be able to guide the user to a
good decision, is exactly my point from above, that guided decisions are a series of prompts. It
will be a back-and-forth, a multi-prompt usage. But this is not a semantic argument over *single
prompt* vs. *conversation*; it is a philosophical argument over what we have learned as humans and
how we develop good solutions that meet our needs. And that requires a deep understanding not only
of the issue but also of the possible solution space.

Later in the interview Huang says:

>The thing that’s important to recognize is that for everybody’s job, there’s the purpose of the job
>and then there’s the task you do as the job.
>[...]
>There was a prediction that literally by this year 90 percent of all software would be coded by
>agents, and therefore we don’t need any software engineers.
>
>That last part is completely false. That’s completely wrong. The purpose of the software engineer
>is engineering. There was engineering before software. There will be engineering after software
>programming.
>
>The purpose of engineering is to invent something new, discover a new product, create a new
>product, solve a problem, connect a social need with the technology that exists in the
>manifestation of a product. So that mission, that purpose doesn’t change.

And that is much more aligned with my current view of the technology. The idea that AI can
get you an answer to everything is marketing. Finding a solution will still require engineering,
which is not something every user can provide.

Engineering is the loop between a need and the use of a solution. Usage drives understanding, and
understanding is exactly what one prompt cannot deliver.
