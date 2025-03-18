---
layout: post
title:  "Decoupling Through Buffers"
description: |
    Architecting evolutionary data systems
date:   2025-03-18
tags:
  - software architecture
  - system architecture
  - evolutionary systems
mathjax: true
---

Every modern, evolutionary software system exhibits a certain behaviour or functional pattern -
namely **exchangeability**. Parts of the system should be replaceable, upgradable and maintainable.
A common way is to follow a microservice-aligned design. There is a lot of literature out there that
explains how and why a (micro)service-oriented software system architecture is beneficial. But not
so much on data heavy systems, which are a subclass of software systems.

In data heavy systems data has a direction. You go from source to target. In [data vault
modelling](https://en.wikipedia.org/wiki/Data_vault_modeling), and especially in the [medallion
architecture](https://www.databricks.com/glossary/medallion-architecture) the data goes through
different layers. Rarely, does the data go in a circle. (This is slowly changing - which is a topic
for another time.) In software heavy systems this is different, services can call each other, they
interact much more.

As I work more often in the former over the last few years with a lot of different companies and
teams I make a simple claim: Given the directional flow it is more difficult to split up code into
functional parts which can be individually developed, maintained, scaled and deployed.

In analytical systems this does not apply, there the data flows through a somewhat clear evolution:
From raw to unified to curated to serving. But in operational systems this is usually tricky to set
up. Applying these labels to data is non-trivial as raw data can immediately be served to end-users.
In analytical systems one usually has all the information that one needs to decide to process the
data, if something is missing, just process it at a later stage. Not so in operational systems.

I've seen it time and time again that people for this very reason what to increase the scope of a
step. It seems simpler and straightforward to extend the capabilities of a part to handle late or
missing data, to process it further than originally designed. Resulting in a monolithic application
that can have devastating effects upon failure, is tricky to extend. Be it adding additional
processing or sharing an intermediate step of the data pipeline with other parts of the system.

My second claim is that a reasonable guideline to come up with a decent split is the buffer. Simply
put: wherever you use a buffer, ask yourself if you should use an external buffer instead. Given
that you now have an external buffer you can split your application into two parts, resulting in
smaller fractions of your original code which you can individually scale and maintain.

# What is a buffer?

From a purely functional view a buffer is just a container that can hold elements for a while. The
other key aspect is that it allows you to connect different parts of the system. It can define a
boundary inside the system or even to the outside. It follows, that a buffer defines an interface,
on a technical and functional or behavioural level.

Maybe the buffer exists only between different threads of a single program, or it is just a file
that allows different programs to read from the same source, or it is a global message broker.

Each buffer has a certain behaviour in that it disentangles the different processing speeds. It
allows the sender and receiver to operate at different speeds. Ideally, the receiver reads at least
as fast as the sender produces new messages, otherwise you will end up with a lot of unprocessed
data.

# What do they allow you to do?
## Individual scaling

A buffer, being a container that contains some data, allows you to have different numbers of
producer and consumer. One usually begins with a single producer and consumer. There could be many
consumers because the data that a single producer creates takes a long time to process. Or there
might be many producers and only a single consumer. A classic example would be some sensors that
push data to a Kafka broker where a stream processor picks up the messages and applies some
transformations. Given that the sensors don't send data in high frequency a single stream processor
instance is sufficient.

Maybe one could have done the transformation directly on the edge device, but this might make the
edge device more costly to develop. By having the option to scale individually one doesn't have to
think about that.

It's important to note that [Apache Flink](https://flink.apache.org/) and [Apache
Spark](https://spark.apache.org/) allow you to scale different parts of the execution individually.

## Decide where to put the complexity

In my eye, complexity of a system is akin to the energy of a physical system. As stated by the [law
of conversation of energy](https://en.wikipedia.org/wiki/Conservation_of_energy) the total energy of
an isolated system remains constant, but it can be transformed or transferred from one form to
another. With the complexity of a software system it is similar. One can create a monolith that does
everything, or multiple microservices that work in unison.

Assume that you have a sensor that provides you readings, these readings will have to be grouped
first, then aggregated which allows further processing. For example CO<sub>2</sub> readings, which
would be aggregated over multiple windows and if then exceeding a threshold a window would
automatically be opened. Functionally, the system looks like this:

```
┌────────┐  ┌────────────┐  ┌───────────┐  ┌──────────┐  ┌────────┐
│ Sensor ├─►│ Aggregator ├─►│ Predictor ├─►│ Actuator ├─►│ Window │
└────────┘  └────────────┘  └───────────┘  └──────────┘  └────────┘
```

The sensor itself can't be altered, so you need some sort of interface with it.
You could put everything in the interface, then the system architecture diagram
would like the following:

```
┌────────┐  ┌───────────┐  ┌────────┐
│ Sensor ├─►│ Interface ├─►│ Window │
└────────┘  └───────────┘  └────────┘
```

Meaning the aggregation, prediction and actuation (the interface with the physical world) code would
all reside in the interface. That would mean that would need to handle the different types of load
and errors all in one application. This extreme, the monolithic, solution would not need any
buffers, and the system architecture diagram would be extremely simple - as shown above.

The other extreme, the microservice solution, would be to keep each functional item in a different
deployment. To make that work, you would need some sort of orchestrator to manage the different
deployments and a transport layer to exchange messages. That transport layer is a buffer.

Do you not need these parts in the monolithic solution? No, they are still there, just hidden away.
The monolith needs to be monitored and deployed, thus there is a need for an orchestrator. The
orchestrator might be simpler, but if the problem is sufficiently complex the difference will be
minimal. It will just be a few more entries in the configuration.

What you would miss in a monolith is the system-level clarity of design and monitoring capabilities.

Note, that cloud native deployments work very well in combination with modern monitoring solutions
such as [OpenTelemetry](https://opentelemetry.io/). By having a microservice architecture, you can
get these capabilities basically for free.

The total complexity remains the same, on a functional level. It is up to the team that implements
this to decide what they can handle better.

## Exchange parts

As seen above, the decision on where to put complexity leads to a different type of system. By
introducing a microservice architecture one needs buffers, and by introducing these buffers one can
exchange parts separately quite easily.

This is a key feature of having buffers on a system level. It allows you to exchange parts clearly,
on a system level. Which has several benefits. Work can be split between people more easily,
including ownership of parts. If the interface, meaning the data in the buffer and the behaviour is
well-designed described and documented, one can exchange these parts easily. This includes rolling
out new features.

This could also be achieved in a monolith, but the mental model is different. It is very easy to
lump everything together if there is no constrain to keep them apart. By having this constraint on a
system level it enforces a certain cleanliness which allows the system to adapt, to evolve. Maybe a
new type of sensor comes along, creating a new interface that take the new data format but outputs
it in the old schema is trivial in the microservice, clear buffered approach - by design.

It is this exchange-ability that makes a system that uses buffers an evolutionary system.

## Declare boundaries

To a certain degree this is a tautology, but by using buffers at strategic locations you can enforce
sensible system boundaries. Which can be documented. By having these clear boundaries, other teams
can implement against them. Buffers are a form of an API, after all.

## Downsides

The clear downside, is that you now have to maintain an additional part, but as mentioned above, you
had to do this anyway. Now it is just in the open.

Depending on the type of buffer, but this applies to basically all of them, the amount of latency
introduced varies. Serialization and deserialization of data is not free and send it around costs
network traffic.  Is this a concern? I would argue no, not for most systems. If you're working in
high-frequency trading it might. But modern hardware is pretty fast and one could even co-locate it,
such that it runs on the same machine. There are always solutions of these problems.

# Conclusion

Buffers represent more than just technical components in a system architecture—they embody a
fundamental design philosophy that enables evolution, maintainability, and scalability. By
strategically positioning buffers at system boundaries, organizations can create clearer interfaces
between components, distribute complexity appropriately, and facilitate the independent development
and scaling of system parts.

The decision between monolithic and microservice approaches ultimately
depends on the specific needs, constraints, and capabilities of your team and organization. However,
recognizing buffers as first-class architectural elements—rather than implementation
details—provides a powerful mental model for designing systems that can adapt to changing
requirements and technologies over time.

As data systems continue to evolve toward more complex,
bidirectional flows, the strategic use of buffers becomes even more critical. Teams that master this
approach gain the ability to innovate incrementally, respond to changing requirements flexibly, and
maintain system reliability even as individual components are replaced or upgraded.

By making conscious decisions about where to place system boundaries through buffers, architects and
developers can create truly evolutionary software systems—systems that grow and adapt alongside the
organizations they serve.
