---
title: Overview
navTitle: Overview
description: Hub.js Overview
order: 10
group: 1-intro
---

## Project Vision

Hub.js provides a concise, developer friendly TypeScript API for working with the Hub Domain Model.

Currently it supports Sites, Pages, Initiatives, Projects, Events, Discussions/Posts and Teams.

In the future this model will be extended to include People.

### ArcGIS Hub Domain Model

![Hub Domain Model](/hub.js/img/hub-domain-model.png)

## Architecture

Hub.js exposes two programming models: Classes and Functions. For most people, the class model will be the easiest to get started with and will provide a clean abstraction work working with ArcGIS Hub.

However, there are some cases where minimizing bundle size is critical, or optimization of complex workflows. In these scenarios, the lower-level function based API is more appropriate. Regardless of which API you choose to use, it should be noted that all the methods on the classes end up delegating to functions that can be individually imported, so it's the same underlying logic regardless how you interact with the system.
