---
title: Using @esri/hub.js from a CDN
navTitle: From a CDN
description: Learn how to use @esri/hub.js from a CDN.
order: 20
group: 1-get-started
---

# Get Started using a CDN

@esri/hub.js is hosted on [skypack](https://skypack.dev/), allowing the use of ESM directly in browsers via `<script type="module">`

When using ESM directly in the browser, you `import {fn1, fn2} from "https://cdn.skypack.dev/{package}"`.

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
        <h4>Domain Record Json</h4>
        <pre id="domainRecord"></pre>
      </div>
      <div class="display">
        <h4>Site</h4>
        <pre id="site"></pre>
      </div>
    </div>
  </body>

  <script type="module">
    import {
      lookupDomain,
      getSiteById,
    } from "https://cdn.skypack.dev/@esri/hub-sites";

    lookupDomain("coronavirus-resources.esri.com", { isPortal: false }).then(
      (response) => {
        console.log(response);
        document.getElementById("domainRecord").innerText = JSON.stringify(
          response,
          null,
          2
        );
        getSiteById(response.siteId).then((response) => {
          console.log(response);
          document.getElementById("site").innerText = JSON.stringify(
            response,
            null,
            2
          );
        });
      }
    );
  </script>
</html>
```
