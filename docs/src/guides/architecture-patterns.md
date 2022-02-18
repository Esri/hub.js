---
title: Architecture Patterns
navTitle: Architecture
description: Design Patterns in Hub.js
order: 1
group: 2-concepts
---

# Architecture Patterns in Hub.js

Hub.js has three architectural patterns:

- **Manager Classes** - streamlining operations on [Hub Entities](./hub-entities)
- **`Hub` Class** - designed for automation scripting, where build size is not a concern.
- **Plain Functions** - powering the other levels of abstraction, directly importing the functions allow for ad-hoc composition, and minimized build sizes

## Manager Classes

To reduce cognitive load, and make it easier for developers outside the ArcGIS Hub team, we have introduced a set of Manager Classes. These classes are [Entity Specific](./hub-entities) (e.g. there is a `HubProjectManager` class), and they encapsulate the standard operations for an Entity - `create`, `update`, `destroy`, `fetch` etc, as well as entity specific operations.

For most developers, the Manager Classes are the simplest way to work with ArcGIS Hub.

Manager Classes work with simple "entity" objects, which are not instances of classes.

#### Available Manager Classes

- [`HubProjectManager`](/hub.js/api/common/HubProjectManager)

### Working with Manager Classes

Manager classes are instantiated as needed, using either an `ArcGISContext` or an `ArcGISContextManager` to provide platform and identity information. The [`ArcGISContextManager` documentation](./context.html) has additional background information.

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
const smithStProject = await projectMr.fetch("smith-st-project");
// update some properties
smithStProject.state = "active";
// use the .update method on the manager, and get a new object back
const updated = await projectMr.update(smithStProject);
```

### Working with Modern Web Frameworks

All modern web frameworks (React, Angular, Vue, Ember etc) leverage some form of change tracking to determine when to re-render the UI. Typically this is done via object equality (aka `===`) or ES6 proxy objects, both of which are very efficient, but add complexity when working with Class instances. To keep things simple for all frameworks, Hub.js has enforced separation between the Manager classes and the entity objects. All Manager functions which apply changes to the backing data store, will return a new, updated instance of the entity object.

In the example above, the `.update(..)` method of the `HubProjectManager` class instance returns a new `IHubProject` entity object. This new object should then be assigned into the application's state management system.

### Composition via Interfaces and Functions

Manager classes and the entity objects they work with are defined via interface composition.

The Managers all implement the `IHubEntityManager` interface, which defines the basic CRUD+Search operations.

Additionally, Managers also implement "trait interfaces" (e.g. `IWithLayoutManager`), which define standardized behaviors. This allows different entity types of compose their behavior and properties based on common patterns, while still enabling per-entity customization where necessary. The actual implementation of the behaviors is typically delegated to a generic function, ensuring all entities implement the same behavior the same way, while still allowing for minor variations.

Similarly, the entity objects will conform to the entity specific interface (e.g. `IHubProject`) but those interfaces are composed with "trait interfaces" to ensure consistent properties are used across the types.

For example `IHubProject` extends the `IWithSlug` interface, and the `HubProjectManager` implements the `IWithSlugManager` interface, operating on the properties defined by `IWithSlug`.

![Manager and Entity Object Interfaces](/hub.js/img/interface-hiearchy.png)

This pattern ensures consistent API's across entities, powered by stand alone functions, composed into the Manager Classes and entity objects.

## Hub Automation Class

The final pattern is oriented towards developers looking to automate various Hub activities via scripting. In this pattern, all the Managers are accessible from a central [`Hub` class](/hub.js/api/common/Hub).

```js
import { Hub } from "@esri/hub-common";

// create Hub instance
const myHub = await Hub.create({
  authOptions: { username: "casey", password: "abc123" },
});

// Create a project via the HubProjectManager, which is accessed via `.projects`
let project = await myHub.projects.create({
  name: "Smith Street Curb Replacement",
  summary: "Replace/upgrade damaged curbs along Smith St. Scheduled for 2024",
  culture: "en-us",
  slug: "smith-st-2024",
  tags: ["2024 Plan"],
});
console.info(`Created project ${project.name} owned by ${project.owner}`);

// Update the project
project.status = "active";
await Hub.projects.update(project);

// Fetch a project by it's slug (can also use it's id)
const treeProject = await Hub.projects.fetch("2018-tree-trimming");

// Destroy a project
await Hub.projects.destroy(treeProject);

// search for projects
const filter: Filter<"content"> = {
  fitlerType: "content",
  owner: "casey",
};
const myProjects = await Hub.projects.search(filter, { num: 100 });
console.info(`"casey" owns ${myProjects.results.length} projects`);
```

While this api could be used in a web application, the tight coupling between the Hub class and all the Manager classes means that the build output would contain the vast majority of the Hub.js library, despite the application likely requiring a small fraction of that.

## Plain Functions

Backing the Managers and the Hub Class are a collection of functions that implement all the business logic for working with ArcGIS Hub entities (Sites/Pages/Initiatives/Projects etc). While most developers should look to leverage the Manager Classes or the Hub Class, those who need a more flexible option for composing other workflows can opt into this level.

While this pattern enables the wide reuse, and simple composition, it comes at the cost of increased cognitive load for developers - you need to know what functions to use and what context to use them in. The [API Reference](/hub.js/api/) contains a full list of all the functions.

Additionally, working with modern build tools, this level of abstraction will result in the smallest built output, as functions are the simplest structures to [tree shake](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/) during a build (assuming you only import the functions your code needs!).
