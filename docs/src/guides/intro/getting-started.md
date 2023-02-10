---
title: Installation
navTitle: Getting Started
description: Installing Hub.js
order: 30
group: 1-intro
---

## Getting Started

In order to work with Hub.js, typically you will want to install the `@esri/hub-common` package and work with those functions and classes. For some more specialized use cases other packages may be needed.

### Hub.js Packages

| Package                 | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| `@esri/hub-common`      | Hub Classes, utilities and authentication. Required by all other packages. |
| `@esri/hub-events`      | Functions for working with Hub Events                                      |
| `@esri/hub-discussions` | Functions for working with Discussions                                     |
| `@esri/hub-teams`       | Functions for working with Hub Teams                                       |

**Note**: While there are other packages in the repository, those should not be used for new development. Instead, use the classes and functions exported from `@esri/hub-common`.

### Installing

```sh
> npm i @esri/hub-common
```

### Using ES modules

Hub.js should work out-of-the-box with most popular bundlers that support ES modules.

```js
import { ArcGISContextManager, HubProject } from "@esri/hub-common";
// Default context for arcgis online
const ctx = await ArcGISContextManager.create().context;
const myProject = await HubProject.fetch("smith-st-project", ctx);
// work with the project
```

### Using Node.js

Make sure you have polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`FormData`](https://github.com/form-data/isomorphic-form-data) installed before using @esri/hub.js.

```sh
> npm i @esri/hub-common
> npm i isomorphic-fetch isomorphic-form-data
```

Require the `isomorphic-fetch` and `isomorphic-form-data` modules before using any of the @esri/hub.js methods.

```js
require("isomorphic-fetch");
require("isomorphic-form-data");

import { ArcGISContextManager, HubProject } from "@esri/hub-common";
// Default context for arcgis online
const ctx = await ArcGISContextManager.create().context;
// Node does not support top-level await so we return a promise
return HubProject.fetch("smith-st-project", ctx).then((myProject) => {
  // work with the project
});
```

# Using a CDN

Hub.js is hosted on [skypack](https://skypack.dev/), allowing the use of ESM directly in browsers via `<script type="module">`

When using ESM directly in the browser, you `import {class1, fn1} from "https://cdn.skypack.dev/{package}"`.

You can find the individual package names in the [API reference](../../api).

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>@esri/hub.js</title>
    <style>
      .container {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
        width: 95vw;
      }
      .display {
        width: 45vw;
        min-height: 300px;
      }
    </style>
  </head>

  <body>
    <h2>Fetch Domain Record, and Site</h2>
    <div class="container">
      <div class="display">
        <h4>Project</h4>
        <pre id="project"></pre>
      </div>
    </div>
  </body>

  <script type="module">
    import {
      ArcGISContextManager,
      HubProject,
    } from "https://cdn.skypack.dev/@esri/hub-common";

    // Default context for arcgis online
    const ctx = await ArcGISContextManager.create().context;
    const myProject = await HubProject.fetch("smith-st-project", ctx);
    document.getElementById("project").innerText = JSON.stringify(
      myProject.toJson(),
      null,
      2
    );
  </script>
</html>
```
