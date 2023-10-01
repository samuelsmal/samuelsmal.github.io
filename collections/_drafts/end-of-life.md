---
layout: post
title:  "End-of-life"
date:   2023-03-27
tags:
  - product ideas
fields: Product ideas
---

Salut, at FIFA we’re entering the long-game where we need to pay attention to external library and platform changes. And we need a tool, not a process, to keep track of it. Let me detail what I would like to have and either we as D-ONE create such a tool or - hopefully - there is something out there that does this already.
For example Kafka 3.4.0 is released on 2023-02-07, given their [EOL policy detailed in their release plan](https://cwiki.apache.org/confluence/display/KAFKA/Time+Based+Release+Plan#TimeBasedReleasePlan-WhatIsOurEOLPolicy?) they will stick to patching the latest three releases. Which means that everything older than 3.2.0, released in May 2022, is no longer supported. They do roughly three releases a year, which gives us a year to install and test the new release. Knowing this I can plan and coordinate accordingly.
Thus: “Me as a tech lead would like to have an automatically updated list of external dependencies - be it libraries or platforms - detailing the currently installed version, the most-update version and the EOL for the currently installed version.”
I don’t expect this to be fully automated, but IMHO the only thing that you actually need to provide is the currently installed version of your dependency. The rest can be pooled (e.g. a small but custom script that fetches the latest release tag, for an example using github release tags click [here](https://stackoverflow.com/questions/29109673/is-there-a-way-to-get-the-latest-tag-of-a-given-repo-using-github-api-v3))

There is [endoflife](https://endoflife.date/) which sort of does the trick but not quite.
