---
title: Hub.js Authentication
navTitle: Authentication
description: Learn how to send authentication to hub.js functions
order: 10
group: 3-functional-api
---

## Sending Authentication to Hub.js Functions

Although Hub.js is built on [ArcGIS Rest Js](https://esri.github.io/arcgis-rest-js/) much of what Hub.js does involves complex manipulation of items and groups, and orchestration of dozens of API calls.

While the underlying REST Js functions typically require an [IRequestOptions](https://esri.github.io/arcgis-rest-js/api/request/IRequestOptions/) or [IAuthenticationManager](https://esri.github.io/arcgis-rest-js/api/request/IAuthenticationManager/), in order to avoid re-fetching significant amounts of information about the current user and their organization, the Hub.js library functions typically require [IHubRequestOptions](https://esri.github.io/hub.js/api/common/IHubRequestOptions/).

IHubRequestOptions extends IRequestOptions with three important properties:

- `isPortal` a flag indicating if the code is running against ArcGIS Enterprise or ArcGIS Online
- `hubApiUrl` the url to the hub api.
- `portalSelf` (optional) the entire object returned from `/portals/self`, including the `currentUser` node

This information is generally available in any application that does any form of authentication against the ArcGIS Online or Enterprise APIs, and greatly reduces the amount of repetitive network requests that are required.

### Authenticating and Creating IHubRequestOptions

**Note** In the future Hub.js will expose a function to streamline construction of `IHubRequestOptions`

First we need to create a `UserSession` object. Typically web applications will do this via oAuth using [related methods]() in ArcGIS Rest Js or [Identity Manager]() in the ArcGIS API for Javascript.
To keep things simple we'll just use a username and password

```js
import { UserSession } from "@esri/arcgis-rest-auth";
import { getSelf } from "@esri/arcgis-rest-portal";
import { getHubApiUrlFromPortal } from "@esri/hub-common";
import { removeSite } from "@esri/hub-sites";

const session = new UserSession({ username: "jsmith", password: "12345678" });
// now use the session to get the portal/self
const portalSelf = await getSelf({ authentication: session });

// now construct hubRequestOptions
const hubRO = {
  isPortal: portalSelf.isPortal,
  hubApiUrl: getHubApiUrlFromPortal(portalSelf),
  portalSelf: portalSelf,
  authentication: session,
};
// now we can make hub.js calls
const result = await removeSite("3ef", hubRO);
```
