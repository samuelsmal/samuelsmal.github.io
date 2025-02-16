---
layout: post
title:  "Challenges in transitioning from batch to streaming"
date:   2025-02-14
mathjax: true
description: Challenges frequently seen when transitioning from batch to streaming.
---

In the past three years I had the pleasure to advise a few companies on their transition away from
slow batch-oriented workflows towards streaming. In this post I want to highlight some of these
challenges.

# Thought model

The most striking challenge is the thought model. As you don't start from a greenfield and can pick
your engineers fresh...

Let's assume you have a data pipeline

- Ways of programming
    - Operating on a stream, with a fixed memory will scale but requires a different way of
      programming


In my world, which is the big, corporate data warehouse / data lake world, modern data pipelines as
commonly either expressed in [Apache Spark](https://spark.apache.org/) or
[dbt](https://www.getdbt.com/). One could argue that it is just SQL underneath, and one would be
correct in most cases. Of course there are some additional thoughts that go into that. [Metadata
driven ETL
frameworks](https://community.databricks.com/t5/technical-blog/metadata-driven-etl-framework-in-databricks-part-1/ba-p/92666),
[medallion architecture](https://www.databricks.com/glossary/medallion-architecture) and so forth.
There is a new contender on the field as well, the
[streamhouse](https://www.ververica.com/blog/from-kappa-architecture-to-streamhouse-making-lakehouse-real-time)
architecture. But underneath most if not all of that is SQL. It allows you to express your code in a
declarative way, which allows you to abstract away a lot of complexity. Which is good. The downside
is that more complex pipelines are very difficult to write. Regardless, management loves it. Some
engineers like it. Does it produce maintainable code? It depends.

However, there is one aspect that it does really well, it hides the running memory footprint and
leads to stateful thinking. A join over multiple tables might require lots of memory How much? Don't
know, don't care. The optimiser will take care of that. And it mostly works, not every time though.

This works well for a long time, but there is usually a point where...



When companies want to introduce a faster execution model to derive insights faster.



# Data completeness

When working in database world you do rely that the data in the tables is complete. It doesn't
really matter how the data is stored, be it in a single database, or multiple spanned around the
globe or a modern datalake. The SQL query will work with the underlying assumption that the data is
complete. And if it is not, because the data ingestion takes a bit longer to be complete one can
simply wait and schedule the execution accordingly.

In the streaming world however, this is seldom the case. The algorithms work in a approximative
way.

Let's assume the following stream of data. There is a sensor who publishes some values. The sensor
publishes a new measurement every second, and it takes another second for the data to propagate
fully through the system to arrive at the database. However, from time to time it takes a few more
seconds. Thus we can write it as such:

| Id | Value | Time of measure | Time of arrival |
|-:|:-:|:-:|:-:|
|a|1 | 0 | 1 |
|b|2 | 1 | 2 |
|c|0 | 2 | 10 |
|d|4 | 3 | 4 |
|e|5 | 4 | 5 |

Note that measurement $m_{c}$ arrived at timestamp $t_{c}=10$, instead of $3$.

If the task would be to give the average reading over the last three timestamps one would need to do
some windowing, and define the time of window (e.g. tumbling or sliding), but it would not be
extremely complicated. Given that we can have data arriving extremely late and with an unknown delay
we have to make a decision on when to execute the query. We could execute it twice, but that might
lead to weird behaviour further downstream. That will definitely result in a higher cost of
operations. Depending on the execution model it might even not work. A lot of larger datalakes mark
already processed datapoints in order to reduce operational costs. You can't process all data with
every refresh after all. Thus the safest option would be to run it once, but only at the moment when
you know that the data is complete. And thus we arrive at real-time systems that give you up-to-date
data with a freshness of a day.

So how would this look in the streaming world? You would do mostly the same, but your query would
use some primitives to abstract the delay away. You could define your aggregation window and
lateness accordingly. You might even capture late-arrival data points using specific methods, which
would allow you to recalculate the aggregations of the impacted windows.

This all works because the streaming execution model has a concept of time and thus lateness.

# Time is weird

# Be ready for a change

- In streaming you need to be able to cope with a change
- Implement the idempotent receiver pattern
