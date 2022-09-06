---
title: Programming Models
navTitle: Programming Models
description: Working with Classes or Functions
order: 40
group: 1-intro
---

## Programming Models

Hub.js exposes two programming models: Classes and Functions. For most people, the class model will be the easiest to get starte with and will provide a clean abstraction work working with ArcGIS Hub.

However, there are some cases where minimizing bundle size is critical, or optimization of complex workflows. In these scenarios, the lower-level function based API is more appropriate. Regardless of which API you choose to use, it should be noted that all the methods on the classes end up delegating to functions that can be individually imported, so it's the same underlying logic regardless how you interact with the system.

Hub.js employs a few architectural patterns to enable these programming models.

### Internal Entity Interfaces

Hub class instances hold an internal object that has all the properties of the underlying entity.

### Hub Classes: Structural and Behavioral Interfaces

###
