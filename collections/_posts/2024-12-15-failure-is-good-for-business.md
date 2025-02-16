---
layout: post
title: Failure is good for business
date: 2024-12-15
tags:
  - consulting
description: |
    Why failure might actually be good for your business. Even if the client doesn't gain anything.
---

# Context

Now that some time has passed I can talk freely about some observations that I made while
transitioning out of a multi year long project for a global sports company. Together with my team we
build a single-source-of-truth data warehouse that suited analytical and operational purposes.
Ingested master data as well as low-latency (sub second end-to-end latency) streaming data. In total
a team of 26 engineers were involved from our side. A huge project.

At one point during this three and a half year long journey we were faced with a sad message from
our client: they were replacing us with a global consulting company. The reasoning was weird, the
client as a whole wanted to transition from 350 vendors to roughly 10. Which makes sense. In this
department however they transitioned from one vendor to another. And instead of getting a good team
that new the client and their operations very well, even defined it with them, they got a team that
didn't know much about streaming or their business. (But more on that later.)

The story in this post comes with some reflections on our behaviour and the rival's. Note, that I
**do not** think their behaviour is good, or ethical, or leads to a long-lasting beneficial
relationship.

# Failure is good for business

Pretty early on in the transition phase it became clear that the rival's team wasn't up to the task.
Originally the transition was planned and estimated by the rival to take six months. During the first
three months which were full of "knowledge transfer" sessions it became clear that there were some
pretty big gaps in knowledge and experience. The rival wasn't too concerned and played our concerns
low. We were being phased out and our thoughts didn't really matter any longer. We no longer had the
ear of upper management, and truth be told, we never had. From day one we defined - together with
the client - the goals and methods on how to achieve everything. The client was very happy, let us
do our job and gave us an enormous level of independence.

## Failure is not an option

This all cumulated at a pretty big event in 2022 where our operations team was send to a desert
country and had to monitor the platform and support other teams. During this event the client
delegated everything to us, the level of trust was insane.

During one of the matches we got an automated alert that multiple data streams were not aligned. The
relative-to-kickoff timestamps were wrong, which prevent consumers to join the feeds. The reason was
a faulty and then missing message detailing the offset for one stream. Pretty big deal. The outcome
would be a complete loss of live statistics for this match.

There was only one solution, which was to create a fake message to fix the time-alignment of
multiple streams. This required extensive knowledge of the system and all consumers further
downstream. Time was of the essence and I knew that there was no time to get the official approval.
We had the approval to do smaller fixes without going through the standard chain of command, but not
for this. This was on another level. So... as any engineer who thinks of himself too much I did it.
While on a bus ride to view a match during my off-duty time. One of my most fun moments as a
software engineer ([here](https://www.youtube.com/watch?v=fQGbXmkSArs) is a somewhat accurate
depiction on how that went down). Next to me a group of sleeping journalists, who didn't realise
anything. And neither did anyone else expect the engineers and vendors consuming the data streams.

We wrote a post-mortem, highlighted the solution, the technical skills required, how to improve the
system in the future (which was basically telling the vendor not to do this ever again), the full
program. But, nobody in upper management from the client bat an eye. Because there was no failure.

There was an issue and we solved it. The client paid good money and we delivered. Everyone was
happy. But in the end we lost the client. One theory is that we were too small of a company, and
keeping us would not have been aligned with their global strategy. Which is a fair thought and most
likely true. But we were never able to make our case, and for that I blame our methods of delivery.

## Or is it?

The rival failed multiple times during the transition period. Even with pretty easy tasks - or so we
thought. During their first real tournament, the system wasn't able to ingest data. A pretty big
failure if you ask me.

Note, that the data and their pipelines was new due to a primary vendor change. We were part of the
data strategy team that evaluated the new vendors and due to a large delivery delay on the rival's
side we got to develop the rudimentary ingestion pipeline. The new ingestion pipeline build upon an
already existing system. The design for the ingestion was complete, the code to-be-written was not
trivial but for the experts they claimed to be should have been fairly easy. After all, how
complicated can it be to ingest dynamically from a RabbitMQ server multiple streams of data into a
Kafka cluster and to store these data points in a PostgreSQL database? We estimated that the testing
and aligning on the content's format would take much more time than the actual development.

Regardless, we gave them diagrams, code snippets, documentation and lots and lots of meetings.

After three months after which they had nothing to show the client asked us to develop the code in
hiding. And we did. So we had to organise testing sessions with the vendor, the rival and
downstream consumers. Which was extremely awkward. When the rival realised what was going on, and
the situation got escalated to the highest members - even the rival's CEO had to jump on a call - I
thought, finally they will reap what they sow. But no, the rival was able to make the case for their
improvements. They claimed they would send smarter people. And they kinda did - at least on paper.
Exchanging 70% of the rival's team after four months must look insane from the outside, but it did
work. They did not lose the client and the transition went ahead. Because they got face-time.

This game repeated itself a couple of more times. Agreed upon deadlines were not kept, solutions
were half-baked which resulted in problems further down the line. Every time something like this
occurred there was a meeting where last accomplishments, even if not because of their doing, were
highlighted and praised and planned improvements were mentioned. They were beautiful presentations,
using the right words and pictures. Very management friendly. It gave the impression that the
problems were complex and required a lot of effort and brainpower.

While we tried to manage expectations and informed the client ahead of time if we saw issues, which
allowed us to intervene and circumvent these issues, the rival did not do so. And now I believe on
purpose.

Was this behaviour part of their strategy? Maybe. Probably not - I hope. By having regular
touchpoints with the client's management their name and their - faulty - accomplishments were
discussed. Being known is a pretty big deal in the consulting world, where the discussion about why
you pay so much for externals is a constant talking point. It ensured that they have a business.

## Long-term outcome

After a couple of months I reached out to the client. After all, we've become somewhat friends - a
goal for every good consultant if you ask me. Turns out, internal consumers no longer trust the
platform. The simpler part will stay in-house, which was build upon a meta-data driven pipeline and
mostly a configuration problem, but it will be further simplified. The complex match-related
pipelines and logic will be handled by another vendor.

By eroding the trust in their ability on a low level, the engineering level, technical people
circumvented the platform and looked for other solutions. The management is still very happy with
the outcome. After all, they don't care which vendor implements it.

However, this outcome undermines one of the primary goals of the project in the first place. Which
was to host the data and logic in-house.

# Nobody Ever Get Credit for Fixing Problems that Never Happened

Looking at the bigger picture, I want to highlight a paper called [*Nobody Ever Get Credit for
Fixing Problems that Never
Happened*](http://web.mit.edu/nelsonr/www/Repenning%3DSterman_CMR_su01_.pdf) from 2021 in which
Nelson P. Pepenning and John D. Sterman addresses a fundamental paradox in organizational
improvement: Despite huge investments in improvement programs, most organizations fail to achieve
significant results.

The major reasons for this are:

## The "Capability Trap"

Organizations can improve performance either by working harder or working smarter (improving
processes). Working harder provides immediate results but erodes long-term capability. Working
smarter requires initial investment and shows results only after a delay. Under pressure,
managers often choose to work harder, creating a vicious cycle.

## The "Better-Before-Worse" vs "Worse-Before-Better" Trade-off

Working harder produces immediate gains but long-term problems. Working smarter causes short-term
performance drops but long-term improvements.  Managers often choose immediate gains over long-term
improvements.

## Self-Confirming Attribution Error

Managers tend to blame poor performance on worker laziness rather than system issues.
When managers increase pressure, they see immediate results (confirming their belief).
This creates a cycle of increasing pressure and declining capability: Workers begin hiding problems,
further reinforcing management's incorrect beliefs.

The key lesson is that successful improvement requires changing mental models and understanding
system dynamics, not just implementing new tools or techniques. Organizations need to recognize and
prepare for the "worse-before-better" dynamic of genuine improvement efforts.

## How does this relate to the above story?

Well... it kinda doesn't... except for the title. But it gives insights into how corporations and
managers view improvements and problems.


