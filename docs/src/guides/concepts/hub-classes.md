---
title: Hub Classess
navTitle: Hub Classes
description: Design Patterns in Hub.js
order: 1
group: 3-classes
---

# Working with Hub Classes

Core Hub business logic has been wrapped into a set of javascript classes, representing the core Hub Entities: Site, Page, Initiative and Project. Additional classes are planned for Event, Team, and Person.

## Hub Classes

To reduce cognitive load, we have introduced a set of Classes. These classes are [Entity Specific](./hub-entities) (e.g. there is a `HubProject` class), and they encapsulate the standard operations for an Entity - `create`, `update`, `delete`, `fetch` etc, as well as entity specific methods.

For most developers, the Classes are the simplest way to work with ArcGIS Hub.

### Available Classes

- [`HubProject`](/hub.js/api/common/HubProject)
- [`HubInitiative`](/hub.js/api/common/HubInitiative)

### Working with Classes

Classes are instantiated via factory functions, which all take an `ArcGISContext` to provide platform and identity information. The [`ArcGISContextManager` documentation](./context.html) has additional background information.

## Factory Function Examples

```ts
import { HubProject, ArcGISContextManager } from "@esri/hub-common";

// Typically your application will manage a context manager instance
const ctxMgr = await ArcGISContextManager.create({
  username: "casey",
  password: "abc123",
});
// get the context from the manager
const ctx = ctxMgr.context;

// If you have the slug or id, use the `.fetch(...)` factory function
// In Ember, this is commonly used in the model hook of a route, and the instance can
// be passed forward into the controller
const smithStProject = await HubProject.fetch("dc::smith-st-forestry", ctx);

// If your app has aleady fetched the IHubProject object literal
// create an instance using the `.fromJson(...)` factory function
// note: since it's not fetching anything, this is a sync call
const pineStProject = HubProject.fromJson(pineStObjectLiteral, ctx);

// To create a new project, pass in an Partial<IHubProject> to `.create(..)`
// to get an instance for a new Project. If you want to immediately save the
// it, pass in `true` as the third argument.
const oakStProject = await HubProject.create({ title: "Oak St Project" }, ctx);
```

## Working with Editors

The Hub Classes are designed to work with the [ArcGIS Configuration Editor](https://esri.github.io/hub-components/?path=/docs/components-configuration-editor-arcgis-configuration-editor--form-rendering) component. This component is a generic editor interface that's driven by a json-schema for the entity being edited. While the editor will have a default interface layout, additional control is available by passing in a ui-schema.

In order to ensure consistent editing behavior and user experience, all Hub classes expose these schema's via static properties:

- `.jsonSchema` - full schema for all properties of the entity
- `.fullUiSchema` full ui for comprehensive editing of the entity
- `.minimalUiSchema` minimal fields needed to create a new entity

Regardless if you are using the ArcGIS Configuration Editor, or some other component or just need to change properties on the entity programatically, you must "extract" the entity object literal from the class, make changes to the object literal, and then push those changes back into the class. While nominally cumbersome in some situations, this pattern ensures developers do not pass class instances into components, which would be extremely problematic.

## Editing Properties Example

```ts
const ctxMgr = await ArcGISContextManager.create({
  username: "casey",
  password: "abc123",
});
// get the context from the manager
const ctx = ctxMgr.context;
// get a project
const smithStProject = await HubProject.fetch("dc::smith-st-forestry", ctx);
// extract the IHubProject object literal
const prj = smithStProject.toJson();
// set the status and change the summary text
prj.status = "complete";
prj.summary =
  "The Smith Street re-forestation project concluded on August 25th, 2022";
// apply the changes back into the instance
smithStProject.update(prj);
// now save changes back to the Portal
await smithStProject.save();
```

## Editing via ArcGIS Configuration Editor Example

This is a simplistic example of editing a project using the `<arcgis-configuration-editor>` component, showing a number of things:

- using the class to load the project from an id
- how we use `.toJson()` to get the "values" (aka the Object Literal) out of the class instance and into the editor
- how we can use the schema static properties on the class to drive the editor
- how to apply changes from the editor into the instance in response to an event
- and finally, how to save changes when the Save button is clicked

This same pattern can be used with other components or frameworks.

```ts
export class myEditor {
  @Prop
  projectId: string;

  @Prop
  context: IArcGISContext;

  private _project: HubProject;

  async componentWillLoad() {
    this._project = await HubProject.fetch(this.projectId, this.context);
  }

  get values() {
    // wrap the object literal into a {values: <any>} structure
    return { values: this.project.toJson() };
  }

  @Listen("arcgisConfigurationEditorChange")
  updateValues(evt: CustomEvent<IChangeEventDetail>): void {
    // apply changes into the project if valid
    if (evt.detail.valid) {
      this.project.update(evt.detail.values);
    }
    // typically we'd disable the save button if the editor is in an invalid state
  }

  handleSave() {
    // since project is kept up to date, we can just call Save
    this.project.save();
  }

  render() {
    return (
      <Fragment>
        <arcgis-configuration-editor
          schema={this.project.jsonSchema}
          uiSchema={this.project.fullUiSchema}
          values={this.values}
        />
        <calcite-button onClick={handleSave}>Save</calcite-button>
      </Fragment>
    );
  }
}
```

---

# Sections to Write

## Key Patterns for Dev's building classes

- separation of structure from behavior
  - `IWith<Noun>` structural interfaces vs `IWith<Noun>Behavior` interfaces
- limited inheritance
- delegation to functions

## Developer Experience

- create instance via factory functions
- "extract to edit"
  - optimized for reactive ui layers
- working with editor components
  - json schema + ui schema

### Composition via Interfaces and Functions

Manager classes and the entity objects they work with are defined via interface composition.

The Managers all implement the `IHubEntityManager` interface, which defines the basic CRUD+Search operations.

Additionally, Managers also implement "trait interfaces" (e.g. `IWithLayoutManager`), which define standardized behaviors. This allows different entity types of compose their behavior and properties based on common patterns, while still enabling per-entity customization where necessary. The actual implementation of the behaviors is typically delegated to a generic function, ensuring all entities implement the same behavior the same way, while still allowing for minor variations.

Similarly, the entity objects will conform to the entity specific interface (e.g. `IHubProject`) but those interfaces are composed with "trait interfaces" to ensure consistent properties are used across the types.

For example `IHubProject` extends the `IWithSlug` interface, and the `HubProjectManager` implements the `IWithSlugManager` interface, operating on the properties defined by `IWithSlug`.

![Manager and Entity Object Interfaces](/hub.js/img/interface-hiearchy.png)

This pattern ensures consistent API's across entities, powered by stand alone functions, composed into the Manager Classes and entity objects.
