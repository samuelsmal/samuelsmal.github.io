---
layout: post
title: Why to use version control
date: 2022-11-18
tags:
  - software engineering
  - dev-ops
  - letters to a younger me
field: Software Engineering
---

Software related people usually don't need much persuasion why they should use a version control
system, be it git, mercurial or something else. I'll stick to using git terms in this post. When
asked for any reasons, a few pop up quickly: in order to work collaboratively, tracking change is
helpful, or to be able to revert back.

While the these reasons are valid, they not so important in most of your engineering life. If you
don't have a huge monorepo you are maybe working on your part of the system alone, or together with
one other person. There are ways to handle that level of cooperation. Not everyone is working on the
Linux kernel. Tracking change is nice for sure and being able to revert to an earlier version might
be helpful, but in my experience you seldom have to revert a git commit. Once the change is properly
tested it will be rolled out. Once a feature is introduced you can't just remove it. People may or
may not have developed code that now depends on these features. If there is a bug a new change will
be introduced that fixes the bug, this will be a new change on top, not a revert.

If a new bug is found on a deployment, let's say a cool REST API server, usually one can roll-back
by using the binaries of this deployment. This not a revert in the version control.

## The ability to track and apply change between environments

However for me there is one more not so trivial benefit, it allows you do track and apply change
throughout your development cycle. Assume that you have three environments, one for development,
testing and production; these environments are also reflected on your git . Assume further that you
are actually developing a cool application that relies on a REST API server and a database. Now
business comes up with some new requirements, you implement them quickly and push the changes to the
development-branch. However there are more changes in the sprint, so you do those as well, so in the
end you have a few changes. You wrap them up, create a big commit out of them and push them to the
testing branch. After some more testing there you can finally release it to production.
If you follow this process everything that you have developed since the latest release will now also
be available.

Maybe the git-tree will look something likes this:

```
PRD ---------*---------*
            /         /
TST -------*-----*---*
          /     /   /
DEV -*-*-*-*-*-*-*-*
```

Real life however is usually not that nice. Assuming further that environments are actually somewhat
equal (much too strong assumption I know), and the configuration is actually not stored in code
(again a much too strong assumption for the real life). However keeping changing code and
configuration all aligned would an usual feat. So at one point, it can be an hotfix that you need to
roll out know on the production environment, or somebody was not super strict with fixing something
that popped up during testing on the testing environment, a couple of changes were not introduced in
the lowest branch - the developing branch, but instead on one of the higher ones.

```
PRD ---------*---------*-#1--*
            /         /     /
TST -------*-----*---*-#2--*
          /     /   /     /
DEV -*-*-*-*-*-*-*-*-*-*-*
```

In the above diagram every `*` is a normal commit, but the `#n` are hotfixes. Reasoning which change
was now introduced with the latest commit on the production branch gets suddenly very tricky. If
both hotfixes touch the same part a merge-conflict will arise for sure. But do you really want `#2`
to be deployed on PRD?


```
PRD ---------*------------*-#1---*
            /            /
TST -------*-----*---*-#2--*
          /     /   /     /
DEV -*-*-*-*-*-*-*-*-*-*-*
```

So maybe you don't merge the latest changes. But how will you then introduce change? And how do you
make sure that you have an answer for "When will this feature be available on PRD?" question?
At this point you can either merge the changes from the hotfix downstream, maybe using cherry-pick,
or other tools. The worst would be to manually copy the changes. Please don't do that.
<label for="sn-git_commit_size" class="margin-toggle
sidenote-number"></label><input type="checkbox" id="sn-git_commit_size"
class="margin-toggle"/><span class="sidenote">This is one of the reasons why a git commit should be
small enough to contain everything. If you have create a commit and push it in order to test it,
fine just do it on a feature branch and squash them together once you're done. It allows easy
reverts, identification and thus cherry-picking.</span>
Ideally as a team you come to conclusion that works the best for you. If you don't then the
previously git tree, where one can easily follow when the changes arrive in the downstream
environments will be three different and lonely branches that went their separate ways.

```
PRD ---------*---------*-#1----*1-*3-*5
            /         /
TST -------*-----*---*-#2---*1-*3-*4-*5
          /     /   /
DEV -*-*-*-*-*-*-*-*-*-*-*1-*2-*3-*4
```

Since there is no automated way that collects changes it will be a manual and thus faulty process.
Where all newly five changes applied to all environments? Maybe. Maybe not.

If you however follow a certain procedure and push the hotfixes upstream it might look like this:

```
PRD ---------*-----------*-#1-------------------*
            /           /    \                 /
TST -------*-------*---*-#2---*---*--------*--*
          /       /   /        \ /        /  /
DEV -*-*-*-*-*-*-*-*-*-*-*---*-*1-*2-*3-*4-*5
```

It is again (somewhat) clear and you no longer have to think about when and how changes will appear
downstream. Which makes testing, communication and planning easier.

## Conclusion

The way I see it there are two major reasons to use version control: 1) to track changes and 2) to
ensure that changes flow properly through the whole system.
