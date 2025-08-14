---
layout: post
title:  "A lack of strategy"
date:   "2025-08-10"
tags:
  - culture
  - engineering
---

Lately, I found myself reviewing and auditing data platforms of three rather large Swiss insurance
companies - each with 1 - 7.5 billion CHF in revenue and 1500 - 2000 employees. The task was to find
the good, the bad and the ugly. While I can't discuss the, somewhat OKish, findings for
obvious confidentiality reasons there was an underlying pattern: a lack of strategy, especially with
respect to engineering.

That pattern is not isolated to insurance companies. Other, let's say, traditional companies that
are not digital native and face problems with their digital transformation, industrial manufacturing
for example, exhibit the same issue. A lack of foundational strategic thinking with respect to
engineering, resulting in costly, un- and misaligned, confusing and isolated initiatives.

# The Audit Findings: Technology Without Strategy

The audits' focus was on their data platforms, but it's not just technology that is being reviewed.
The review focuses on three sections: data, technology and business.  *Business* including all
things around the data and technology. The social aspect if you like, management, communication
patterns, and strategy.

The general findings were generally OK. Mostly competent people implementing reasonable things. They
had chosen reasonable tools, built working systems and delivered business value. I would have made
different choices, but everyone has their favourites.
What was bad, however, really bad was a lack of holistic understanding of how technology creates
long-term value in modern businesses.

How systems integrate and are maintained, how decisions are made, under which principles they are
ruled. All of this could not be answered. Teams were unaware of similar tools in other departments.
Forgot to include important teams or didn't reason through deployment and rollout of these
technologies.

Apparently, their management thought that introducing some technology to solve a particular problem
is akin to "fire-and-forget" - the implementation does not impact other systems nor does it require
ongoing organisational change.

All of which, a good engineering strategy can help to remedy.

To be clear, this finding does not only apply to insurance companies. I see the same result in many
if not all my clients. But the audits allowed me to review these clients in a controlled and
comparable setting, which prompted me to write this down.

# What is an Engineering Strategy?

Engineering strategies were all the hype around 2023. There is the [classic blog post from Will
Larson](https://lethain.com/eng-strategies/), which will be released
in the [form of an O'Reilly book in October
2025](https://www.oreilly.com/library/view/crafting-engineering-strategy/9798341645516/). Since then
a couple of [other articles](https://sidmustafa.substack.com/p/crafting-an-engineering-strategy),
[frameworks](https://www.practicalengineering.management/p/engineering-strategy-framework). A lot of
them build upon [Richard Rumelt's *Good Strategy Bad
Strategy*](https://www.goodreads.com/en/book/show/11721966-good-strategy-bad-strategy). So I guess
you can also read his book instead of the blob posts (but the blog posts will probably have the same
content in much, much shorter format).

Honestly, I hope that the idea has been around for much longer. Businesses have business plans but
why should an engineering plan be something revolutionary?

According to Rumelt a strategy is composed of three parts:

1. **Diagnosis** What specific challenges does our engineering organization need to solve?
2. **Guiding Policies** What principles will guide our technology decisions?
3. **Coherent Actions** What specific, aligned actions will address our diagnosed challenges?

Of course the above applies to all types of company strategies, e.g. business, product and
engineering. So what should be included in your engineering strategy? Here are some starters:

## Honest Assessment of Your Company's Relationship to Technology

If your company's primary value comes from software, technology will be treated as a strategic
asset - a first-class citizen if you like. Investment decisions will favor long-term capability
building over short-term cost optimisation.

If software is purely a cost center supporting your real business, every technology decision will be
questioned through a cost-reduction lens. This isn't wrong, but it requires different strategic
choices. You might focus on proven, vendor-supported solutions rather than custom development, or
invest heavily in operational efficiency rather than cutting-edge capabilities.

**Guiding Questions**: What role does technology play in your value proposition? How do executives view
technology spending—as investment or expense? What technology capabilities would fundamentally
change your competitive position?

## Resource Reality Check

The strategy must be aligned with your actual resources, and these always come down to **cost**,
**complexity** and **capacity**. Costs and complexity can be somewhat exchanged, e.g. building a
tool yourself vs using a managed service. Capacity comes in two ways: Capacity of the engineering
and operations team and capacity of the company to absorb and manage change.

**Guiding Questions**: How many people do you get for how long? Can you hire specialists? What
will they do in the next three months, in the next five years? What's your organisation's track
record of successfully implementing and maintaining complex technical solutions?

## Fundamental Engineering Standards

Without shared standards, every team builds in isolation, creating maintenance nightmares and
integration challenges. Your strategy must define non-negotiable technical standards.

**Guiding Questions**: How do you release software? What is the format in which you exchange data?
If it's JSON that what type of JSON? How will timestamps be reported? Currencies? Amounts?  In what
language do you write software? Do you write software or only use configurable technologies? How do
you release software?

## Decision-Making Framework

Perhaps most importantly, document how and why technical decisions are made. This includes both the
process (who decides what) and the reasoning (why specific choices were made).

**Guiding Questions**: Who has authority over architecture decisions? How do you evaluate
build-vs-buy choices? What criteria determine when you adopt new technologies? How do you document
and communicate technical decisions?

## Alignment with the broader Strategy

Of course, this strategy needs to be aligned with the larger strategy of the company. It is a
translation of the business strategy, vision or goal applied to engineering, and then some more
purely engineering related content. By thinking about, writing it down and sharing such a document
the company is forced to reason through its goals and how these can actually be implemented.

## A living document

Usually, this is written down somewhere and shared with as many people as necessary and possible.
The goal of this living document depends a bit on the audience. A low-level software engineer can
use it to make better long-term decisions. If, for example, the plan for the tech-stack is known,
one can factor this in and invest more time in preparing the code accordingly - instead of wasting
it on a piece of code that will be obsolete in a few months. An architect, on the other hand, can
use it to make grounded and holistic decisions and communicate them transparently to people above
and below them. With the ideal result being that the stack and solutions have a long time-to-live,
build upon each other elegantly and are aligned with the possibilities of maintaining them.


# How did the clients compare against the above outline?

Well, not good. None of the above points were documented or thought about.

One client had a strategy living in the brain of an enterprise architect. But his strategy only
applied to a singular tool and the tool alone (which was a nice implementation and nicely
structured). As technology never lives alone, but always in combination with data and people his
strategy was doomed to fail.

The others didn't even have a strategy. They identified a problem, and wanted a singular solution
for it. How that solution would be supported or maintained is not on the roadmap. Neither, what
secondary effects this will have. Some did employ a board of enterprise architects that reviewed
proposed solutions and spotted inconsistencies, but none could tell you them beforehand. This
reactive method results in technical debt at an organisational level.

# Why do these companies not have a strategy?

All the reviewed companies are not software companies. They all employ software engineers who
write tools, programs and applications that the company either uses internally or sells to
customers. But the primary product that these companies offer is not software. This is in contrast
to, say, Google. Google's main product is (or was) a search engine. If Google would not focus on
good software, they couldn't offer a good search engine. But the companies I usually work with are
insurances, banks or create industrial manufactured goods.<label for="sn-companies" class="margin-toggle
sidenote-number"></label><input type="checkbox" id="sn-size" class="margin-toggle"/><span
class="sidenote">Comes with being a consultant living in Zurich, I guess.</span>
None of these fields produce software as a first-class citizen. They all see the potential and
benefit of working with data and having good and reliable software, but they just can't wrap their
heads around it. Data and software is just another tool to them. Thus, they don't invest in these
fields, not with money, nor with people, nor with time.

So they don't employ or empower people that can push for such a strategy. Resulting in isolated
solutions that don't integrate well, have hidden and unexpected maintenance cost and do not allow
companies to adapt proactively.

# What now?

As you can see, the most important insight from these audits isn't technical — it's organizational. 
Engineering efforts fail, when they are treated as purely technical exercises or cost-points rather
than business imperatives.

What is required is executive sponsorship, cross-functional alignment between business and
engineering leadership, investment patience that allows long-term capability building and a cultural
change that values technical decision-making as business strategy.

I see two ways forward for these companies. Either they realise that they need custom software and
solutions, and then put enough effort in these processes, or they realised that they can adapt their
ways of working to managed tools. If they go with the later, they still need an engineering strategy,
but with a different focus.

If they do neither, huge costs will come further down the road. A competitor will invest in such a
strategy, and thus will be able to provide a better and cheaper service in the future.

The future belongs to organizations that can successfully align their engineering capabilities with
their business strategy—regardless of whether they're "technology companies" or not.

