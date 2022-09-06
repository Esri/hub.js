---
title: Working with Projects
navTitle: Projects
description: Working with Hub Projects
order: 50
group: 2-class-api
---

## Working with Projects

Hub.js exposes a number of ways to work with Hub Projects. At the lowest level, you can simply import functions like `createProject`, `updateProject` etc, and work with them. This is ideal when you are looking to optimize the payload of an application which only needs to do a subset of operations.

The next level up is to use the `HubProjectManager` class. This class is instantiated with either an `ArcGISContextManager` or `IArcGISContext`. If your application needs to have a long-lived `HubProjectManager` then it's best to pass a reference to your app's `ArcGISContextManager` instance, so that when authentication changes, the `HubProjectManager` instance will have current information because of the shared reference.

For most applications, you can simply create a `HubProjectManager` using the `IArcGISContext`, do some operations, and then let the `HubProjectManager` instance be disposed.

The final option is to use the `Hub` class. We recommend this for scripting / automation tasks. Although you could build a web application using the `Hub` class, it will likely result in a very large build since classes are much more complex to "tree shake" so your applicatin will get the entire Hub system, despite likely only needing a few functions.

### In an Application

We expect that most applications will leverage the `HubProjectManager` class, instantiated as needed with `IArcGISContext` from the application's `ArcGISContextManager.context`. The following example shows this pattern using Ember.js, but it would be generally the same in React etc.

### Ember.js Example

Assuming the following routes in an app...

```js
//...snip...
this.route("projects", function () {
  this.route("project", { path: "/:project_id" }, function () {
    this.route("edit");
  });
  this.route("edit", function () {
    this.route("new");
  });
});
//...snip...
```

#### Create a Project

To create a project in the `/projects/edit/new` controller...

```js
import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { HubProjectManager } from "@esri/hub-common";

export default class projectsEditNewController extends Controller {
  // appSettings is a singleton service that holds an ArcGISContextManager instance
  // and exposes an `IArcGISContext` on a `.context` property
  @service appSettings;

  @action
  async createProject(project) {
    // instantiate the project manager
    const projectMgr = HubProjectManager.init(appSettings.context);
    // create the project and return the IHubProject instance
    return projectMgr.create(project);
  }
}
```

#### Get a Project

In the `/projects/:project_id` route, we get the project by id or slug

```js
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { HubProjectManager } from "@esri/hub-common";

export default class ProjectsProjectRoute extends Route {
  @service appSettings;

  model(params) {
    const projectMgr = HubProjectManager.init(appSettings.context);
    return projectMgr.get(params.project_id);
  }
}
```

#### Update a Project

In the `/projects/:project_id/edit` controller we update the project like this

```js
import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { HubProjectManager } from "@esri/hub-common";

export default class projectEditController extends Controller {
  @service appSettings;

  @action
  updateProject(project) {
    const projectMgr = HubProjectManager.create(appSettings.context);
    return projectMgr.update(project);
  }
}
```

## Automation Scripting

If you need to create or manage a series of projects, you can do this via Node.js.

This example assumes you are using NodeJS v13 or higher, and have set `type: "module"` in your `package.json` file, allowing the use of [ES Modules](https://nodejs.org/docs/latest-v12.x/api/packages.html#packages_determining_module_system) import syntax.

```js
import { Hub } from "@esri/hub-common";

// create Hub instance
const myHub = await Hub.create({
  authOptions: { username: "casey", password: "abc123" },
});

// create a project
let project = myHub.projects.create({
  name: "Smith Street Curb Replacement",
  summary: "Replace/upgrade damaged curbs along Smith St. Scheduled for 2024",
  status: "active",
  culture: "en-us",
  slug: "smith-st-2024",
  tags: ["2024 Plan"],
});
console.info(`Created project ${project.name} owned by ${project.owner}`);

// assign a timeline and update
project.timeline = {
  title: "Project Schedule",
  timeframe: "Summer 2024",
  description: "Key dates for design and construction",
  stages: [
    {
      title: "Study Completed",
      description: "Initial review of existing infrastructure",
      icon: "check-circle-f",
      timeframe: "Fall 2019",
      id: 1638572046394,
      status: "Complete",
      isEditing: false,
      leadingElement: false,
      trailingElement: false,
    },
    {
      title: "Environmental and Preliminary Design Completed",
      timeframe: "Fall 2019",
      description:
        "Work with Federal Highway Administration to secure environmental approval of designs",
      icon: "check-circle-f",
      id: 1638572046399,
      status: "Complete",
      isEditing: false,
      leadingElement: false,
      trailingElement: false,
    },
  ],
};

project = await myHub.projects.update(project);

// Destroy a project
await myHub.projects.destroy("3efbc7...");
```

### In a Component

When working with Hub Projects in Components, import the lower-level functions instead of using the `HubProjectManager`. This enables the Component build process to tree-shake out more code, resulting in a smaller build size.

Let's suppose you have a component that will fetch and display a project using either
the project's ID or slug. The component would have an attribute `identifier` that can take the slug or item id.

```html
<arcgis-hub-project-view identifier="dcdev-smith-st-2024" />
```

In the component, import the `getProject` function from `@esri/hub-common`, and use that in the lifecycle hooks to load the project.

```ts
import { getProject } from "@esri/hub-common";

async componentWillLoad() {
  // Note context should be set on the element as `IArcGISContext`
  if (!this.project && this.identifier && this.context) {
    this.project = await getProject(this.identifier, this.context.requestOptions);
  }
}
```
