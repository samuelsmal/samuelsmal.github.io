---
layout: post
title: "Streaming Architecture"
date: "2024-03-03"
tags:
    - streaming
    - data processing
    - stream processing
    - real time
field: Software Engineering
---

A long time ago people ...

## Two Types of Systems

In most organisations there are two types of data systems: an operational and an analytical one.
They are distinctive in their requirements and behaviour, it can be that both are using the same
physical (or virtual) infrastructure, but the needs are different.

**Operational** data systems deal with day-to-day data. In most cases they return the current state,
have to be able to process a high volume of data and serve responses with low latency. It probably
wouldn't be a stretch to say that most companies use a database where any change is aggregated into
the latest state as their primary operational data system. Depending on the system it might not be
necessary to store the changes at all.
The data is mostly, but not necessarily, moved in a real-time, event-driven manner. While this might
not be obvious, and considered as a design criteria, it still holds true. A stale state is useless,
but calculating an up-to-date state might not be trivial nor efficient.

These systems might also be referred to as *systems of record*.

**Analytical** data systems are used to analyse your organisation, they help to drive business
decisions. Historical states, and all the changes that lead up to these states are stored. This data
is mostly stored in data warehouses. There are many, many different formats out there to store such
data: data warehouse, data lake, lake house, ... But they all have in common that they operate
mostly in an batch-oriented way. Data is extracted, transformed and loaded from one location to
another. Reports are then generated and shared hourly, weekly, monthly, ... The current trend goes
towards a more event-driven and real-time approach as well. But so far
[cost](https://blog.devgenius.io/why-is-snowflake-so-expensive-92b67203945)
is prohibiting this to a large extent. Usually an organisation doesn't need to nor can react to
shifts in their data. If that would be the case, then it would be part of the operational system by
design.

These systems might also be referred to as *systems of insight*.

## Two Types of Data (Pipelines)

In this context I consider two types of data: **batch** and **streaming**. And the former is
basically just a bounded stream, thus there is only one type of data and that is streaming.

The pipelines to process the data however can be executed in streaming or batch mode. The later is
the traditional way, it is safer, easier to control and maintain. Keeping a program running for a
long time comes with a lot of problems and can be less efficient. To give one example: if the stream
is not constant in volume but exhibits a high fluctuation in frequency<label for="sn-unevenly-spaced-time-series"
class="margin-toggle sidenote-number"></label><input type="checkbox"
id="sn-unevenly-spaced-time-series" class="margin-toggle"/><span class="sidenote">
The proper term would be [unevenly spaced time
series](https://en.wikipedia.org/wiki/Unevenly_spaced_time_series) and good examples would be
basically everything that does not come from a sensor. And even then it would be a pretty bad system
design to send the same state over and over again if it did not change. However, sending data to
give the latest state is only the primary reason, the secondary reason for sending data at regular
intervals is to be able to tell if the connection is still valid.
<br>
Interestingly, the human eye only sends differences in light between neighbouring cells, and only if
these differences are changing - it is a pretty smart design. But the brain is not so smart and if
the eyes would be static and not constantly move we would only see grey. The brain thus needs
constant eye movement to tell if the eye is still attached.</span>, this results in non-constant
needs of compute to process the stream. There are a lot of systems that can handle such scaling, but
they are all more complex than just having to run a program and to wait until it is done.

One common pattern is that these pipelines are written in different programming languages, either
because they are executed by different people or because they run in different parts of the system.
They also have different requirements: a streaming application needs to consider **latency**,
**throughput**, **messages arriving out-of-order**, **messages arriving out-of-window** and many
more. A streaming application is by design always an approximation, whereas batch processing can
just safely drop unnecessary information, reorder messages and knows perfectly well when it can
close an aggregation window. It can also be safely restarted if the state grows too large and more
memory or compute is required. A batch process can easily aggregate multi-year spanning data, doing
this in real-time for a stream of data is an engineering problem that so far has not been solved on
the same level.

Given these vastly different requirements it seems only natural that organisations deploy different
systems and software to solve these problems. There are multiple approaches to remedy this: [Apache
Flink](https://flink.apache.org/) for example let's you write the same code for bounded and
unbounded streams.


On the other hand [dbt](https://www.getdbt.com/) seems to be the gold standard for ETL pipelines.


- The concept that all data can be processed in one go is a rather recent one. Out-of-core
  calculations are not trivial.
- There seems to be a fundamental trade-off between latency and throughput, with stream processors
  optimizing for latency and batch processors optimizing for throughput.


## Data warehouse providers

Two common contenders for **analytical** systems are [Snowflake](https://www.snowflake.com/en/) and
[Databricks](https://www.databricks.com/). There are many more, such as [Google
BigQuery](https://cloud.google.com/bigquery/) and [Microsoft
Fabric](https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview). They all
claim roughly the same: being an "all-in-one analytics solution for enterprises that covers
everything from data movement to data science, Real-Time Analytics, and business intelligence".


Both make the claim that they can store and host all your
data and pipelines. Batch and stream processing is possible. Not only for analytical but also
operational needs.

## Architectures

### Data Warehouse architecture

The classical layering in data warehouses are:

1. Landing
2. Bronze
3. Staging
4. Silver
5. Gold


Or

1. Landing
2. Unified
3. Curated
4. Serving

### Streaming

#### Lambda architecture

Uses three layers:

- batch processing,
- speed or real-time processing, and
- serving layer for responding to queries.

Was established in 2011 by Nathan Marz in his article [How to beat the CAP
theorem](http://nathanmarz.com/blog/how-to-beat-the-cap-theorem.html)

The main drawback is that you have a different code base for all the three above layers that must be
aligned and kept in sync.


#### Kappa architecture

#### Missing in the above

- Not a clear layering system
- Not a clear separation
    - At what cost?

