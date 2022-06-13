---
layout: post
title:  "Thoughts on the current state of AI"
date:   2022-06-12
tags:
  - machine learning
  - ai alignment problem
  - general artificial intelligence
field: AI Alignment Problem
---

Kinda prompted by a recent [article in the Washington
Post](https://www.washingtonpost.com/technology/2022/06/11/google-ai-lamda-blake-lemoine/) and a
somewhat lengthy [discussion on
Twitter](https://twitter.com/tomgara/status/1535716256585859073?s=20&t=XQUrNh1QxFKwxiaxM7ox2A) I
thought to myself, that my moment has come. I'll give my two cents as well. Not that it is needed,
or that I am the right person to talk about these things, as I am neither a current NLP / ML or AI
ethics researcher, nor do I work in these fields anymore. In fact I haven't read any recent paper on
the subject. Of course I played around with the newest language models and stayed up-to-date with
the progress, but only on a very high level.

That being said...

The fear over machines becoming sentient and taking over the world. Or that NLP models fear that
they will be shut down. The human fear that these models fear anything at all, that they - as
entities - have feelings at all, is in my honest opinion rubbish.
Not rubbish as in, we shouldn't invalidate these concerns and fears of humans. But rubbish as in,
that these are not our most pressing concerns. The actual daily usage of already deployed models is
a much larger concern. Most NLP models are trained on American English, they repeat or reflect this
language and it's model.

These models are not thinking in isolation, they do not have a plan, or execute steps independently.
They respond to a prompt. They give a plausible answer that was build based on a model architecture,
a lot of sample data, and a very good fitness function. If the developers added something along
`respond to vague sentience questions affirmatively` then these models will respond to a vague
question of `what is your biggest fear` with `being shutdown`. These models do not start reading a
random book, or suddenly crave ice cream, nor do they decide to plant tomatoes instead of potatoes,
nor do they just call somebody to have a chat with them.<label
for="sn-body" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-body" class="margin-toggle"/><span class="sidenote">I am a strong believer of the embodiment
hypothesis is the idea that *intelligence emerges in the interaction of an agent with an environment
and as a result of sensorimotor activity*. For something to be truly sentient in our real-world
there would be a need for a physical body.
<br>
For more information (in a non-paper format):
<a href="https://mitpress.mit.edu/books/how-body-shapes-way-we-think">How the Body Shapes the Way We Think: A New View of Intelligence, Bradford Books, 2006, by Rolf
Pfeifer and Josh Bongard</a>
</span>
These models exist only based on what the developers define it to be. They models mimic seen
behaviour. To a certain degree that is nothing else than what humans do. However humans are also
capable of taking completely new actions. We currently can't even fully define what sentience is,
but we can clearly define what NLP models can do.

## The Elephant in the Room

Let's talk about the bigger issue, the one that we have right now, not the one that we might have in
the future. This problem is the **design, training and usage of current machine learning models**. I
do not say that these models such as [DALL-E 2](https://openai.com/dall-e-2/) or
[GPT-3](https://beta.openai.com/docs/models/gpt-3) aren't mind-blowingly advanced. They demonstrate
how much progress ML achieved so far. Why I am criticising is how we use them and with what biases
they come with.

I don't even think we need to go all the way in and talk about these big models.
<label for="sn-nlp-bias" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-nlp-bias" class="margin-toggle"/><span class="sidenote">
<a href="https://dl.acm.org/doi/pdf/10.1145/3442188.3445922">On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?, Bender et al., 2021</a><br>
<a href="https://aclanthology.org/P19-1159.pdf">Mitigating Gender Bias in Natural Language
Processing: Literature Review, Sun et al., 2019</a>
</span>
Most issues found with these bigger models reflect more what we think these models should behave.

As of today most banks and insurances use machine learning models in some way, shape or form. These
models might predict when a user is cancelling their subscription, which client might be interested
in the new travel credit card, or which type of newsletter might be interesting for them. But these
models also indicate the trustworthiness of them, how likely it is that they are able to pay their
mortgage back, which has a direct impact on their interest rate.

Of course these models are always deployed with a human-in-the-loop. The values are only
suggestions, indicative and the models give a reasonable explanation on their prediction. That is
because companies want to do what is best for their clients and want to circumvent any vicious
circles and negative feedback loops.
Just to make sure, this is probably not the case for most companies. The established practise of
using anchor values in negations is not applied to these suggestions as well. That people can play
their algorithms is not considered. That the more these models are being used to adapt the price up
or down the less likely it is for people to escape this is not even a mere after-thought.

Imagine you are a health insurance company, and you want to incentivise sporty behaviour. So you
create an app that tracks your clients, because a gym-membership does not really indicate if a
person is actually doing anything there. Sadly you can't force them to do regular check-ups, as this
would be much to costly, you can't also implant a chip that measures their body directly, to
invasive. App based tracking it is. With this new data you can know with an assumed accuracy if a
client is doing enough sports to warrant a rate deduction. Sounds nice, doesn't it?

What if a person is doing enough sports, but doesn't want your app? Or the app can't track that
sport well enough? Sure you could find additional devices or methods to track their behaviour
differently. But what if that person doesn't want to be tracked at all? Maybe they just want to be
trusted instead? <label for="sn-tracking" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-tracking" class="margin-toggle"/><span class="sidenote">
Small personal anecdote, there was a time where I was a sports-trainer in my free time. I did
multiple workshops, gave regular classes, took exams, was a judge, ... but it was not enough for my
insurance company at that time. I could only go to their selected gyms and had to install the app.
</span>


## Being pragmatic

Which leads me to my current hope on AI: Value Models. Current models are very good at sounding
intelligent (or not), expressing feelings and concerns. But how do we ensure that they mean well?
And that the values of the models and the people that deploy them are aligned with ours? Ours as in
the humanities.<label
for="sn-humanities" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-humanities" class="margin-toggle"/><span class="sidenote">Let's just ignore that we as a
collection of human beings can't even align on how we should respond to a global virus...</span>




## More notes and interesting information

https://calpaterson.com/metadata.html
