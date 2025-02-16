---
layout: post
title:  "Managed Services: Less Control"
date:   2022-06-01
tags:
  - enterprise architecture
field: Software Engineering
---

- no control over the update cycle



- [Discenomomies of scale](https://en.wikipedia.org/wiki/Diseconomies_of_scale)
    - Long Run Average Cost (LRAC) vs Long Run Marginal Cost (LRMC)
- Human Hours (HH)
- Ability to free freeze a product vs continuously having to maintain and develop it

- Cost
- Capabilities
- Complexity

General overview:

Overall there are two cases:

1) You use the managed service, you have no control of when and how a new release drops and thus
also no control over how big this change is.
    1) Since there is a SLA of 99%, you only have to really scramble `0.01 * 365 = ` days of the
    year to do anything.
2) But you still need to keep someone around to fix any potential issues. Even if it‘s
just identifying the issue and talking to support.
2) You host and run the service yourself.

- The release cycle has a frequency of `f = t/T`, whereas `T = 1 year`.  But only every
  `d = 2` th time you have to actually do anything.
  - If it takes `x` human hours to deploy and update a certain product. 
  - Further more let‘s assume that you have to pay a reasonable good engineer in both
    cases, let‘s say `yearly pay = 100000`.



Imagine you have you have decided that your Kubernetes cluster really needs metrics, and your apps
and serves too. You have further decided to go with Prometheus and Grafana, as they are open source,
free to use and somewhat of an industry standard so finding resources and help should be fine.
Given that you run your cloud on Azure you are now faced with the decision to go with the managed or
the self-hosted version.

After investing some hours trying to understand the open source version a bit better to gauge the
complexity of the task 


