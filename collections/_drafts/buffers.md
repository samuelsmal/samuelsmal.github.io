---
layout: post
title:  "Buffers"
date:   2024-09-01
tags:
  - software architecture
  - system architecture
  - evolutionary systems
---

I design a lot of software systems. And with a lot I mean roughly between 2-4 each year. Some get
fully developed, some are shelved, some are discussed for a long time and stay in this limbo for a
long time. One common feature that is requested by clients is scalability and maintanability. You
don't want to spend a lot of money on a new system and not have to repeat the complete make-over
every couple of years. The words *scalability* and *maintainability* are flashy enough and are
relativitely easys to understand.

However, what they really mean is **evolutionary**. The system should be able to grow with them.
Part of an evolutionary system design is ensuring that is also scalable and maintainable.

In this article I want to touch on a simple but crucial piece that in my experience should be part
of every good design: buffers.

# What is a buffer?

A buffer can take multiple shapes or forms, in its basic form it is a container that can hold
elements for a while. There is at least one input and one output. The input adds more items, the
output takes them out. The process of adding and retrieving can be first-in-first-out or
first-in-last-out; it can be shared on a thread, process, node, zone, cluster or even world-wide
level; the items can have a very short time-to-live or basically exist forever. Lots of different
options to choose from. But the basic functionality stays the same.

# What do they allow you to do?

Since a buffer just holds onto some items for you, not much by itself. In combination with a load
balancer a lot. Imagine that you have two functions $f$ and $g$, both need to applied on some input
$x$ to produce the output $y$, $y = g(f(x))$. The issue in most cases is that these functions do not
take the same amount of time to complete. Let's say that $f$ is taking the data, reshapes and
transforms it slightly to prepare it for $g$, which is a big machine learning algorithm. The runtime
differs at least on a magnitude. One could put both on the same process and be done with it (which
would probably make sense in most cases), but let's imagine that you foresee that $f$ will grow in
complexity over time. You also want to separate the concern of who handles what data. Some people
will be able to manipulate the raw input $x$, such that it is coherent and can serve as correct
input to $g$. Some will then ensure that the function $g$ will work as intended.

Knowing this, you can split your team and architecture to reflect this, while achieving the ability
to grow. And you do this by putting a buffer in between. Before you had a one-to-one mapping, the
number of running instances of $f$ and $g$g was the same, if you had more data to run through you
scaled up the number of machines, or (more likely) just increased the size of the machine.

Now you have at least three elements, a buffer $b$ and machines running the two functions $f$ and
$g$. Let's assume that you have something that can monitor how many elemens are in your buffer and
thus can increase the throughput of further downstream functions.

# Where to put them?

- In IO heavy applications, in between the IO part and the other processing parts
- On system boarders.

# What about the additional complexity?

- For a long time it will increase. There are suddenly more things to monitor and to be effective
  they all need to be coordinated correctly. Which is not trivial.
  You can think of this as the initial setup, establishing the framework on which you can then
  build. Once there is a buffer-system in place you can use it for a lot of tools and scenarios.
  - Vastly different processing speeds
  - Reusing of similar data forms and shapes at multiple locations

# Common scenarios

- Database inserts
- Vastly different processing speeds
- Reusing of similar data forms and shapes at multiple locations
