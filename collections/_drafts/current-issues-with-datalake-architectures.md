---
layout: post
title:  "Current Issues With Data Architectures"
date: 2025-02-27
tags:
  - system architecture
  - data architecture
fields:
---

# Context

Part of my job is to review and propose system and data architectures. Data architectures, how data
flows through an organisation, has been a field of study for a long time. At the beginning where
databases and files, then larger databases followed by non-relational databases.

Then in 1980 IBM researchers Barry Devlin and Paul Murphy came up with the *concept of data
warehousing*. The idea was just

A data lake on the other hand combines all sorts of data formats into one. But since a data lake is
basically just a big dumping ground, one key issue was schema.

The next idea was to combine properties of a data warehouse with a data lake, the outcome is a data
lakehouse.

The newest development is data streamhouse. Proposed by
[Ververica](https://www.ververica.com/blog/from-kappa-architecture-to-streamhouse-making-lakehouse-real-time),
it combines certain features of a lakehouse but tries to fix

## Dimensional Modeling aka Star Schema


Kimball introduced dimensional modeling in the mid-1990s, often using Oracle.
He focused on star and snowflake schemas for quick queries.
In the early 1990s, Inmon championed a normalized, 3NF data warehouse with Teradata for consistent enterprise-wide data.
Around the early 2000s, Linstedt developed Data Vault 1.0 on SQL Server.
It combined hubs, links, and satellites for better scalability and auditability but relied on natural or surrogate keys. This caused performance and scalability issues.
Data Vault 2.0 introduced hash keys, strengthened standardization, and embraced agile methods and real-time processing.
These enhancements fix the rigidity, change isolation, maintainability, business concept clarity and performance problems of earlier styles.

## Data Vault

There is also the concept of Data Vault, which was published in 2000 by Dan Linstedt. Data Vault
modelling approach, similar to dimensional modeling. The key difference is that it focuses on
creating a *single version of the facts* and not a *single version of truth*. It allows you to see
the history or change of data, and does this my storing the record source and load timestamps.

To quote Linstedt:

>The Data Vault Model is a detail oriented, historical tracking and uniquely linked set of
>normalized tables that support one or more functional areas of business. It is a hybrid approach
>encompassing the best of breed between 3rd normal form (3NF) and star schema. The design is
>flexible, scalable, consistent and adaptable to the needs of the enterprise.

The medallion architecture is an implementation of the Data Vault modelling.

## Common data lake architecture

The common data lake architecture consists of three layers:

- Bronze or Landing layer
- Silver or Currated layer


The Bronze Layer captures raw data ingested from various sources in its original, unprocessed form.
It serves as the initial data collection point, capturing all available data, which can include
uncleaned, unstructured, and semi-structured formats. It may also host models and indices.

The Silver Layer bridges the source-system and business-oriented representation of data. In Data
Vault, it is subdivided in the Raw and the Business Data Vault. The Silver Layer serves the refined
dataset as well as indices and models, ready for use in business and analytics.

The Gold Layer represents the final stage where data, models and additional artifacts are presented
with focus on ease-of-use and performance/cost optimization. It serves as the foundation for all
data use in the company. Gold can be fully recalculated from silver and does not depend on other
layers.

The Carbon Layer contains model-generated data, or "model opinions." These results act as a new data
source processed through Bronze, Silver, and Gold layers. This distinction maintains Gold's curated
nature and recalculation ability while enabling high-performance model responses for users. Carbon
data modeling is up to the developer, following guidelines.



# Issues

**Note**, my clients are usually not the best when it comes to data. That's the reason they hire me.
Thus the


## Issue 1: Data moves too slow


## Issue 2: Slow moving organisations

Resulting in a new layer, some call it `carbon` or `platinum`


