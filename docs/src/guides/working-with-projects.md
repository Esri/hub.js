---
title: Working with Projects
navTitle: Working with Projects
description: Working with Hub Projects
order: 12
group: 2-concepts
---

## Working with Projects

### In an Application

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
  @service appSettings;

  @action
  createProject(project) {
    const projectMgr = HubProjects.create(appSettings.contextManager);
    return projectMgr.create(params.project_id);
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
    const projectMgr = HubProjectManager.create(appSettings.contextManager);
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
    const projectMgr = HubProjectManager.create(appSettings.contextManager);
    return projectMgr.update(project);
  }
}
```

## Automation Scripting

If you need to create or manage a series of projects, you can do this via Node.js.

This example assumes you are using NodeJS v13 or higher, and have set `type: "module"` in your `package.json` file, allowing the use of [ES Modules](https://nodejs.org/docs/latest-v12.x/api/packages.html#packages_determining_module_system) import syntax.

```js
import { HubProjectManager } from "@esri/hub-common";
import { UserSession } from "@esri/arcgis-rest-auth";

// create a UserSession
const session = new UserSession({ username: "casey", password: "abc123" });
// create contextManager
const mgr = await ArcGISContextManager.create({ authentication: session });
// create the projectMgr
const projectMgr = HubProjectManager.create(mgr);

// create a project
let project = projectMgr.create({
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

project = await projectMgr.update(project);

// Destroy a project
await projectMgr.destroy("3efbc7...");
```

### In a Component

When working with Hub Projects in Components, we want to import the lower-level functions instead of using the `HubProjectManager`. This enables the Component build process to tree-shake out more code, resulting in a smaller build size.

Let's suppose you have a component that you want to fetch and display a project using either
the project's ID or slug. The component would have an attribute `identifier` that can take the slug or item id.

```html
<arcgis-hub-project-view identifier="dcdev-smith-st-2024" />
```

In the component, import the `getProject` function from `@esri/hub-common`, and use that in the lifecycle hooks to load the project.

```ts
import { getProject } from "@esri/hub-common";

async componentWillLoad() {
  if (!this.project && this.identifier && this.context) {
    this.project = await getProject(this.identifier, this.context.requestOptions);
  }
}
```
