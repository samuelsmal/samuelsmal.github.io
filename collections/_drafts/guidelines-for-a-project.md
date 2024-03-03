---
layout: post
title:  "Technical project principles"
date:   2022-12-01
tags:
  - software engineering
description: |
  Best practices to minize future pain-points in a software project.
field: Software Engineering
---

Software engineering is full of principles, best practices, guidelines and rules. Everyone has a lot
of opinions and wishes of what to do good or better, especially for the next project. This time it
will be different you tell yourself. This time we'll be using agile right, find a good sprint
duration that fits everyone, get business to give us all the requirements before we start
programming. I too live in this fantasy world. However I try to be *pragmatic*, I try to embrace the
chaos that is the real world. And for this I try to ~~force~~  persuade others to follow some
principles - my principles.

<div class="epigraph rule principle">
  <blockquote>
    <h4>The principle of least surprises</h4>
    <p>
      Follow your own guidelines and rules, minimise possible friction.
    </p>
  </blockquote>
</div>

The first principle is somewhat of a meta-principle. It applies to everything that follows. It tries
to prepare you for change and new requirements. It touches naming patterns of services, endpoints
and parameters, layout of code, how you write down issues, ... Basically everything. You want to
keep your mind free from unnecessary burdens. Let's say you have a simple CRUD application, a
database, a server and a frontend - nothing fancy. You have an object called `user`, it has an
unique identifier, called `id`. Now you have to ask yourself how you want to store this information
in the database. The canonical choices would be `clientId` or just `id`, however `ClientId` or
`client_id` could all be reasonable choices as well.

<div class="epigraph rule principle">
  <blockquote>
    <h4>Have project-wide naming convention</h4>
    <p>
      Create a naming convention that works for all parts of your system. Enforce it.
    </p>
  </blockquote>
</div>

Most complex systems are written in different technologies, SQL and some programming language. Most
likely there is some Java or C\#  somewhere, but some bash or Python is also not unheard off. If
you're serving some data you most likely have some sort of REST API that returns data in JSON
format. If you deploy your code in VMs or Kubernetes the images have names too as well as the
deployments. Names are everywhere. Most subsystems come with a good choice of a pattern - for them.
Python prefers `snake_case` for it's variables, C\# `PascalCase`, Java `lowerCamelCase`, JavaScript
`lowerCamelCase`, ... Again we're interested in the names that cross boundaries from one subsystem
to another, thus a reasonable assumption is that you will expose the data in some sort of
JSON-format. All programming languages can deal with this format, thus I advise to stick to the JSON
naming conventions, but since there a couple there as well, of `lowerCamelCase`.

Sometimes you don't have any control of how the ingress or input data is provided, in that scenario
a raw or landing table / topic that provides the data in the original format and one that has
transformed the names to the project-wide is a reasonable choice. Some might argue that this
data-duplication is not necessary, however it will free up your mind to focus on the content of the
data and not the format. Since you will - hopefully - apply some schema-validation you would want to
have such a system in place anyway.

Following a project-wide naming convention reduces the amount you have to think to define a name,
create a more.

When it comes to variables that are to be shared and joined, e.g. some data from a JSON-API, labels
of (Prometheus) metrics or fields in a database I advise to prefix the variables. This allows you to
reduce possible naming collisions. Basically giving a `namespace`. Thus prefer `clientId` to `id`.

<div class="epigraph rule principle">
  <blockquote>
    <h4>Create a system that is easy to hand-over</h4>
    <p>
    </p>
  </blockquote>
</div>

<div class="epigraph rule principle">
  <blockquote>
    <h4>Have a good hygiene around structuring and naming conventions</h4>
    <p>
    </p>
  </blockquote>
</div>

https://rogovoy.me/blog/no-architecture

When you first learn the "best coding practices", somehow you assume that there is a clear line
between good and bad architecture. You read or hear horror stories about unmaintainable projects
with too much rotten spaghetti code. Inevitably, you end up working on one.

Going fast or far.

Mostly you want to go fast, at one point you run out of money. The cost of writing a good
architecture, following guidelines, coming up with good names doesn't come for free. It costs time
and brainpower. If you don't enforce it you will have to align with others on how to do it.
Time is of the essence.

Parento Principle, [Rule of three](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)) and [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

Try to keep the mental barriers and abstractions to a minimum. If your program consists of a single
file it will probably be easier to refactor and to implement new features. Which is exactly what you
want at the beginning of a project. When you progress there is a sweet spot where you want to
introduce multiple files.
