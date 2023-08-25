---
title: Capabilities
navTitle: Capabilities
description: Checking Access via Capabilities
order: 30
group: 4-advanced
---

## Capabilities

A Capability represents a set of functionality ("Events", "Teams" etc), associated with an Entity. They are referenced by a set of pre-defined strings such as `"discussions", "events", "teams"` etc.

Please see the `Capability` type definition for the complete set of values.

The ArcGIS Hub business rules define the Capabilities for each entity type, but they can be disabled on a per-entity basis. For example, Premium Hub Sites have the `“events”` capability enabled by default, but the owner of a specific site can disable Events for that site.

Access to a Capability is determined by checking:

- if the capability available for the entity
- if the capability enabled for the entity
- if the current user meets the requirements for a set of Permissions

Valid Capabilities are defined in the [`Capability` type](https://github.com/Esri/hub.js/blob/master/packages/common/src/capabilities/types.ts).

### Checking Capability Access

Capabilities can be checked directly on an Entity instance via the `instance.checkCapability(capability)` method. If you don’t have access to an Entity Instance, the `checkCapability(capability, context, entity)` function is also available.

Both return an `ICapabilityAccessResponse` . The most important property is `.access` which is a `boolean` indicating if the current user has access to the capability. The other properties are for debugging and observability into why the system is returning the `.access` value, and can be used to display different messages to the user. Please see the [`ICapabilityAccessResponse` interface definition](https://github.com/Esri/hub.js/blob/master/packages/common/src/capabilities/types.ts#L56) for details.

### Defining Capabilities

The list of Capabilities are defined in the `validCapabilities` array, and exposed as the `Capability` type. To add a new Capability, add an entry to this array.

The permissions that will be checked for a Capability are defined in the `<EntityType>BusinessRules` modules, as `ICapabilityPermission` objects. This is a simple type which cross-walks the capability to an array of required permissions, as shown below.

```jsx
{
  entity: "site",
  capability: "details",
  permissions: ["hub:site:edit"],
},
```

The entity property is required so that the system can manage entity-specific definitions for the Capability.

To define the available capabilities for the entity, add an entry to the `<EntitType>DefaultCapabilities`. Only the capabilities defined in this structure will be available on the Entity. In the example below, we are defining the Capabilities for a Site as being only `"overview", "details" and "settings"`. No other capabilities can be set, regardless of what may be stored in the item’s json.

```jsx
export const SiteDefaultCapabilities: EntityCapabilities = {
  overview: true,
  details: true,
  settings: true,
};
```

When the entity is loaded, during the property mapping stage, the `data.capabilities` hash is processed, allowing only the properties defined in the `<EntityType>DefaultCapabilities` object to be passed through.
