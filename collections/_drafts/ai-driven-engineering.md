---
layout: post
title:  "AI-Driven Engineering"
date:   "2026-06-01"
tags:
  - software engineering
  - AI
  - agentic engineering
---

# Introduction

In this post I want to collect the ideas, observations, approaches, ... that I am faced with during
my journey into AI-Driven Engineering. Thus, I will update this post from time to time to reflect
new things.

# AI-Driven Engineering

Since [Anthropic](https://www.anthropic.com/) launched Claude Code in the beginning of 2025 the
topic of using AI in software engineering has sky rocketed. Of course people used ChatGPT prior to
this, but the results were questionable. The context window was too small and usable harnesses, such
as Claude Code, did not exist then.

So, what do I mean with *AI-Driven Engineering* and why not *Agentic Engineering*? The distinction
can be somewhat arbitrary, but I view *Agentic Engineering* to be a subfield of *AI-Driven
Engineering*. While AI-Driven Engieering sets the intent to use AI (which in reality is just

# Why do it?

Now I finally have time to do the fully-fletched software engineering with all the pesky automation
with small teams. The overhead of communication is completely gone - as long as your team is
efficient. I can work on 5-10 parts of the project at the same time. The efficiency gain of course
depends heavily on the company and project (Google claimed an overall 2% efficiency gain TODO
citation), but for the projects that I am involved in right now the decision is an very easy one.

# Issues

## Solved Issues

### Matching Architecture / Solution Design

In the past there were huge discussions about mono vs small repos. Micro vs monolothic
services. Now the discussion is gone. Having many smaller repos and services that have a clear
boundary fit very well into the limited context windows of the LLMs. And you can very easily work in
parallel on multiple parts of the project.

## Ongoing Issues

### Estimation and planning
### Increased security requirements

There are a lot of recent supply chain attacks (TODO list them)

### Discovery and selection bias

LLMs tend to use tools that occur often in their training data (TODO citation needed), it will thus 

### Juniors

With these new tools the old setup of hiring and guiding juniors is broken. Since a good software
engineer is no longer bottlenecked by implementation-time, but design- and review-time, any junior
will now consume more time that they are worth as long as they are juniors. There are just no longer
simple, yet time-consuming tasks where it makes sense to employ a junior. Giving the task to an LLM
is faster, much, much faster. There is also no need to translate ambiguous terms, or to explain 
technical terms. The LLM either knows them or looks them up. The whole flow from detected issue to
detected solution to implementation and review is so much faster and easier. No more
lost-in-translation issues!

Now... where then do we get senior engineers from?
