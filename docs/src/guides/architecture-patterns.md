---
title: Architecture Patterns
navTitle: Architecture
description: Design Patterns in Hub.js
order: 1
group: 2-concepts
---

# Architecture Patterns in Hub.js

Hub.js has evolved overs a number of years, and has a number of developer "audiences". As such, there are three broad Architectural Patterns employed: Plain Functions, Manager Classes, and the Hub Automation Class.

## Plain Functions

As it's core, Hub.js provides a collection of functions for working with ArcGIS Hub entities (Sites/Pages/Initiatives/Projects etc), and/or streamlining common Hub related workflows. These are designed to be flexibly composed/orchestrated by applications.

While this pattern enables the wide reuse, and simple composition, it comes at the cost of increased cognative load for developers - you need to know what functions to use and what context to use them in. The [API Reference](/hub.js/api/) contains a full list of all the functions.

Additional abstractions discussed below are composed from this foundational pattern, always allowing a developer to opt into a lower-level of abstraction, enabling composition for unforseen workflows. Additionally, working with modern build tools, this level of abstraction will result in the smallest built output, as functions are the simplest structures to [tree shake](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/) during a build (assuming you only import the functions your code needs!).

## Manager Classes

To reduce cognative load, and make it easier for developers outside the ArcGIS Hub team, we have introduced a set of Manager Classes. These classes are Entity Specific (i.e. there is a `HubProjectManager` class), and they encapsulate the standard operations for an Entity - `create`, `update`, `destroy`, `fetch` etc, as well as entity specific operations.

These classes are instantiated as needed, using either an `ArcGISContext` or an `ArcGISContextManager` to provide platform and identity information. The [`ArcGISContextManager` documentation](./context.html) has additional background information.

Once instantiated, you can call the exposed functions without passing in platform or identity information.

```ts
import { HubProjectManager, ArcGISContextManager } from "@esri/hub-common";

// Typically your application will manage a context manager instance
const ctxMgr = await ArcGISContextManager.create({
  username: "casey",
  password: "abc123",
});
// create a project manager
const projectMr = HubProjectManager.init(ctxMgr);
// get a project via it's slug
const smithStProject = await HubProjectManager.fetch("smith-st-project");
// update some properties
smithStProject.state = "active";
// use the .update method on the manager, and get a new object back
const updated = await HubProjectManager.update(smithStProject);
// Note: Manager's return new objects from the .update function. In order
// for modern web frameworks to track changes in data, you will want to
// return the result of the update function vs just the object you passed in.
```

### Working with Modern Web Frameworks

All modern web frameworks (React, Angular, Vue, Ember etc) leverage some form of change tracking to determine when to re-render the UI. Typically this is done via object equality (aka `===`) or ES6 proxy objects, both of which are very efficient, but add complexity when working with Class instances. To keep things simple for all frameworks, Hub.js has enforced separation between the Manager classes and the Data. All Manager functions which make changes to the data, will return a new, updated instance of the data.

### Composition via Interfaces and Functions

Manager classes and the POJO's they work with are defined via interface composition. The Managers all implement the `IHubEntityManager` interface, which defines the basic CRUD+Search operations.

Additionally, managers will also implement "trait manager interfaces" (i.e. `IWithLayoutManager`), which define behaviors which the manager will provide implementations for. This allows us to share both structure and behavior across many different entities, while still enabling per-entity customization where necessary.

Similarly, the POJO's will conform to the entity specific interface (i.e. `IHubProject`) but those interfaces are composed with "trait interfaces" to ensure consistent properties are used across the types.

For example `IHubProject` extends the `IWithSlug` iterface, and the `HubProjectManager` implements the `IWithSlugManager` interface, operating on the properties defined by `IWithSlug`.

![Manager and Pojo Interfaces](/hub.js/img/interface-hiearchy.png)

This pattern ensures consistent API's across entities, powered by stand alone functions, composed into the Manager Classes and data objects.

## Hub Automation Class

The final pattern is oriented towards developers looking to automate various Hub activities via scripting. In this pattern, all the core Managers are accessible from a central [`Hub` class](/hub.js/api/common/Hub).

```js
import { Hub } from "@esri/hub-common";

// create Hub instance
const myHub = await Hub.create({
  authOptions: { username: "casey", password: "abc123" },
});

// create a project via the HubProjectManager, which is accessed via `.projects`
let project = myHub.projects.create({
  name: "Smith Street Curb Replacement",
  summary: "Replace/upgrade damaged curbs along Smith St. Scheduled for 2024",
  status: "active",
  culture: "en-us",
  slug: "smith-st-2024",
  tags: ["2024 Plan"],
});
console.info(`Created project ${project.name} owned by ${project.owner}`);
```

While this api could be used in a web application, the tight coupling between the Hub class and all the Manager classes means that there would be significant overhead in any build output.
