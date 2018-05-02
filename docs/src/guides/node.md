---
title: Using ArcGIS REST JS in Node.js
navTitle: Node.js
description: Learn how to integrate the ArcGIS REST JS library into a Node.js app.
order: 60
group: 1-get-started
---

# Get Started with Node.js

Make sure you have polyfills for [`fetch`](https://github.com/matthew-andrews/isomorphic-fetch) and [`FormData`](https://github.com/form-data/isomorphic-form-data) installed before using @esri/hub.js. You can find `npm install` commands for all packages in the [API reference](../../api).

```bash
npm install @esri/hub.js isomorphic-fetch isomorphic-form-data
```

Require the `isomorphic-fetch` and `isomorphic-form-data` modules before using any of the @esri/hub.js methods.

```js
require("isomorphic-fetch");
require("isomorphic-form-data");

const { fetchInitiative } = require("@esri/hub-initiatives");

fetchInitiative("abc123").then(response => {
  console.log(response);  // Initiative item with data
});
```