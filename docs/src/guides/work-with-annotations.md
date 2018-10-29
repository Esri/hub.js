---
title: Work with annotations.
navTitle: Work with annotations
description: Learn how to work with an annotation service using @esri/hub.js.
order: 40
group: 1-get-started
---

Annotations are geographic comments created by an Author for discussion of an Initiative, about an Events, or feedback of a Dataset. This feedback can also be submitted anonymously.

Under the hood, the information is stored in an ArcGIS hosted feature service.

## Identify an existing annotation service.

If an organization has already purchased ArcGIS Hub, then it's annotation service can be sniffed out using the technique below.

```js
import { getPortal } from "@esri/arcgis-rest-request";
import { getAnnotationServiceUrl  } from '@esri/hub-annotations';

// first, use the org url to determine its unique id
getPortal("http://custom.maps.arcgis.com")
  .then(response => {
    const orgId = response.id;
    getAnnotationServiceUrl(orgId)
      .then(response => ) // "https://services.arcgis.com/..."
```

## Create a brand new annotation service.

@esri/hub.js can be used to _create_ an ArcGIS Hub compatible annotation service in an organization too.

```js
import { UserSession } from "@esri/arcgis-rest-auth";
import { createAnnotationService } from "@esri/hub-annotations";

// this user will be the owner of the new annotation service
const authentication = new UserSession({
  username: "joe",
  password: "shhhh"
});

createAnnotationService({
  orgId,
  authentication
})
  .then(response => // { success: true, itemId: "fe3" } );
```

## Submit anonymous comments

If you are creating an application for posting anonymous feedback, hub.js has a helper for that as well.

```js
import { addAnnotations } from "@esri/hub-annotations";

addAnnotations({
  url: annotationsUrl + "/0",
  adds: [{
    attributes: {
      target: "http://...", // the target of the comment
      description: "A grand idea!", // the actual comment
      source: "your cool app"
    }
  }]
})
  .then(response);
```