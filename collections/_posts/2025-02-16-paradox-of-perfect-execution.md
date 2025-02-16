---
layout: post
title: "The Paradox of Perfect Execution: Why Technical Excellence Can Lead to Project Loss"
date: 2025-02-16
tags:
  - consulting
description: |
    Why failure might actually be good for your business. Even if the client doesn't gain anything.
---

# Context

Now that some time has passed, I can talk freely about some observations that I made while
transitioning out of a multi-year long project for a global sports company. Together with my team we
build a single-source-of-truth data warehouse that suited analytical and operational purposes.
Ingested master data as well as low-latency (sub second end-to-end latency) streaming data. In total
a team of 26 engineers were involved from our side. A huge project.

At one point during this three and a half year long journey we were faced with a sad message from
our client: they were replacing us with a global consulting company. The reasoning was weird, the
client as a whole wanted to transition from 350 vendors to roughly 10. Which makes sense. In this
department however, they transitioned from one vendor to another. Instead of retaining a team with
deep knowledge of their operations—a team that had helped define those operations — they chose a new
team with limited experience in both streaming technology and their business domain.

The story in this post comes with some reflections on our behaviour and the rival's. Note, that I
**do not** think their behaviour is good, or ethical, or leads to a long-lasting beneficial
relationship. However, it opened my eye on how much visibility is worth.

# Failure is good for Business

Pretty early on in the transition phase, it became clear that the rival's team wasn't up to the
task.  Originally, the transition was planned and estimated by the rival to take six months. During
the first three months which were full of "knowledge transfer" sessions it became clear that there
were some pretty big gaps in knowledge and experience. The rival wasn't too concerned and played our
concerns low. We were being phased out, and our thoughts didn't really matter any longer. We no
longer had the ear of upper management, and truth be told, we never had. From day one, we defined -
together with the client - the goals and methods on how to achieve everything. The client was very
happy, let us do our job and gave us an enormous level of independence.

## Failure is not an Option

This culminated during a global sporting event in 2022, where our operations team was deployed to
monitor the platform and support other teams on-site. During this event, the client delegated
everything to us, the level of trust was insane.

During one of the matches, we got an automated alert that multiple data streams were not aligned.
The
relative-to-kickoff timestamps were wrong, which prevent consumers to join the feeds. The reason was
a faulty and then missing message detailing the offset for one stream. Pretty big deal. The outcome
would be a complete loss of live statistics for this match.

There was only one solution, which was to create a fake message to fix the time-alignment of
multiple streams. This required extensive knowledge of the system and all consumers further
downstream. Time was of the essence and I knew that there was no time to get the official approval.
We had the approval to do smaller fixes without going through the standard chain of command, but not
for this. This was on another level. So... as any engineer who thinks of himself too much, I did it.
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
failure, if you ask me.

Note, that the data and their pipelines were new due to a primary vendor change. We were part of the
data strategy team that evaluated the new vendors and due to a large delivery delay on the rival's
side we got to develop the rudimentary ingestion pipeline. The new ingestion pipeline built upon an
already existing system. The design for the ingestion was complete, the code to-be-written was not
trivial, but for the experts they claimed to be should have been fairly easy. After all, how
complicated can it be to ingest dynamically from a RabbitMQ server multiple streams of data into a
Kafka cluster and to store these data points in a PostgreSQL database? We estimated that the testing
and aligning on the content's format would take much more time than the actual development.

Regardless, we gave them diagrams, code snippets, documentation and lots and lots of meetings.

After three months of no progress, the client secretly asked us to develop the code ourselves. And
we did. So we had to organise testing sessions with the vendor, the rival and downstream consumers.
Which was extremely awkward. When the rival realised what was going on, and the situation got
escalated to the highest members - even the rival's CEO had to jump on a call - I thought, finally
they will reap what they sow. But no, the rival was able to make the case for their improvements.
They claimed they would send smarter people. And they kinda did - at least on paper.  Exchanging 70%
of the rival's team after four months must look insane from the outside, but it did work. They did
not lose the client and the transition went ahead. Because they got face-time.

This pattern repeated itself throughout and after the transition period. Agreed upon deadlines were
not kept, solutions were half-baked, which resulted in problems further down the line. Every time
something like this occurred there was a meeting where last accomplishments, even if not because of
their doing, were highlighted and praised, and planned improvements were mentioned. Their
presentations were masterfully crafted for management consumption, rich with buzzwords and polished
visuals. It gave the impression that the problems were complex and required a lot of effort and
brainpower.

While we tried to manage expectations and informed the client ahead of time if we saw issues, which
allowed us to intervene and circumvent these issues, the rival did not do so. And now I believe on
purpose.

Was this behaviour part of their strategy? Maybe. Probably not - I hope. By having regular
touchpoints with the client's management their name and their - faulty - accomplishments were
discussed. Being known is a pretty big deal in the consulting world, where the discussion about why
you pay so much for externals is a constant talking point. It ensured that they have a business.

## Long-term outcome

After a couple of months, I reached out to the client. After all, we've become somewhat friends - a
goal for every good consultant if you ask me. Turns out, internal consumers no longer trust the
platform.  Only the simpler components—the metadata-driven pipeline that mainly required
configuration — will remain in-house, and even these will be further simplified. The complex
match-related pipelines and logic will be handled by another vendor.

By eroding the trust in their ability on a low level, the engineering level, technical people
circumvented the platform and looked for other solutions. The management is still very happy with
the outcome. After all, they don't care which vendor implements it.

However, this outcome undermines one of the primary goals of the project in the first place. Which
was to host the data and logic in-house. By reversing their original plan the client basically
threw three years of development time away, which had a price point of multiple million Swiss
Franks.

# Take away

So what did I learn from this? Mostly that technical excellence alone doesn't guarantee
success. Our team's journey reveals a critical paradox: while flawless execution can make problems
invisible, visible problems—and their solutions—often carry more organizational weight than silent
efficiency.

## The Visibility Paradox
Perfect execution can become its own enemy. When problems are prevented or solved invisibly,
leadership lacks concrete examples of your team's value. Our ability to handle crises without
escalation, while technically impressive, ultimately reduced our organizational visibility and
influence.

## The Trust-Visibility Trade-off

We built deep trust with technical teams and operational staff through consistent delivery and
problem prevention. However, our rival built stronger relationships with management through regular
engagement—even if that engagement was often problem-focused and focused on negatives. This reveals
a fundamental tension: technical trust doesn't automatically translate to organizational influence.

## The Strategy Gap

Our focus on technical excellence created a strategic blind spot. While we invested in building
robust systems and preventing problems, we underinvested in:

- Regular management engagement
- Visibility of our problem-solving processes
- Strategic relationship building at senior levels
- Documentation and presentation of our preventive measures

## Moving Forward: Balancing Excellence with Visibility

For technical teams aiming to maintain both their standards and their positions, the path forward
requires a dual focus:

1. Maintain technical excellence while creating visibility around prevention and problem-solving
2. Build strategic relationships at all levels of the organization
3. Document and communicate the value of prevention alongside the cost of failures
4. Engage management in technical decisions early and often
5. Transform silent efficiency into visible strategic value
6. And sometimes let things escalate

The lesson isn't that technical excellence doesn't matter — it absolutely does. Rather, it's that
excellence must be paired with strategic communication and relationship building to create lasting
organizational value. In enterprise environments, how you manage relationships can be as important
as how you manage code.

