---
layout: post
title: How to do it exactly once
date:   2022-10-07
tags:
  - software engineering
  - message queue
field: Software Engineering
---

In the world of message queues and real-time processing you come across three different guarantees
of message delivery:

1. at-most once,
2. at-least once and
3. exactly once.

While the first two are kinda trade-offs, the last one is clearly the holy grail.  Normally one
would talk about how the message queue system enables or guarantees this, but I want to talk about
how producers can do it.<label for="sn-message_queue_system" class="margin-toggle
sidenote-number"></label><input type="checkbox" id="sn-message_queue_system"
class="margin-toggle"/><span class="sidenote">If this interests you a bit then check out these cool
posts: [Improved Robustness and Usability of Exactly-Once Semantics in Apache
Kafka](https://www.confluent.io/blog/simplified-robust-exactly-one-semantics-in-kafka-2-5/), the
[Reliability Guide from RabbitMQ](https://www.rabbitmq.com/reliability.html) or ...
</span>
It's all nice and dandy if your message queue system can deliver your data exactly once - the same
message that you pushed now for the third time that is.

Before we talk about the magic solution that are *transactions*, let's quickly use a high-level
overview of what is going on.

<figure>
  <img src="/assets/img/how-to-do-it-exactly-once/simple_setup.png"/>
</figure>

Your client sends a message and the MQS acknowledges it. If you don't get the `ack` you know that
the message wasn't received. Then you resend it, and resend it until you finally get that `ack`.
The way how you respond to the `ack` or the lack thereof dictates what guarantee you fulfill.

1. If you don't wait for it, or ignore it, you get *at-most once*.
2. If you wait for it, and retry if you don't get it, you get *at-least once*.
3. If you wait for it, and wait exactly the correct time to capture the "didn't receive the `ack`"
   event and only then retry, then you get *exactly once*.

Obviously there are some tools that provide these guarantees for you out-of-the-box. Like [Flink
does](https://flink.apache.org/features/2018/03/01/end-to-end-exactly-once-apache-flink.html). But
for a second let's assume that you had to create a POC in a different platform, that suddenly is now
in production and now people ask for some guarantees.

*At-most once* is pretty easy to achieve, just send it and forget about it. This is probably want
your application started with. It's ephemeral, easy to setup, and works really well as long as you
or the consumers further downstream can work with missing messages. Going with this you will also
not create any new out-of-orderness in the stream.

If you do not care about out-of-orderness or duplicates you can just have a queue of messages to
send, and if didn't get the `ack` after a certain threshold you add them again.

<figure>
  <img src="/assets/img/how-to-do-it-exactly-once/at-least-once.png"/>
</figure>

What that threshold is, you have to decide yourself (and test it), factors that heavily influence it
are obviously the MQS and your network. It can be up to [30
seconds](https://learn.microsoft.com/en-us/azure/event-hubs/apache-kafka-configurations). Which can
be unacceptable high. So you might want to resend the messages a bit below this value. But then you
could be sending it multiple times and be introducing some messages out-of-order. For example when
the package for one message was lost in the nirvana of the internet, but the following went through,
do you resend the first one?

## On the path to *exactly-once*

<figure>
  <img src="/assets/img/how-to-do-it-exactly-once/exactly-once.png"/>
</figure>

One remedy would be to have two pointers, one pointing to the last message that you send, and the
other one pointing to the last one of which you got an `ack`. If there is a huge outtake

The good thing about this, is that you expand this idea nicely into a "classic" ETL pipeline. Assume
that you no longer just produce messages, but that you are now transforming messages that you are
reading from another MQS.

<figure>
  <img src="/assets/img/how-to-do-it-exactly-once/end-to-end-mechanism.png"/>
</figure>

The tricky thing is to align all these pointers.<label for="sn-ptr-storage" class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-ptr-storage" class="margin-toggle"/><span class="sidenote">Ignoring storage of them for now,
because your application has crossed the ephemeral-threshold some time ago. The quick and dirty
answer is obviously a cache. But this comes with another huge set of trade-offs.</span>
What happens if your application crashed?


## Conclusion

By now you probably have realised that there can't be a complete guarantee on *exactly once*. Except
if you also have a consumer next to your producer that is reading from the same queue that you are
pushing data into and checks if every message is in there. Which is probably not what you want to
setup. Thus there is always a certain trade-off between out-of-orderness and delivery guarantees.

If you do what that all messages arrive at their destination then go for *at-least once*. It is
still somewhat easy to implement and control.

If you want true *exactly once* you have to invest heavily into your setup, and either have a very
slow or limited stream of data, or accept that some messages arrive out-of-order.

*Ps.:* Transactions obviously just encapsulate the above send-acknowledge cycle. They are not magic.
