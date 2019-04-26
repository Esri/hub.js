---
title: Using @esri/hub.js from a CDN
navTitle: From a CDN
description: Learn how to use @esri/hub.js from a CDN.
order: 20
group: 1-get-started
---

# Get Started using a CDN

@esri/hub.js is hosted on [unpkg](https://unpkg.com/). You can find URLs for individual packages in the [API reference](../../api).

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>@esri/hub.js</title>
</head>
<body>
  Open your console to see the demo.
</body>
  <!-- require polyfills for fetch and Promise from https://polyfill.io -->
  <script src="https://cdn.polyfill.io/v2/polyfill.js?features=es5,Promise,fetch"></script>

  <!-- hub.js has external dependencies on @esri/arcgis-rest-js packages -->
  <script src="https://unpkg.com/@esri/arcgis-rest-request"></script>
  <script src="https://unpkg.com/@esri/arcgis-rest-auth"></script>
  <script src="https://unpkg.com/@esri/arcgis-rest-portal"></script>

  <!-- require @esri/hub.js libraries from https://unpkg.com too -->
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/hub-common') %}"></script>
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/hub-sites') %}"></script>
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/hub-initiatives') %}"></script>

  <script>
    // all exports are available from an arcgisHub global
    arcgisHub.searchInitiatives({
      searchForm: { q: "Share Open Data" }
    })
      .then(response => {
        arcgisHub.getInitiative(response.results[0].id).then(response => {
          console.log(response);
        });
      });
  </script>
</html>