---
layout: post
title:  "Evolutionary Software Systems"
date:   2025-01-18
tags:
  - software architecture
  - system architecture
mathjax: true
---

I design a lot of software systems. And with a lot I mean roughly between 2-4 each year. Some get
fully developed, some are shelved, some are discussed for a long time and stay in this limbo for a
long time. A lot of these systems are in the distributed streaming or event-driven world.
Apparently, it's all the hype. Or it's just projects that appeal to me.

One common feature that is requested by clients is scalability and maintainability. You
don't want to spend a lot of money on a new system and not have to repeat the complete make-over
every couple of years. The words *scalability* and *maintainability* are flashy enough and are
relatively easy to understand.

However, what they really mean is **evolutionary**. The system should be able to grow with them.
Part of an evolutionary system design is ensuring that is also scalable and maintainable.

In this article I want to touch on a simple but crucial piece that in my experience should be part
of every good, evolutionary design: buffers.
