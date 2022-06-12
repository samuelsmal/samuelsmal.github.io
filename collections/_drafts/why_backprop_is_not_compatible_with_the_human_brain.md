---
layout: post
title:  "Why Backpropagation is not compatible with the human brain"
date:   2022-02-01
tags:
  - machine learning
  - neuroscience
description: |
  Basically some notes on how to ferment stuff.
field: Neuroscience
---

https://www.quantamagazine.org/artificial-neural-nets-finally-yield-clues-to-how-brains-learn-20210218/
https://psychology.stackexchange.com/questions/16269/is-back-prop-biologically-plausible
Yoshua Bengio, George Hinton, Daniel Yamins
instead: feedback alignment, equilibrium propagation, predictive coding show more some promise as a
biologically plausible learning mechanism
Daniel Yamins
Hebbian rule is too narrow, particular and not very sensitive way of using error information
Predictive Coding
Attention -> Pieter Roelfsema
reasons:
The first is that while computers can easily implement the algorithm in two phases, doing so for
biological neural networks is not trivial.
The second is what computational neuroscientists call the weight transport problem: The backprop
algorithm copies or “transports” information about all the synaptic weights involved in an inference
and updates those weights for more accuracy. But in a biological network, neurons see only the
outputs of other neurons, not the synaptic weights or internal processes that shape that output.
dopamine as a global reinforcement signal / reward system -> teacher
