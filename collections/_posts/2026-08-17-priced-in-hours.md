---
layout: post
title:  "Priced in Hours"
date:   "2026-08-17"
tags:
  - enterprise architecture
  - buy vs build
  - self-hosting
  - agentic engineering
description: |
    Should you self-host or rent? The answer is a division: the monthly cost delta over an engineer's
    hourly rate is how much time you get to run it yourself — and agentic engineering just moved that line.
math: true
calculator: true
---

With the emergence of AI-driven software engineering the old question of buy vs build is changing,
and changing so fast that — I would argue — nobody knows where the tipping point is between the two
decisions. But there are already a lot of excellent posts out there that discuss this. While the
angle of software-as-a-service has been talked about many times, for example you want to have a CRM
and now you ask yourself whether you should build it yourself or rent a SaaS solution, the question
of self-hosting vs renting supporting parts of your stack has not.

While SaaS solutions are generally stock software solutions, and are interesting to talk about, they
clearly do not fall into the core business. They are supportive in nature, they help to keep track
of tasks, issues, relationships or help with billing. But what if the company has such specific
needs that some part of the pipeline requires custom code? Of course that code can run in a SaaS
solution, but often you need some glue between the different regions of business, be it external or
internal.

Imagine you have a fairly complex piece of software. There is a core aspect to it, it's the heart of
the solution, this is where you store and apply your business logic, this is where you make your
money. But there is also data, which you store in a database of sorts, there might even be a
fast-moving transport layer or message queue. Then there is the access layer to said data and
transformations. These reside in some sort of API management layer. Only the core part is
business-critical, the rest can be exchanged for other solutions. For example, self-hosting Apache
Kafka, Azure Event Hubs, Google Cloud Pub/Sub, ... are functionally all the same. They have
different limitations but they all solve the message queue problem, which is one part of your stack.

In the past, being sensible, one would probably decide to use existing, off-the-shelf solutions that
come with your current cloud provider. If you're on Azure you go with Azure Event Hubs and vice
versa for AWS or GCP. These solutions are maintained and well tested, but they are also not cheap.
Deploying an open-source stack was not trivial in the past, you needed a lot of experienced
engineers to pull it off. I would argue, that this has changed in many ways. We now can deploy
containerised solutions in a standardised way (Kubernetes), and many open-source solutions offer
Helm charts or pure Kubernetes manifests to deploy them. Gone are the days when you had to figure
out how to deploy the stack on a VM, align the different JVM versions, manage memory, ... In
addition to that, with the emergence of agentic engineering it is now easier than ever before to
host your own stack.

Back to the example: given that the core can hopefully be deployed in a container-like environment
the question of where to run it has been dominated by the complexity and thus cost of operations.
While running it in Azure Containers or Azure Functions is easy, it is not cheap. Running it on an
Azure Kubernetes cluster is very, very cheap but is very, very costly in operations. The support of
keeping it running goes away. You now have to know Kubernetes and then Azure Kubernetes as well.

# Back-of-the-envelope justification

For some more hard-fact data-driven justification of my gut feeling, let's do a comparison. For
that, let's assume that you run your stack on Azure, and that you are in need of a message queue.
The throughput is fairly stable and is roughly $$4 \unit{TB} / \unit{month}$$. The single region the
stack is deployed in is West Europe.

First, let's list some assumptions and constraints: There is no need for geo-redundancy. We're
not looking at anything above [three 9s](https://en.wikipedia.org/wiki/High_availability) as the
business can survive with some unexpected downtime. The user-base is also fairly local, only a few
users across the globe. A European insurance company, or non-trading bank, for example. 
The whole solution could be a data platform that supports real-time, possibly automatic, strategic
and data-driven decision-making, but not in the millisecond range.
I would argue that this fits most companies. Clearly you lose or don't gain money during
downtime, but the business does not come to a halt.<label for="sn-business" class="margin-toggle
sidenote-number"></label><input type="checkbox" id="sn-business" class="margin-toggle"/><span
class="sidenote">If that were the case, and you would need anything above three 9s, then I would
argue you are anyway looking at more complex setups where just the cost of not owning the update
and release cycle will burn you. Or you are such a high-level client that you can negotiate with
the vendor a different behaviour.</span>

Given that there are two options: using Event Hubs or self-hosting Apache Kafka. Let's be somewhat
conservative and say that your options for self-hosting are running the system on Azure's Kubernetes
Service and not something cheaper such as Hetzner<label for="sn-hetzner" class="margin-toggle
sidenote-number"></label><input type="checkbox" id="sn-hetzner" class="margin-toggle"/><span
class="sidenote">Hetzner is also less of a bargain than it used to be. Two price rounds in 2026 —
around 30% in April, then another 113–173% on the dedicated-vCPU CCX line on 15 June, put a
comparable cluster (3 × CCX43 for the brokers, 3 × CCX23 for controllers, ~3 TB of volumes) at
roughly €1.3k/month against the €1.7k above. That remaining \~€5k/year buys less than it sounds: no
managed control plane, no availability zones (Falkenstein, Nuremberg and Helsinki are separate
locations, and the ~20 ms to Helsinki hurts `acks=all`), and no hyperscaler-style SLA (whatever that
buys you). And if your
core stays on Azure, traffic between it and the queue now leaves the cloud — the Azure egress that
was free within the region eats most of the saving.</span> due to other company-wide constraints. You
could also run a different type of message queue, but that is beside the point.

Comparing Event Hubs and Kafka w.r.t. their runtime needs is not trivial, but let's imagine for now
— using fairly conservative numbers favouring Event Hubs — that you would need four Processing Units
and 1 TB extended retention. Kafka would need the standard replication factor of three. The extended
retention would be captured using the additional disks.


Every count and unit price below is yours to change — the line items, both totals, the difference and
the break-even further down all follow. Monthly figures assume a
<input class="calc-in" size="3" type="number" data-calc-name="hours_month" value="730" min="1" step="1" inputmode="numeric" aria-label="Hours in a month">
hour month.

<div class="table-wrapper">
<table class="fullwidth">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col" class="num">€/month</th>
      <th scope="col" class="num">€/year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="3">Event Hubs Premium</th>
    </tr>
    <tr>
      <td>
        <input class="calc-in" size="2" type="number" data-calc-name="eh_pu" value="4" min="1" step="1" inputmode="numeric" aria-label="Processing Units">
        Processing Units @ €<input class="calc-in" type="number" data-calc-name="eh_pu_price" value="1.174" min="0" step="0.001" inputmode="decimal" aria-label="Euro per Processing Unit hour">/h,
        <input class="calc-in" size="4" type="number" data-calc-name="eh_gb" value="1000" min="0" step="100" inputmode="numeric" aria-label="Extended retention, GB">
        GB extended retention @ €<input class="calc-in" type="number" data-calc-name="eh_gb_price" value="0.114" min="0" step="0.001" inputmode="decimal" aria-label="Euro per GB month of extended retention">/GB
      </td>
      <td class="num calc-out" data-calc-name="eh_month" data-calc-group="eh"
          data-calc="eh_pu * eh_pu_price * hours_month + eh_gb * eh_gb_price"
          data-calc-format="money">3,542.08</td>
      <td class="num calc-out" data-calc="eh_month * 12" data-calc-format="money">42,504.96</td>
    </tr>
    <tr class="subtotal">
      <th scope="row">Total</th>
      <td class="num calc-out" data-calc-name="eh_total" data-calc="sum(eh)" data-calc-format="money">3,542.08</td>
      <td class="num calc-out" data-calc="eh_total * 12" data-calc-format="money">42,504.96</td>
    </tr>
  </tbody>
  <tbody>
    <tr>
      <th scope="rowgroup" colspan="3">Kafka on AKS</th>
    </tr>
    <tr>
      <td>
        <input class="calc-in" size="2" type="number" data-calc-name="k_brokers" value="3" min="1" step="1" inputmode="numeric" aria-label="Broker count">
        × E8as_v5 brokers (8 vCPU, 64 GiB) @ €<input class="calc-in" type="number" data-calc-name="k_broker_price" value="0.481" min="0" step="0.001" inputmode="decimal" aria-label="Euro per broker hour">/h
      </td>
      <td class="num calc-out" data-calc-group="kafka"
          data-calc="k_brokers * k_broker_price * hours_month"
          data-calc-format="money">1,053.39</td>
      <td class="num calc-out" data-calc="k_brokers * k_broker_price * hours_month * 12"
          data-calc-format="money">12,640.68</td>
    </tr>
    <tr>
      <td>
        <input class="calc-in" size="2" type="number" data-calc-name="k_ctls" value="3" min="1" step="1" inputmode="numeric" aria-label="Controller count">
        × D4as_v5 controllers + system pool @ €<input class="calc-in" type="number" data-calc-name="k_ctl_price" value="0.183" min="0" step="0.001" inputmode="decimal" aria-label="Euro per controller hour">/h
      </td>
      <td class="num calc-out" data-calc-group="kafka"
          data-calc="k_ctls * k_ctl_price * hours_month"
          data-calc-format="money">400.77</td>
      <td class="num calc-out" data-calc="k_ctls * k_ctl_price * hours_month * 12"
          data-calc-format="money">4,809.24</td>
    </tr>
    <tr>
      <td>
        <input class="calc-in" size="2" type="number" data-calc-name="k_disks" value="12" min="1" step="1" inputmode="numeric" aria-label="Managed disk count">
        × E15 managed disks (256 GiB) @ €<input class="calc-in" type="number" data-calc-name="k_disk_price" value="16.87" min="0" step="0.01" inputmode="decimal" aria-label="Euro per disk month">/month —
        <span class="calc-out" data-calc="k_disks * 256 / 1024" data-calc-decimals="1">3.0</span> TiB raw,
        ~<span class="calc-out" data-calc="k_disks * 256 / 1024 / 3" data-calc-decimals="1">1.0</span> TiB usable at RF=3
      </td>
      <td class="num calc-out" data-calc-group="kafka"
          data-calc="k_disks * k_disk_price" data-calc-format="money">202.44</td>
      <td class="num calc-out" data-calc="k_disks * k_disk_price * 12"
          data-calc-format="money">2,429.28</td>
    </tr>
    <tr>
      <td>
        AKS Standard tier, cluster management, 1 cluster @ €<input class="calc-in" type="number" data-calc-name="k_aks_price" value="0.0879" min="0" step="0.0001" inputmode="decimal" aria-label="Euro per cluster hour">/h
      </td>
      <td class="num calc-out" data-calc-group="kafka"
          data-calc="k_aks_price * hours_month" data-calc-format="money">64.17</td>
      <td class="num calc-out" data-calc="k_aks_price * hours_month * 12"
          data-calc-format="money">770.00</td>
    </tr>
    <tr class="subtotal">
      <th scope="row">Total</th>
      <td class="num calc-out" data-calc-name="k_total" data-calc="sum(kafka)" data-calc-format="money">1,720.77</td>
      <td class="num calc-out" data-calc="k_total * 12" data-calc-format="money">20,649.20</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Difference</th>
      <td class="num calc-out" data-calc-name="diff" data-calc="eh_total - k_total" data-calc-format="money">1,821.31</td>
      <td class="num calc-out" data-calc="diff * 12" data-calc-format="money">21,855.76</td>
    </tr>
  </tfoot>
</table>
</div><label for="sn-table_comments" class="margin-toggle sidenote-number"></label>
<input type="checkbox"
id="sn-table_comments" class="margin-toggle"/><span class="sidenote">Note, egress is excluded because it lands on both variants equally: $$(4 \unit{TB} − 100
\unit{GB}_\text{free}) \cdot 0.087 \unit{USD}/\unit{GB} ≈ 339 \unit{USD}/\unit{month}$$ either way. 
<br>I also did not include any reservations or savings plans, the reduction would apply to both
scenarios anyway.
<br>The numbers reflect my research in August 2026. Fill in more recent
numbers if you want, the numbers will refresh.</span>
<label for="sn-resources" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-resources" class="margin-toggle"/><span class="sidenote">The numbers
are really back-of-the-envelope. I used [strimzi](https://strimzi.io/) to compare the loads. It
might not reflect your situation and load, too many factors to easily compare.</span>
<label for="sn-replication_factor" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-replication_factor" class="margin-toggle"/><span class="sidenote">
A replication factor of 3 means every produced byte crosses zones twice. Azure stopped charging for
cross-AZ transfer on 21 May 2024; AWS and GCP still charge \$0.01/GB each way. On AWS that
replication traffic alone would move this comparison. ([DCD](https://www.datacenterdynamics.com/en/news/microsoft-removes-egress-fees-for-moving-data-between-availability-zones-in-same-azure-cloud-region/),
  [Azure bandwidth pricing](https://azure.microsoft.com/en-us/pricing/details/bandwidth/))
  </span>
<label for="sn-standard_over_automatic" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-standard_over_automatic" class="margin-toggle"/><span class="sidenote">
Choosing AKS Standard over Automatic saves €38/month and moves node-pool upgrades onto you. €38 is 0.4 hours. Same trade as the whole post, at 1/50th scale.</span>

As you can see above, you would be saving roughly €<span class="calc-out" data-calc="diff" data-calc-format="compact">1.8k</span>
per month. To put that into additional perspective: imagine you have an engineer with a yearly salary of
€<input class="calc-in" size="7" type="number" data-calc-name="salary" value="150000" min="0" step="1000" inputmode="numeric" aria-label="Yearly salary, euro">,
and that they work <span class="calc-formula">
  <input class="calc-in" size="2" type="number" data-calc-name="hours_week" value="40" min="1" step="1" inputmode="numeric" aria-label="Hours per week"><span class="unit">h/week</span>
  <span class="op">×</span>
  (<input class="calc-in" size="2" type="number" data-calc-name="weeks" value="52" min="1" step="1" inputmode="numeric" aria-label="Weeks per year">
  <span class="op">−</span>
  <input class="calc-in" size="2" type="number" data-calc-name="holiday_weeks" value="5" min="0" step="1" inputmode="numeric" aria-label="Weeks of holiday"><sub>holidays</sub>)<span class="unit">weeks</span>
  <span class="op">×</span>
  <input class="calc-in" size="4" type="number" data-calc-name="productive" value="0.8" min="0" max="1" step="0.05" inputmode="decimal" aria-label="Productive hour factor"><sub>productive</sub>
  <span class="op">=</span>
  <span class="nowrap"><span class="calc-out" data-calc-name="prod_hours" data-calc="hours_week * (weeks - holiday_weeks) * productive">1,504</span><span class="unit">h</span></span>
</span> resulting in an hourly cost of roughly €<span class="calc-out" data-calc-name="rate" data-calc="salary / prod_hours" data-calc-format="money">99.73</span>/h.

Given the savings we can now invest <span class="calc-formula">
  €<span class="calc-out" data-calc="diff" data-calc-format="compact">1.8k</span>
  <span class="op">/</span>
  (€<span class="calc-out" data-calc="rate" data-calc-format="money">99.73</span><span class="unit">/h</span>)
  <span class="op">=</span>
  <span class="nowrap"><span class="calc-out" data-calc="diff / rate" data-calc-decimals="1">18.3</span><span class="unit">h</span></span>
</span> every month. If the amortised effort after the build-up phase is below that, we're good with
operating our own Kafka cluster. Anything above that and we're wasting both money and time.

Of course that depends on the salary and available capacity of the engineer and team. One major
benefit that we have since agentic engineering exists is having more time available to us. Debugging
infrastructure is a time-consuming task, especially in Kubernetes. You need to deploy debugging pods
into the cluster, read documentation, maybe patch something, try out different solutions, ... these
are all problems that agentic engineering excels at.

While in the past those <span class="nowrap"><span class="calc-out" data-calc="diff / rate"
data-calc-decimals="1">18.3</span><span class="unit">h</span></span> might not have looked to be
enough, they are clearly enough now. Because now we get to have many, many more hours in a single
hour to debug, test and develop.

# Anecdotal justification

Right now I am managing an on-premise [k3s](https://k3s.io/) cluster deployed on top of VMware
machines. There we don't even get the luxury of having a managed Kubernetes cluster. But after the
initial setup time — which was quite substantial, mostly due to unknown networking constraints and
weird VMware behaviour — the setup now runs very stably and I would estimate that we spend roughly
**4 hours every month on maintaining, updating and debugging the core infrastructure**. That
includes the k3s cluster as well as our Kafka cluster and other parts of the system. It includes the
amortised cost of the build-up. That is even less than the calculated <span class="nowrap"><span
class="calc-out" data-calc="diff / rate" data-calc-decimals="1">18.3</span><span
class="unit">h</span></span>. Of course, we are capable engineers, but not experts in running Kafka,
we just follow the outlined best practices, test the system thoroughly and debug issues.
That system is now high-performing, highly available and runs on existing hardware. So far the only
outages we had were outside of our control and our observability stack reported them as such.
There are many factors that led to the success we had on this project, but I can easily defend that
under the right circumstances you can achieve a 10x productivity gain by using agentic engineering.

# Discussion

The counter-argument, that you now need specialists in Kubernetes to run your system as well
as deeper Kafka knowledge is of course true. Both of which one can also build up over time. The
managed part is not free either. Event Hubs has certain behaviours that one still has to learn, and
that are not fully documented. At least with open-source technology you can transfer the knowledge
more clearly, and also find people easier that can support you. In addition to the non-trivial
benefit of being able to add the functionality that you want — it's no longer a discussion with your
vendor and about potential increased license costs, it's just a question of priorities.

The risk of not being in control of any releases is hard to quantify as well. In the past I've been
burned by being subjected to Azure's unannounced releases. The question you need to ask yourself is
which is riskier: the vendor's tool, its lifecycle and outages and licence costs, or the
operating cost.

Running technology on your AKS cluster comes with compounding benefits. If you run more on the same
cluster the marginal cost decreases as the cost for the system pool and the cluster fee can be
shared. You can then also exploit non-linear consumption better. It is unlikely that your system
will produce a constant stream of data, by having tight control over the compute one can heavily
optimise the system and exploit the idle VM time to push overall costs further down.

But what you clearly lose is the ability to make this someone else's problem. In addition to owning
the core logic you will now also need to think more — but not by an order of magnitude — about the
supportive parts of your stack.

By embracing agentic engineering we can also circumvent the invented-by-a-single-person problem.
Everything is stored in a declarative fashion. No GUI-clicks or random scripts or YAML files edited
by a person who is no longer part of the team. A sane agentic engineering workflow will also
document not just the current state but also the decisions.

## Operating Cost

If you run your own stack, you will need to schedule downtime, and be flexible enough for 
unforeseen downtime. You will need to invest in debugging and observability tools, and you might
need to invest more if you self-host. But if the justification for a limited budget is that you use
a managed service you will experience some really, really bad days. In my experience an SLA does not
protect you from outages, nor can the support help you with debugging why you can no longer work
with their tools.
Thus, the question should be how much downtime your company can absorb. Being "highly available" in
a single cluster is cheap; doing it across multiple zones or regions comes with higher costs in
cloud compute, observability, complexity, and of course personnel. That is regardless of whether you
self-host or not. Relying on the provider and on the infrastructure for high availability is a
recipe for disaster — or a risk you are willing to accept.

## Other factors

Any system that is critical to the business will need an *observability stack*, but this applies to
both options. And if you're on Kubernetes and are following the [cloud
native](https://github.com/cncf/toc/blob/main/DEFINITION.md) way going for the classic
Prometheus/Grafana stack for metrics is cheap compared to Log Analytics.

As mentioned above, if the open-source solution lacks functionality, such as Entra ID, one can
easily add this at the appropriate layer.

# Conclusion

As much as I would like to call for a migration to self-hosted open-source solutions, the reality is
that it is not that simple. Written code will have to be adapted and tested, configurations will
need to change for sure to accept nominally equivalent sources and sinks. But with the emergence of
agentic engineering the costs, especially the price-per-hour of completed work, have gone down to
such an effect that self-hosting should be on the menu.

The <span class="nowrap"><span class="calc-out" data-calc="diff / rate"
data-calc-decimals="1">18.3</span><span class="unit">h</span></span> that came out above is not a
constant. It does — somewhat — reflect the circumstances or constraints under which I am working,
the team, the location, the business. Your situation will likely be different, but as long as
operating it yourself is less then the pure runtime cost delta between the options it is the better
choice. For us it did, with room to spare — 4 hours against 18.3.

So I am not asking you to migrate anything. I am asking you to run that division the next time a
contract comes up for renewal, or the next time you add a component to your stack — and to put the
build-up and the training inside the comparison rather than waving them off as a one-time cost.

Which brings me back to the question I left open above. The vendor's tool, its lifecycle and outages
and licence costs, or the operating cost — which is riskier? I would argue the vendor's, because it
is the one you do not see coming. Prices move on both sides: Hetzner, the cheap option, repriced its
dedicated line by more than 100% in a single step this June, and I have been burned by Azure
releases I never asked for (or not at that time). What self-hosting buys you is not necessarily a
lower cloud bill, it is the ability to answer a price rise or an unannounced change with a migration
you can actually execute, on your own schedule. That is the control worth paying for.
