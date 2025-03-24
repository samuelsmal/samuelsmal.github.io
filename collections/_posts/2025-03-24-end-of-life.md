---
layout: post
title:  "End-of-life"
date: 2025-03-24
tags:
  - product ideas
fields: Product ideas
---

After managing a rather large code base and system for two and a half years, I've come to the
realisation that keeping track and aligning the different versions and releases of tools is just a
pain. I knew it was a painful process, but I hoped that I would find the time to either build a tool
or find it somewhere. Now I need to admit that I will probably never find the time to build a system
dependency management tool that does the following:

1. Given a list of requirements outputs a list of available releases that work well together.
2. Given a list of functional requirements outputs a list of viable solutions.

There is [endoflife](https://endoflife.date/) which sort of does the trick but not quite. It is by
no means complete, which is not their fault, given that the information is sourced by open source
contributors. But it still requires that I somehow keep track of all the different layers of the
architecture.

It baffles me that this does not exist. Could even be for a specific cloud provider. The big three,
AWS, GCP and Azure all have way too many products and weird, non-transparent and non-informational
roadmap or release announcements. A good example is Azure's Event Hubs. They currently (2025-04-24)
have a [dead link](https://azure.microsoft.com/en-gb/roadmap/?category=iot) to their general
roadmap. Good luck with figuring out when they release as well. I am aware that this is a fully
managed service, but I would still like to know when things get released. I've been burned by this a
few times, where a release caused a server to crash for a few hours. Only after pulling in Azure
Event Hub engineers did they acknowledge that they caused the issue.

There are also generally too many products out there. Which of the multiple Kafka-equivalent
solutions would work in my case? How would I know without testing them all? If only there would be a
standard way to describe what your service is doing. Doesn't need to be perfect and complete. I
don't need nor understand all the options in most services.

At least for programming languages, I can use dependency management tools to resolve them. But
validating them all on a system level is just absent. I still remember when I wanted to update an
Azure Kubernetes Service to the latest version, but decided to read the [release
notes](https://github.com/Azure/AKS/releases) to find out that this would break a configuration that
we relied upon. Oh, the fun.

So please, build this tool.

