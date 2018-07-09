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

  <!-- require @esri/hub.js libraries from https://unpkg.com -->
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/hub-initiatives') %}"></script>

  <script>
    // when including @esri/hub.js all exports are available from an esriHub global
    arcgisHub.fetchInitiative("acb123").then(response => {
      console.log(response);
    });
  </script>
</html>