---
layout: post
title:  "Configuring Helm Deployments"
date:   "2025-08-20"
tags:
  - infrastructure as code
  - helm
  - kubernetes
---

# Introduction

As you may know [Helm](https://helm.sh/docs/intro/install/) is a package manager for
[Kubernetes](https://kubernetes.io/). As you may know as well is that configuring a Helm deployment
for multiple environments can be tricky. Image you want to install a Helm chart that produces a
deployment, a service to allow access to this deployment and an optional database to store your
data. The `values.yaml` file might look something like this:

```
deployment:
  image: someNamespace/someImage
  version: latest
service:
  enable: true
  type: ClusterIP
database:
  enable: false
  host: psql.postgres.database.com
  port: 6432
```

Running `helm install myChartInstance aHelmNamespace/aChart --version 1.2.3 -f ./values.yaml` will
render the templates in the charts by overwriting the default values with the ones given. Now
imagine, that by setting the `database.enable` flag to `false` you stop the renderer from creating
its own database instance, and instead just uses the provided configuration. For the `service` the
same would apply, but since the `service.enable` flag is set to `true` the renderer creates a new
service kubernetes object of the given type. So far, so good.

But there are two classical problems that I see all the time in these Helm chart deployments.
Namely, how to configure them for different environments and how to configure or add features that
the Helm chart author did make configurable through `values.yaml`.

# Environmental Adaptations

This is actually not a very tricky thing. Many different solutions exist for this problem. You could
provide different `values-<env>.yaml` files in combination with a `values-base.yaml` file: `helm
install ... -f values-base.yaml -f values-prd.yaml`. With the `values-prd.yaml` file just overriding
the specific values for the production environment:

```
deployment:
  version: 42.1.2
database:
  host: psql.postgres-prd.database.com
```

The other canonical option would be to use `--set` to provide these values in your deployment action
/ workflow / script:

```
helm install ... -f values.yaml \
                 --set deployment.version=41.1.2 \
                 --set database.host psql.postgres-prd.database.com
```

Both options have their pros and cons. I would prefer the multiple file option, keeping similar
types of configuration conceptually close to each other makes the code easier to comprehend. Putting
part of the configuration into a completely different section of your code base increases the mental
burden, impacting on-boarding of new joiners and increasing maintenance effort.

# Unreachable Configurations

Now imagine that the chart does not give you the option to manipulate additional,
features of the deployment. For example, the `nodeSelector` and `tolerations`
parameters. In many kubernetes clusters, these parameters are used to guide the
[kube-scheduler](https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/) where to
place Pods. If the Helm chart author did not think of providing users with the option to declare
them in the `values.yaml` you are not able to modify them.

Other common issues are additional annotations necessary for services and ingresses, as they can now
manipulate the deployments outside of the cluster as long as the correct annotations are provided.

Given that it is not possible to manipulate the kubernetes objects through the Helm deployment
method, you need to do it differently.

One option would be to use [`kubectly
patch`](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_patch/). Thus, after the Helm
rendered and applied the objects and successfully created them, you run `kubectl patch -f patch.yaml`
and modify them. Clearly, this creates timing issues.

The other option would be to use [`kubectl
kustomize`](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/). But
kustomize works best on kubernetes manifests / objects that you fully control and own, which is not
the case in Helm charts. But fear not! By using the `--post-renderer` flag during your Helm chart
deployment you can manipulate the would-be kubernetes objects before they are created.

To [quote](https://helm.sh/docs/topics/advanced/#post-rendering):

>A post-renderer can be any executable that accepts rendered Kubernetes manifests on STDIN
>and returns valid Kubernetes manifests on STDOUT. It should return an non-0 exit code in the event
>of a failure.

## An Example

The following example highlights some functionality and gives a complete example that works well on
GitHub actions targeting Azure.

Assuming you have the following project file structure:

```
kustomization
├── base
│   └── kustomization.yaml
├── kustomize-dev.sh
├── kustomize-prd.sh
└── overlays
    ├── dev
    │   ├── database-connection.yaml
    │   ├── kustomization.yaml
    │   └── service.yaml
    └── prd
        ├── database-connection.yaml
        ├── kustomization.yaml
        └── service.yaml
```

### `kustomization/kustomize-prd.sh`

The script for the other environments looks very similar, just applying it to a different folder.
Note the location of the rendered manifests.

```
#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cat > "${SCRIPT_DIR}/base/resources.yaml"
kubectl kustomize "${SCRIPT_DIR}/overlays/prd"
```

### `kustomization/base/kustomization.yaml`

This just exists to provide a common starting point. In theory, you don't need it and could just
store the rendered manifests in the overlays folders. The reason to provide a common starting point
is to make the whole thing closer to the "standard" application of `kustomize`, that is resources
that you fully control, making it easier to understand the concept.

```
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - resources.yaml
```


### `kustomization/overlays/prd/kustomization.yaml`

The real thing!

```
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base

images:
- name: template.azurecr.io/aNamespace/anImage
  newName: prd.azurecr.io/aNamespace/anImage
  newTag: 12.3.1

patches:
- path: ./database-connection.yaml
- path: ./service.yaml

labels:
  - pairs:
      environment: prd
      app.kubernetes.io/part-of: mySystem
    includeTemplates: true
```

A couple of things to note here:

- The reference to the common starting point `../../base`.
- The **global** overwrite of all images that match the provided name
  `template.azurecr.io/aNamespace/anImage`. Ideally, switching the registry would not be necessary,
  but many companies still haven't realised that rebuilding or copying binaries from registry to
  registry is an antipattern.
  However, it also allows you to manipulate the tag, thus controlling the release of images in
  different environments.
- The patches will contain changes to the individual objects, which need to match. `kustomize` has
  many different was to do this. RTFM applies.

### Execution

Given the above, one can execute the post-renderer like this:

```
helm upgrade myChartInstance aHelmNamespace/aChart \
  --version 1.2.3 \
  --namespace myNamespace \
  -f ./values.yaml \
  --install \
  --post-renderer ./kustomization/kustomize-prd.sh
```

# The Combination of both

Now that you have seen two options for slightly, but overlapping use cases, which one should you
pick in what scenarios? *If only it were that simple!*. In most of my projects it is a combination
of using a common `values.yaml`, applying `--set` and the post-renderer.

The goal is that the `values.yaml` provide a complete and running example, the Helm chart author
will work with this file, by using primarily this method you can expect low maintenance effort and
fewer unexpected problems in the future. If that can't match your environment, use the
post-renderer. However, the Helm chart reuses values in non-native Kubernetes objects, for example a
pod-template stored in a `configMap` one has to fall back to use `--set` or multiple
`values-<env>.yaml` files as changing these values is not straightforward nor maintainable
otherwise.

