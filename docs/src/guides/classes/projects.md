---
title: Working with Projects
navTitle: Projects
description: Working with Hub Projects
order: 50
group: 2-class-api
---

### Hub Projects

A Hub Project is a customizable representation of a real-world project. It is backed by an Item, and it can be associated with one or more Sites or Initiatives. It has a [banner image](), [timeline](), [catalog]() and [permissions]().

In ArcGIS Online, the item type is `Hub Project`

Hub Projects are not available in ArcGIS Enterprise.

We use Hub.js to work with Projects via the `HubProject` class, which operates on `IHubProject` objects.

#### API Links

- [HubProject Class](/hub.js/api/common/HubProject)
- [IHubProject](/hub.js/api/common/IHubProject)

### Working with Projects

To work with Projects, use the `HubProject` class. This class is instantiated via the standard factory functions, along with an `IArcGISContext`

| Factory Function                         | Description/Use-Case                                       |
| ---------------------------------------- | ---------------------------------------------------------- |
| `.load(Partial<IHubProject>, context)`   | Use when application already has an Project object literal |
| `.fetch(identifier, context)`            | Fetch the Project by id, slug                              |
| `.create(Partial<IHubProject>, context)` | Create an instance for a new Project                       |

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
import { HubProject } from "@esri/hub-common";

export default class projectsEditNewController extends Controller {
  // appSettings is a singleton service that holds an ArcGISContextManager instance
  // and exposes an `IArcGISContext` on a `.context` property
  @service appSettings;

  @action
  async createProject(project) {
    // create project instance and save it
    const project = HubProject.create(project, appSettings.context, true);
    // return project
    return project.toJson();
  }
}
```

#### Get a Project

In the `/projects/:project_id` route, we get the project by id or slug

```js
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { HubProject } from "@esri/hub-common";

export default class ProjectsProjectRoute extends Route {
  @service appSettings;

  model(params) {
    const project = await HubProject.fetch(params.project_id, appSettings.context);
    // results in model.project in the controller
    return {project}
  }
}
```

#### Update a Project

In the `/projects/:project_id/edit` controller we update the project like this

```js
import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { HubProject } from "@esri/hub-common";

export default class projectEditController extends Controller {
  @service appSettings;

  @action
  updateProject(project) {
    this.model.project.update(project);
    await this.model.project.save();
  }
}
```

## Automation Scripting

If you need to create or manage a series of projects, you can do this via Node.js.

This example assumes you are using NodeJS v13 or higher, and have set `type: "module"` in your `package.json` file, allowing the use of [ES Modules](https://nodejs.org/docs/latest-v12.x/api/packages.html#packages_determining_module_system) import syntax.

```js
import { HubProject, ArcGISContextManager } from "@esri/hub-common";

// create context
const contextManager = await ArcGISContextManager.init({
  username: "jack",
  password: "seekret",
});

// create a project
let project = await HubProject.create(
  {
    name: "Smith Street Curb Replacement",
    summary: "Replace/upgrade damaged curbs along Smith St. Scheduled for 2024",
    status: "active",
    culture: "en-us",
    slug: "smith-st-2024",
    tags: ["2024 Plan"],
  },
  contextManager.context
);
console.info(`Created project ${project.name} owned by ${project.owner}`);

// in scripting scenarios, we extract the object literal and make changes to that
const projectObjectLiteral = project.toJson();

// assign a timeline
projectObjectLiteral.timeline = {
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
// apply changes back into the class instance
project.update(projectObjectLiteral);
// save the changes back to the item
await project.save();
```

### In a Component

When working with Hub Projects in Components, import the lower-level functions instead of using the `HubProject`. This enables the Component build process to tree-shake out more code, resulting in a smaller build size.

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
