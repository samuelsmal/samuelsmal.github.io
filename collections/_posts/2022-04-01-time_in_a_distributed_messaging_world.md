---
layout: post
title:  "About time in the distributed messaging world"
date:   2022-06-01
tags:
  - real-time data distribution
  - software engineering
mathjax: True
description: |
  Writing applications for distributed messaging queues is tricky, in this series I will expand on a
  couple of general thoughts and issues that arise naturally in this problem space. This time it's
  about time, where does it come from, how to use it and what issues come with it.
field: Software Engineering
---

## Introduction

In a distributed queue-based messaging system each message is usually accompanied by two timestamps:
 the **processing** and the **event** timestamp. This is often referred to as a **bitemporal data**.
Oftentimes the difference between the two types is not clear and depends heavily on the use case.
And we will see how it should really be a **polytemporal data** in the conclusion.

For the sake of argument we'll consider the following system:

```
Sensor System -> Queue  -> Processor -> Database -> UI
```

As an example with some technologies:

```
Temperature sensor -> Kafka -> Flink -> PostgreSQL -> HTML webapp
```

## About timestamps

There a many different *types* of timestamps:

<dl>
  <dt>Observation or event time</dt>
  <dd>When a data product becomes aware of the event or state. This is the point in time where an
  actual thing happened.</dd>

  <dt>Processing time</dt>
  <dd>When the data product processes and transforms the data observed.</dd>

  <dt>Record time</dt>
  <dd>When a data product stores the processed data.</dd>

  <dt>Publish time</dt>
  <dd>When the data becomes available to data users for access.</dd>

  <dt>Arrival time</dt>
  <dd>When the data arrives at the data user.</dd>
</dl>

As you can see the *type* of the timestamp depends on the user's viewpoint. For our sensor the
$t_\text{observation}$ and $t_\text{processing}$ are the same. The $t_\text{publish}$ is the
timestamp when it sends the data off. It then arrives at the sink, in this case our Queue. The Queue
than adds it's own $t_\text{arrival}$ and $t_\text{processing}$. Basically each new system adds a
couple of timestamps to the message, the $t\text{event}$ however is very unique. It is the only
timestamp that reflects the actual event. When did we measure this? When did it started to rain?

---

When a record arrives in your favourite distributed message queue system <label
for="sn-message_queue_system" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-message_queue_system" class="margin-toggle"/><span class="sidenote">
I am abusing the term here a bit, I mean a system that distributed messages or records. For example
Kafka, RabbitMQ or EventHub. A message or record in these systems is a single piece of data, both
names are valid.</span>
, the arrival timestamp `arrived_at` is for the Queue a processing-timestamp. For
the Processor however it can be an event-timestamp as well.

Canonically people give these timestamps the following description:

---

Let's use these timestamps now in an example which illustrates their uses.

For example, assume that we want to determine if the temperature is above a certain threshold. The
sensor sends you the current measurement and the corresponding time it took it every second. You
also don't need to react too quickly and know that the sensors can take false measurements, let's
say that 1% of all measurements are faulty.  Thus you need to filter the measurements, remove some
outliers, as you don't know which measurements are faulty you just calculate the median over the
last 60 measurements. Let's just assume that this is a valid approach for your application. It can
deal with outliers, and the reaction delay is about 120 seconds. Which is deemed to be sufficient.

In order to calculate this running aggregation you write a rolling-window application in your
processor followed by another simple threshold-and-fire-alert application.

The question that you need to answer is which timestamp to use. If you did everything right you have
at this point in your pipeline at least three timestamps. The event-time of the measurement (the
processing time of the sensor when the measurement was taken), the event-time of when your Queue
received the measurement and the event-time of when our Processor is using the measurement.
Canonically only the first timestamp is called event-time all the others are processing timestamps.
Thus we name them: $t_{\text{event}}$, $t_{\text{queue arrival}}$ and $t_{\text{processor arrival}}$.

Still which timestamp do you use? The most straight-forward answer would be to use $t_{event}$. This
should work for most cases, is easy to understand and is most cases reliable enough. Let's talk
about the cases where it is not.

## Out-of-Window

As you surely noticed, we are calculating an aggregate over a window. Right now we set the window to
be of a certain duration. Thus, for every new measurement that comes in, we wait for 60 seconds, add
all of the newly arriving measurements to a list and then calculate the median over this list. What
happens if no further measurement arrives? Or if they arrive after the wait-time of 60 seconds but
have a $t_{event}$ that is still in our window?

There is sadly no design solution for this issue, you can't completely design networking issues
away. Sometimes it's not fully in your control, e.g. when you have multiple vendors from
multiple changing locations. Thus you need to make your pipeline robust against these issues and
design and configure it properly.  Usually you only have two options: wait a bit or publish a new
value.  If you want to wait you have to determine what an acceptable wait time is, this makes your
system even more delayed, more error-prone but you only have to deal with the outcome once.  If you
can recalculate past or already closed windows your pipeline further down needs to be able to handle
this, your memory footprint is also much higher, as you now need to keep past windows in memory (or
storage).

Usually it's a combination of both approaches. Recalculate past windows for $x$-hours or $y$-seconds
depending on how much money you want to spend on machines and if new messages arrive after this
deadline the window is fully closed.
If this happens you're in deep shit anyways and maybe need to rethink your whole system design.

## Out-of-Order

Let's talk about the other big issue: Records arriving out-of-order. In this simple application
where we take the global aggregate over a window the order inside these windows can be neglected,
the median is still the same.

So let's assume that your sensor has a way of identifying if it made a wrong measurement and can
correct previous values. It now sends the following update message:

```
{
 "id": 1
 "timestamp": 123,
 "value": 42,
}
```

If the sensor determines that a measurement is faulty, a corrected `value` will be sent, keeping the
old `id` and `timestamp`. Let's assume that our Processor can recalculate the values for older
windows if a message arrives out-of-window, and that we now get for some measurements more than one
value.  How do we determine which to use? If we pick the one with later $t_\text{processor
arrival}$ we do not cover out-of-order events, e.g. in case of a distributed system it can happen
that the corrected value arrives before the original, faulty one.

Thus you need to be able to restore order, or be able to determine which is the most-current value.
Thus you further modify the sensor message:

```
{
 "id": 1
 "measurement_timestamp": 123,
 "send_timestamp": 133,
 "value": 32,
}
```

With this information you can now restore the full order and recalculate the aggregate without any
issues.

## Thoughts on monitoring

As you can see the more we think about the issues that we are facing the more timestamps are
required to fully debug your application. We started with one for each system, but had to expand the
$t_\text{event}$ and add $t_\text{sensor send}$, I guess by now you can guess that in order to fully
capture everything we need to add even more timestamps.
Let's say you want to monitor the behaviour of your system and create an alert if it takes too long
for some messages to flow through your system. For this you need to add for each subsystem that you
have at least two instead of one timestamp: one for when it arrives and one when it leaves the
subsystem. With this you can now calculate for each record the time it takes to process it and how
long it stays in transit from one subsystem to the other.
To make things worse, this only works very well when you have a simple one-to-one transformation
or map steps. Taking the aggregation over 60 seconds from above, which timestamp should you use for
arrival and leave? As long as everybody that uses the system is in agreement the earliest and latest
should give you sufficient information. But should it be the earliest of the $t_\text{event}$ or
$t_\text{processor arrival}$? In my opinion this heavily depends on the use case at hand, to keep things
simple I usually stick to $t_\text{event}$ for the definition of the window and the $t_\text{processor
send}$ for the aggregate itself. In this case this aggregate can be viewed as a new *event*.

