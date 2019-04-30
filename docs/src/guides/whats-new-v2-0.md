---
title: What's New in v2.0.0
navTitle: What's New in v2.0.0
description: Learn what's new in v2.0.0 of @esri/hub.js.
order: 60
group: 1-get-started
---

# What's new in `v2.0.0?`

We heard that ArcGIS REST JS had some new goodies in [`v2.0.0`](https://github.com/Esri/arcgis-rest-js/releases/v2.0.0), so we decided to jump on the bandwagon too.

_Very_ little has changed in @esri/hub.js v2.0.0, but there are a few breaking changes to be aware of.

#### ArcGIS REST JS packages are now `peerDependencies`.

`@esri/arcgis-rest-request` and friends have never been bundled within our code, so now that we're relying on `v2.x`, we're doing the [right thing](https://stackoverflow.com/questions/26737819/why-use-peer-dependencies-in-npm-for-plugins) and listing REST JS packages as _peerDependencies_ in @esri/hub.js.

```json
{
  "name": "@esri/hub-initiatives",
  "peerDependencies": {
    "@esri/arcgis-rest-request": "^2.0.0"
  }
}
```
As a @esri/hub.js developer, you'll need to install pertinent ArcGIS REST JS packages yourself.

```json
{
  "name": "Your awesome project",
  "dependencies": {
    "@esri/arcgis-rest-request": "^2.0.0",
    "@esri/hub-initiatives": "^2.0.0",
  }
}
```

#### Documentation

We 'borrowed' all the great new updates in the ArcGIS REST JS documentation.

* `RequestOptions` details are now displayed inline on the page for their corresponding method.
* `Required`, `optional` and `inherited` parameters are now appropriately sorted in tables.
* `Methods`, `Constants`, `Types` and `Interfaces` are sorted in the Table of Contents too
* Text overflow is now handled more appropriately.

#### Say goodbye to `@esri/hub-domains`

The sole utility function in our domains package proved so popular we moved it into `@esri/hub-common` and got rid of `@esri/hub-domains` entirely.

| Old | New | Package
| -- | -- | -- |
| ~~`getHubUrl()`~~ |  | ~~`@esri/hub-domains`~~ |
| | [`getHubApiUrl`](../api/common/getHubApiUrl/)  | `@esri/hub-common` |

#### `@esri/hub-sites`

We renamed two methods inside `@esri/hub-sites` awhile back. In v2.0.0, we officially removed the old ones.

| Old Method | New Method |
| -- | -- |
| ~~`fetchDomain()`~~ | `getDomain()` |
| ~~`fetchDomains()`~~ | `getDomains()` |

#### `@esri/hub-initiatives`

We renamed one method inside `@esri/hub-initiatives` too.

| Old Method | New Method |
| -- | -- |
| ~~`fetchInitiative()`~~ | `getInitiative()` |

#### `@esri/hub-annotations`

When you're creating a new annotation, now you'll pass an array of `features` (instead of `adds`).

```js
// old
addAnnotations({ adds: [] })

// new
addAnnotations({ features: [] })
```

## Breaking Changes for TypeScript developers

The table below lists interfaces and types that have been removed or renamed in the name of consistency and brevity. This also better aligns the names of options and response interfaces with their corresponding  function.

| Old Interface | New Interface |
| -- | -- |
| ~~`ISearchAnnoRequestOptions`~~ | `ISearchAnnoOptions` |
| ~~`IVoteRequestOptions`~~ | `IVoteOptions` |
| ~~`IEventRegisterRequestOptions`~~ | `IEventRegisterOptions` |
| ~~`IFollowInitiativeRequestOptions`~~ | `IFollowInitiativeOptions` |

That's it! We didn't move much 🧀 because he heard those pesky ArcGIS REST JS maintainers renamed so many packages.