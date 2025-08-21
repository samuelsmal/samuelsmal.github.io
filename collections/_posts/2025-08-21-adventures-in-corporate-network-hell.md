---
layout: post
title:  "Adventures in Corporate Network Hell"
date:   "2025-08-21"
tags:
  - consulting
  - software architecture
  - system architecuture
---

A reality in consulting is *faking it, until you make it*. Clients always want to work with people
that have done exactly the same thing for a different client.  This makes sense - consultants are
expensive and paid by the hour, or at least I am.  Often times, however, the consultants need to
slightly oversell. Which, in general, is not a big deal. Clients know that their setup is usually
unique or unique enough to require at least a small amount of adaption and learning on the job.
Luckily, in the end, both parties learn something. The client has a new, shiny tool and the
consultant can advertise the new expertise. The same applies to these stories.

# Exhibit A

Early this year, a client asked me to design a fully air-gapped Databricks cluster, which would be
deployed on Microsoft Azure. So far, nothing too crazy. Usually this request is made by a manager who
doesn't fully understand the term *air-gapped*, and after some discussions with their security and
networking team, one can find a decent middle-ground. And the same applied also to this client. With
one small difference, it was at that time almost feasible - at least by technical standards - to
achieve it, to fully lock down their traffic. No public IP, no public traffic,
even to their local offices. They even used the prohibitively expensive method of an [Azure
ExpressRoute](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction) to
route traffic from their old, on-premise to their new cloud data centres. An Azure ExpressRoute, for
those who don't know, is a service that relies on local ISPs to give you a direct connection to
Azure's backbone network. Again, extremely expensive. Wisely, they decided to route the traffic from
their many local offices to their cloud using a much cheaper VPN. But due to some old regulation or
their interpretation of it, they figured that such an ExpressRoute was necessary.

Since I am not a lawyer I can't say for sure if this is true or not, but given that Azure and
ExpressRoutes are probably a more recent invention - at least compared to the existing law - I have
my doubts.

# Exhibit B

This smaller job spawned two more, in true consulting fashion I have become the expert in my company
in such matters. A different client wanted some support in getting an Azure Kubernetes based Helm
chart deployment on track. When I started, they were still debating which technology to use. We
sat down, looked at the features they wanted to have, the existing skills their people had and the
proposed timeline. They wanted all the features, had basically zero skills and wanted it done
tomorrow. Of course, I said that this sounds excellent! I am a consultant, so please forgive me.

During the initial scoping sessions, I asked, how difficult their networking setup was. My mistake
was to believe the people at this meeting. Note that for this rather large client, this was the
first time, they would develop an internal tool. So far they used SaaS tools. This project would open
up a completely new world for them. They had software developers, but they worked so far either in
their public cloud or on-premise. This tool however would be in their very tightly controlled cloud.

Prior to the project, someone did a proof-of-concept. Using some Terraform, they created a Kubernetes
cluster and the used `helm install ...` to get it running. Took them roughly two days. For this test
they used their sandbox, which is basically a cloud that lacks any configuration, is completely open
to the internet, and thus not connected to any of their services. My second mistake was using this as
a baseline on the general complexity of the tool and how they operate.

Turns out, installing the tool in their locked down cloud infrastructure was more challenging than
expected. Not being allowed to target any public IP, which is not equal to sending the packages
unencrypted through the public internet, is not something that every tool supports these days.
Bringing some experience in this matter, we anticipated this and were generous in the estimate. The
third mistake was not asking a list of network restrictions.

Just getting the base tools, AKS, blob storage, and a VNet, to run took almost double my internal
estimate. How do you get OCI images into a cluster if you are not allowed to pull them? Well, you
pull them somewhere you are allowed to, and then push them! But what if there is no method to bridge
these two areas? After a lot of discussions, we finally found an acceptable way. Which was not by
building them ourselves, or using a company-wide registry of verified images, or scanning the images
during the pull. No, it was by using a bastion-like system. Took only a couple of days to get
working. Somehow the VM's IPs can't be added to the whitelist automatically, so every week or so the
CI/CD pipeline breaks, which easily adds a few hours. But what are hours in this world! Did I
mention that I bill by the hour? But since neither the networking team nor the people who I directly
work with pay the bill, they completely lack an understanding of what their system costs.

The true moneymaker however is the strong requirement of using only private IPs. Which is quite
tricky to get working. Somehow, the working assumption for most products these days is that at least
some connections can go to a public IP. Of course this IP sits behind a whitelist, IP-blockers,
strong protection all around. Going completely private in the cloud is just a completely new concept
for the hyperscalers - I know, wild. Finding solutions for this, which involved asking Azure to
enable some beta-features, breaking some other of their security constraints on the way, took ages.
At least a month. And it was awful. Progress was slow, or so it was perceived by the client.
Funnily, in the end their networking team learned a lot, so much that they now want to offer this
setup to more teams, but the people who hired me, don't want to make a big deal out of it. They are
more impressed by connecting a different system to the solution. Which by now is a configuration
away - a few hours of figuring out who to call and give us the permissions.

I thought was hired to support them with some Kubernetes and simple networking. Turns out, they
paid me to solve one of their unsolved mysteries and enable them to run OCI images and give their
whole company access to the web UI.

To reiterate, the initial proof-of-concept took two days. Getting it to run in their production
system took roughly two months. Of course, we added a lot of stuff to it, so I will subtract a
generous month for these features, which still leaves a full month just to comply with their network
requirements. A full month of time and material!

# Exhibit C

This last story of the third client is the weirdest to me. The company really needs this solution,
but nobody wants to put any effort in it. With really needing it I mean, they will not be able to
operate the facilities they are constructing in multiple countries if they do not follow through.
Nobody from their networking team even looks at my emails if I don't CC the CTO. Wild, very wild.

So far, we were able to develop our very data-heavy solution in a sandbox. They gave me an
introduction into their networking setup, which was summarised as "basically everything is open,
we just log it". And poor summer child that I am, believed them.

For context, we collect a lot of data, transform it locally, on-premise, then send it out to the
cloud for long-term analysis. Petabyte-scale. Subsecond end-to-end latency. It's a cool project.

After the initial proof-of-concept came the MVP and then beta version and now to whatever we
are naming it - for sure not the real thing, because someone might interpret this as a final and
complete product. The client is not accustomed to software engineering - as you might have guessed.
The technical requirements grew over time, and by now we can no longer just get a bigger VM. It
needs multiple, it needs higher reliability, it needs a Kubernetes cluster!

Have you ever tried to install a Kubernetes cluster in an air-gapped environment? Where again, you
can not pull images? Nor can you fetch the k3s installation script. Nor can they give you a list of
limitations that apply to the network of the bastion or jump host and the cluster VMs.

It is now month two. Granted, getting a Kubernetes cluster running is not a small feat, but the
amount of tools we have to write and maintain to support this setup is easily three quarters of this
work.

I don't understand how these companies operate like this. They seem mentally stuck on the idea that
these limitations are necessary and good - which I partly support. But why not build toolchains that
enable fast, secure delivery? Why is every new system connected to all their services by default?
Why can't I get a network that's locked down internally but allows trusted external traffic? Maybe
it's their ancient hub-and-spoke setup holding them back.

Let me know if you have answers. I'll be sending another bill while I work around their constraints.

