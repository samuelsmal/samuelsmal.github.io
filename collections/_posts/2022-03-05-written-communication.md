---
layout: post
title:  "Written communication, a.k.a. emails"
date:   2022-03-05
updated_on: 2022-06-12
tags:
  - leadership
  - communication
description: |
  Kinda prompted by a junior dev that I am mentoring... Thought it would make sense to write it down.
  So here we are, Sam's way on how to communicate and write emails.
field: Communication
---

Professional (or private) communication is key to everything. How, what and when you communicate can
have a much bigger impact than the code you write. If you can't find out what your client needs,
what problem you face or what impact this has it will come back to haunt you.
Although a lot of what I'll write about is about written communication, some is also about general
communication. Exchange emails with Slack / Teams / ... messages or whatever tool you use.

I'll give here a short description followed by a one sentence rule that hopefully is concise and
coherent enough.

Let's start with a general communication rule:

It is on the messenger to choose the right expressions for the receiver. There is no "you have
misunderstood", it is always "I have explained that wrong". If the receiver didn't fully understood
your point that you need to adapt your wording, you want to be understood, it's your responsibility
to phrase it accordingly. For example if the receiver is a technical person they likely will want to
know some more details, if it's an ultra busy manager they will likely still want that technical
information to pass it along, but also an summary. But yourself into the shoes of the receiver and
try to come up with the wording and content that the receiver would like to read.

<div class="epigraph rule">
  <blockquote>
    <p>
      Although that there are always two sides to communication it is on the messenger to ensure that
      what was understood is what was meant to be communicated.
    </p>
  </blockquote>
</div>

A message without context will never work. If you send an email to a colleague that you are in close
contact with there is probably not much context needed. In general, the less you see or talk to a
person the more likely is it that they have forgotten what this email will be about, so give
context.
It can be something trivial as "As our meeting two weeks ago about project x..." or "we did some
more research into the caching issue on server ..." or "as a follow-up on our talk earlier".


<div class="epigraph rule">
  <blockquote>
    <p>
      Every message should come with the right context.
    </p>
  </blockquote>
</div>

Expanding a bit on this, every bigger message should open with a statement on why you are contacting
this person, why is it important for them to read and answer you? What is the value for them?

<div class="epigraph rule">
  <blockquote>
    <p>
    Open every message on why it is a concern for the recipient.
    </p>
  </blockquote>
</div>

If you're contacting them for the first time, give a brief introduction on who you are as well.

<div class="epigraph rule">
  <blockquote>
    <p>
    Ensure that the recipient knows who you are.
    </p>
  </blockquote>
</div>

---

Onto the content. The following rules are somewhat overlapping and touch the same thing over and
over again. Try to incorporate them all.

What do you want to convey? Hopefully this is a single thing. Grouping multiple
things into one message will make the written conversation more difficult. The question is what is
this *thing*? In general this depends if you want to give or receive something. I want to find out
why something didn't work, this something and the question about it are the single *thing*. If it's
about informing people about the recent changes we made to the platform or how to use some
complicated API or how the latest KPIs look this is that *thing*.
Think about the purpose of the message. This single purpose should be the focus of your thoughts
behind every message.

If you group more than one thing into one message the chances are that some will not be answered is pretty
high. Sometimes you will not even notice and then it's super awkward to ask again a few weeks later.
On the other hand, if you want to inform people about something it's usually much nicer to have
everything in one single message.

Of course this is strictly seen not doable, if you provide a design proposal it's two purposes, one
to inform and one to ask for feedback. The real purpose is to get feedback, thus the proposal is the
context.

<div class="epigraph rule">
  <blockquote>
    <p>
      Messages should have a single purpose.
    </p>
  </blockquote>
</div>

Expanding on the purpose. If you want to receive anything from the recipient you need to guide them.
People don't like thinking for themselves, they like to think that they do, but most don't. So
provide some helpers. Make the message actionable and super clear. You want some feedback on some
design, ask for it! And if you don't include the deadline it will not happen within your desired
time frame, be open and frank about this. "Please provide any feedback on this by the end of the
week, if you're not able to do so please let me know beforehand". That way you give a clear deadline
and some flexibility, you will work on the feedback by the middle of the week after anyway.

<div class="epigraph rule">
  <blockquote>
    <p>
Messages should be actionable. Include the what, the (until) when [and the how].
    </p>
  </blockquote>
</div>

The above rule is only indicative of what the content should be, the next rule touches the
structure. I prefer to start with the conclusion - where applicable. Everybody gets a lot of emails
so try to show some empathy and structure your email in such a way that people can start skimming or
stop reading altogether. People call this the *Minto Pyramid* or *BLUF, bottom line up front*, you
start with the conclusion, followed by the key arguments and lastly come the supporting points with
detailed information. I would use this structure when writing a design proposal, work plan, analysis
of some data, ... I wouldn't use it where I want to force people to read the whole thing and where
there is no clear indication on how to move forward.

<div class="epigraph rule">
  <blockquote>
    <p>
    Structure your message accordingly. Use BLUF, a.k.a. Minto Pyramid whereever you can.
    </p>
  </blockquote>
</div>

Each message should try to provide answers to the *Five W's*: Who, What, Where, When, and
Why. The above rule expands this a bit, you could view it more like *What?* followed by *"So what?*.
If it has a military vibe for you then you are correct.<label
for="sn-message_kabir" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-message_kabir" class="margin-toggle"/><span class="sidenote">
  <a href="https://hbr.org/2016/11/how-to-write-email-with-military-precision">Kabir Sehgal wrote a similar post in the Harward Business Report</a>,
  and gives three main ways to format emails with military precision: 
    1) Subject with key words - Key words specify the nature in email (e.g. Action, Sign, Info, Decision, etc.);
    2) Bottom Line Up Front (BLUF) - Emails should be short that basically answers the 5W's: who, what, when, where, and why;
    3) Be Economical - short enough to understand and covey all the details. Using of Active voice is highly mandates rather than using passive voice.
</span>
The idea is that this touches the issue from all sides. It can of course be that one of the W's is
not applicable.

<div class="epigraph rule">
  <blockquote>
    <p>
    Try to answer the Five W's: Who, What, Where, When, and Why.
    </p>
  </blockquote>
</div>

---

Onto style. This is more of a personal preference. If there are lists I use a number before each
item and not bullets if I think there will some sort of back-and-forth. It's much easier to
reference a number than bullets. Without providing a easy reference people will use the dreaded
inline mode or something along "the second point", why not provide these references from the start?

This expands obviously to the context as well. A reference point is not just for lists, providing
dates, clear numbers and figures goes a long way to remove any possible sources of confusion. If you
start the email-chain you can set the tone and method of the conversation.

<div class="epigraph rule">
  <blockquote>
    <p>
    Try to remove any points of confusion before they arise.
    </p>
  </blockquote>
</div>

How you word things is important, there are some who don't care how you phrase things. Some will be
pissed if you don't add their title to each letter. Some might need a bit more hand-holding. Some
might foresee any issues, some don't.
Nice vs kind is probably one of the most recent communication buzzwords. The idea is to be helpful
and friendly, while also not masking or talking around issues. If shit hits the fan, say it. "Call a
spade a spade." But do it nicely.
On the same page, open or close the email in a personal way - if you can. Let's say you have been in
close contact with an engineer of one of your vendors. Why not replace the "Best regards, Sam" with
"Cheers, Sam"? If they have been on vacation or sick why not ask about it? Receptive people will
notice, and if they don't, who cares. Didn't cost you anything. The goal is to foster a
relationship, they should trust you, and believe that you see them as a person.


<div class="epigraph rule">
  <blockquote>
    <p>
Be kind not nice.
    </p>
  </blockquote>
</div>

<div class="epigraph rule">
  <blockquote>
    <p>
    Foster a relationship. Every time.
    </p>
  </blockquote>
</div>

Use a spell & grammar checker. Everybody makes mistakes. Find some tools that do that for you. If it
means that you need to paste the message into Google Docs so be it. Maybe find a program that works
better with your workflow though. Don't forget to set it to the right dialect, which is `en_gb` for
English.

<div class="epigraph rule">
  <blockquote>
    <p>
No spelling mistakes.
    </p>
  </blockquote>
</div>

Combining all of the above into an example:

```
Dear Madam or Sir,                   // if you don't know who you're talking to
[Hi | Good morning] Fred,            // if you know them well / not so well

Sam here from Evilcorp, I am the responsible person for the monitoring of system X.
I wanted to come back to you about the recent outage that we experienced on the 2021-01-23.
As per out logs (attached) we can identify the issue to occur around 14:30 UTC.
I had a look at our metrics and couldn't identify anything on our end.
Can you have a look on your end and get back to me by the end of next week?

[Best regards | Cheers],
Sam
```

