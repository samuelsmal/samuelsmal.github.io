---
layout: post
title:  "The Convergence of Data Platforms"
date:   "2025-08-14"
tags:
  - engineering
  - data platforms
  - prediction
---

# Introduction

This post is part history, part observation and part speculation. In short: I claim, that the
current split between operational and analytical data platforms or systems will be over soon and
that current analytical data platforms will be able to handle both use cases.

This convergence of operational and analytical data systems would represent the most significant
shift in enterprise data architecture since the 1990s separation into specialized OLTP and OLAP
systems.  Modern infrastructure advances have eliminated the technical barriers that necessitated
this split, enabling unified platforms that handle real-time operations and complex analytics.

I am not the first person to make this claim, in fact [Timo Elliot made the same observation in
2013][1]. 13 years ago! Given the fact that this has not yet hit mainstream, one could argue that
the claim has been proven to be false. However, some recent technological advances made it possible
to offer this service to a wider audience. It is no longer necessary to be Netflix or Alibaba,
smaller companies can do it as well.

# Data Platform Evolution: From Unified to Separated to Unified Again
## The Unified Era: Single Machines Handled Everything (1960s-1990s)

The first data platforms were single-machine databases that effectively served both
operational and analytical needs for three decades. IBM's IMS system, developed for NASA's Apollo
program in 1966, simultaneously processed high-volume ATM transactions and complex inventory
analytics for the same organizations.<sup>[2]</sup> Banks like First National Bank in Dallas used
IMS to "pull data from across departments to get a complete picture of customers" while processing
daily operational transactions.

System R, IBM's groundbreaking relational database prototype (1974-1979), was explicitly designed
for both "canned transactions" and "ad-hoc queries" in a single system.<sup>[3]</sup> The
architecture documentation shows intentional dual-purpose design supporting both operational
efficiency and analytical flexibility.<sup>[4]</sup> Commercial systems following this
pattern—Oracle (1979), DB2 (1982), and early INGRES implementations—successfully handled mixed
workloads throughout the 1980s. <sup>[5]</sup>

Airlines using SABRE, manufacturers implementing IMS, and banks deploying early relational systems
all demonstrated successful single-platform operations. These systems provided real-time transaction
processing alongside cross-departmental reporting, inventory analysis, and customer relationship
management. The separation occurred not because early systems couldn't handle both workloads, but
because scaling challenges and evolving business requirements made specialized systems more
attractive.

## The Great Split: Performance Demands Force Separation (1990s-2010s)

The second and third parts of your hypothesis accurately describe the technical and business forces
that drove the OLTP/OLAP separation.<sup>[6]</sup> 

As mentioned above, the new business requirements couldn't be met with existing single-platforms
systems. Thus the split into OLAP and OLTP systems. OLTP systems required sub-millisecond response
times with normalized schemas optimized for concurrent writes, while OLAP systems needed
denormalized star schemas optimized for scanning millions of rows.<sup>[7]</sup>

Ralph Kimball's dimensional modeling revolution (1996) and Bill Inmon's enterprise data warehouse
methodology (1992) formalized this separation.<sup>[8]</sup> Kimball's bottom-up approach with star
schemas made analytics accessible to business users but required completely different data
structures than operational systems. Inmon's top-down methodology emphasized enterprise integration
but created even more complex ETL processes.<sup>[9]</sup>

The data warehousing industry exploded with specialized vendors: Teradata built the first terabyte
system for Walmart (1992)<sup>[10]</sup>, Red Brick pioneered star schema architectures, and OLAP
cube technologies from Microsoft, IBM Cognos, and Oracle Hyperion created dedicated analytical
environments.<sup>[11]</sup> By the 2000s, organizations routinely operated separate operational and
analytical systems with complex nightly ETL processes bridging them.

Data lakes initially promised integration but actually widened the gap. Hadoop's MapReduce framework
was designed for batch processing with high latency—exactly opposite of operational
requirements.<sup>[12]</sup> Early data lakes suffered from governance challenges ("data swamps"),
quality issues, and storage/pipeline performance that made real-time operational use
impossible.<sup>[13]</sup> Organizations ended up with even more specialized systems: operational
databases, data warehouses, data marts, and data lakes, each requiring separate tools and expertise.

## Modern Convergence: Infrastructure Advances Enable Reunification

With the emergence of faster storage, faster and cheaper compute and faster networking, Fortune 500
companies have tried to converge the two systems back into one. The original technical barrier has
been overcome that forced the separation.

Storage performance increased 25x with NVMe SSDs achieving single-digit millisecond
latencies<sup>[14]</sup>, while AWS S3 Express One Zone delivers 10x performance improvement with 2
million requests per second.<sup>[15]</sup> Network speeds jumped from 10G to 400G+ Ethernet with
sub-microsecond latencies<sup>[16]</sup>, and compute capabilities exploded with 100+ core CPUs and
specialized GPU acceleration.<sup>[17]</sup>

Now you can buy products that allow you the usage of them without deep technical knowledge.
Databricks Delta Lake architecture exemplifies the convergence, providing ACID transactions on data
lakes while supporting both real-time streaming and analytical workloads through a unified
API.<sup>[18]</sup> Microsoft Fabric integrates data engineering, analytics, and visualization in a
single platform<sup>[19]</sup>, with customers like Ferguson reporting "significantly reduced
delivery time by eliminating overhead of multiple disparate services".<sup>[2]</sup>

Apache technologies demonstrate technical maturity: Flink 2.0 achieves 75-120% throughput
improvements for stateful queries<sup>[20]</sup>, Apache Paimon enables real-time updates in data
lakes with minute-level query latency<sup>[21]</sup>, and Apache Iceberg provides format
interoperability across multiple engines.<sup>[22]</sup> These aren't experimental projects—they're
production systems handling petabyte-scale workloads.

Depending on the origin there exist multiple different names and approaches. Ververica and Alibaba
with Apache Flink call it Streaming Lakehouse or
[Streamhouse](https://www.ververica.com/streamhouse), Databricks uses [Delta
Lake](https://delta.io/) (which is actually an open-source term and part of the Linux Foundation
Projects), to reflect this change. While Flink, coming from real-time processing moves to capture
the batch world, Spark move in the opposite direction. Both is needed to handle the load and
business requirements.

So far, I have not seen a traditional, operational system moving successfully into the analytical
world. The technical challenges would be to difficult to overcome without a complex rewrite.

## Current Implementations Prove Convergence Works at Scale

Real-world evidence shows successful operational-analytical unification across industries. Columbia
Sportswear achieved self-service analytics capabilities that were "not possible before," while Bayer
transitioned from batch analytics to real-time integration of ERP, CRM, and IoT data. Netflix
processes 2 million events per second on the same infrastructure that handles both content delivery
operations and viewing analytics.<sup>[23]</sup>

Financial services lead convergence adoption with real-time fraud detection systems processing
transactions as they occur.<sup>[24]</sup> E-commerce implementations show dramatic results—NA-KD
fashion achieved 25% increase in customer lifetime value with 72x ROI through real-time
personalization.<sup>[3]</sup>

Manufacturing demonstrates IoT-driven convergence with predictive maintenance systems achieving
70-75% reduction in machine downtime industry-wide <sup>[25]</sup>. Tinsley Bridge steel manufacturing
transformed from manual inspections to 24/7 remote monitoring through unified operational-analytical
platforms that process sensor data in real-time while maintaining historical analytics capabilities.

## Technical Drivers Eliminate Historical Barriers

The convergence succeeds because modern infrastructure removes every constraint that forced the
original separation. Storage latency—the primary historical bottleneck—is eliminated through NVMe
performance and cloud object storage achieving millisecond access times.<sup>[14][15]</sup> Memory
costs plummeted while capacity increased, enabling in-memory processing of analytical workloads
without impacting operational performance.

Networking advances eliminate data movement penalties that previously made "compute to data"
architectures necessary.<sup>[16]</sup> High-speed interconnects with RDMA capabilities achieve 99%
bandwidth efficiency, while software-defined networking enables dynamic optimization of data flows
between operational and analytical processes.

Compute improvements enable real-time analytics that were previously computationally
impossible.<sup>[17]</sup> GPU computing delivers 26 teraFLOPS performance with 2+ TB/s memory
bandwidth, making complex analytical algorithms feasible in operational timeframes. Containerization
and Kubernetes allow mixed workload scheduling on shared infrastructure with 20-40% cost reductions
through improved resource utilization.

## Business Drivers Accelerate Unified Adoption

Organizations pursue convergence for compelling economic reasons beyond technical
capability.<sup>[26]</sup> Microsoft Fabric implementations show 379% ROI with payback periods under
six months, while unified platforms eliminate expensive data replication and reduce maintenance
costs by up to 25%. Data engineering complexity decreases dramatically when single platforms handle
multiple workload types without complex ETL processes.<sup>[27]</sup>

Real-time decision making provides competitive advantage across industries.<sup>[28]</sup> Business users
access data immediately upon update without replication delays, while event-driven architectures
capture, analyze, and act on data when events occur rather than on batch schedules. This enables
instant personalization in e-commerce, real-time fraud prevention in financial services, and
predictive maintenance in manufacturing.

Regulatory and compliance drivers also favor convergence. Financial services require real-time risk
analytics, healthcare demands continuous patient monitoring, and manufacturing needs 24/7 safety
monitoring. Unified platforms provide centralized governance with consistent security and compliance
controls, reducing regulatory risk while improving audit capabilities.<sup>[29]</sup>

## Future Trajectory Points to Complete Convergence

The evidence suggests we're in the early stages of a fundamental architectural shift back to unified
systems, but at massive scale with capabilities unimaginable in the original single-machine era.
Cloud-native platforms, edge computing integration, and advancing AI/ML capabilities will further
accelerate convergence by making real-time intelligence universally accessible.<sup>[30]</sup>

The historical cycle completes with significant advancement: The 1960s-1990s had unified systems
limited by hardware constraints, the 1990s-2010s achieved scale through separation and
specialization, and the 2020s+ enable unified systems without performance compromises through
infrastructure advances. Organizations can now achieve the simplicity of single systems with the
performance of specialized architectures.

# Conclusion

The 50-year journey from unified to separated to unified-again systems reflects both
technological constraints and advancing capabilities. The current convergence isn't just technically
feasible—it's economically compelling and operationally superior to traditional separated
architectures.<sup>[31]</sup>

The convergence represents genuine progress, not regression to earlier limitations. Modern unified
systems deliver real-time operational performance with sophisticated analytical capabilities,
eliminating the data staleness, complexity overhead, and integration challenges that plagued
separated architectures. Organizations implementing these unified platforms report transformative
business results that extend far beyond technical improvements to fundamental competitive advantages
in data-driven markets.<sup>[32]</sup>

[1]: https://timoelliott.com/blog/2013/01/the-convergence-of-analytic-and-operational-processing-is-a-big-deal.html
[2]: https://www.ibm.com/history/information-management-system
[3]: https://www.microsoft.com/en-us/microsoft-fabric/blog/2024/05/21/unlock-real-time-insights-with-ai-powered-analytics-in-microsoft-fabric/
[4]: https://ieeexplore.ieee.org/document/5387088/
[5]: https://www.quickbase.com/articles/timeline-of-database-history
[6]: https://link.springer.com/chapter/10.1007/978-3-642-14559-9_11
[7]: https://aws.amazon.com/compare/the-difference-between-olap-and-oltp/
[8]: https://www.ssp.sh/brain/inmon-vs-kimball/
[9]: https://www.dataversity.net/a-short-history-of-data-warehousing/
[10]: https://en.wikipedia.org/wiki/Teradata
[11]: https://bluebird-ag.com/en/solutions/oracle-hyperion/hyperion-essbase
[12]: https://en.wikipedia.org/wiki/Apache_Hadoop
[13]: https://www.vastdata.com/blog/vast-for-big-data-applications
[14]: https://www.tomshardware.com/features/ssd-benchmarks-hierarchy
[15]: https://aws.amazon.com/s3/storage-classes/express-one-zone/
[16]: https://www.fs.com/blog/infiniband-vs-ethernet-a-comprehensive-guide-for-highperformance-computing-14082.html
[17]: https://www.digitalocean.com/community/tutorials/intro-to-cuda
[18]: https://www.databricks.com/blog/2018/07/19/simplify-streaming-stock-data-analysis-using-databricks-delta.html
[19]: https://azure.microsoft.com/en-us/blog/introducing-microsoft-fabric-data-analytics-for-the-era-of-ai/
[20]: https://flink.apache.org/2025/03/24/apache-flink-2.0.0-a-new-era-of-real-time-data-processing/
[21]: https://www.ververica.com/blog/apache-paimon-the-streaming-lakehouse
[22]: https://www.datacamp.com/tutorial/apache-iceberg
[23]: https://imply.io/blog/real-time-analytics-building-blocks-and-architecture/
[24]: https://seon.io/
[25]: https://medium.com/@mohamedhameezali/iot-based-predictive-maintenance-in-manufacturing-sector-a-case-study-a6baefdfa243
[26]: https://ardem.com/bpo/cost-savings-of-business-process-automation-in-2025/
[27]: https://www.emergentsoftware.net/blog/microsoft-fabric-a-comprehensive-guide-to-microsofts-unified-data-analytics-platform/
[28]: https://www.qlik.com/us/data-analytics/real-time-analytics
[29]: https://www.ibm.com/blogs/nordic-msp/the-convergence-of-operational-and-analytical-data/
[30]: https://risingwave.com/blog/snowflake-vs-redshift-2024-guide-choose-wisely/
[31]: https://www.streambased.io/blog-posts/operational-and-analytical-data-system-convergence-the-coming-revolution-that-already-happened
[32]: https://mattaslett.ventanaresearch.com/data-platforms-landscape-divided-between-analytic-and-operational
