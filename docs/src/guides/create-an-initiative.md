---
title: Create an initiative.
navTitle: Create an initiative
description: Learn how to create an initiative using @esri/hub.js.
order: 40
group: 1-get-started
---

## Create an Initiative

The `@esri/hub-initiatives` module exposes both coarse and fine-grained APIs. If your application simply needs to create an initiative from a template, then the coarse-grained API is for you. If your application is more focused on working with / editing / orchestrating solutions for Initiatives (i.e. the Hub), then the fine-grained api is likely a better fit.

### Get an Initiative by Id
To get an Initiative Model (` {item:{...}, data:{...}}`) you can use this call. If you do not need the `data` you can use the [@esri/arcgis-rest-items::getItem(id)](https://esri.github.io/arcgis-rest-js/api/items/getItem/) call instead.

```js
import { fetchInitiative  } from '@esri/hub-initiatives';

// pass in an initiative id
getInitiative("abc123", requestOptions)
    .then(
        response => // get back initiative "model" {item:{...}, data:{...}}
    );
```

### Create an Initiative
Initiatives are created from Initiative Template Items. If your application simply has the ID of a template item, you can send that in along with the usual `IRequestOptions` information. The module will then do all the work of fetching the template item, creating the Initiative item, creating the various groups, sharing the Initiative to the correct groups, and at the end, it will return the Initiative model.

Details documentation of the coarse-grained function calls is included in the [Hub.js Documentation](https://esri.github.io/hub.js)

Note: Since you are delegating all this work into a single function call, your application will have no means of displaying status as the various steps are completed.

```js
import { activateInitiative  } from '@esri/hub-initiatives';
// send the template item id
activateInitiative(
    "template-item-id",
    "New Initiative Title",
    "Collaboration Group Title",
    "Data Sharing Group Title",
    progressCallback,
    requestOptions
    ).then((initiativeModel) => {

    })
```

If your application has already fetched the template item model, that can be passed in.
```js
import { activateInitiative  } from '@esri/hub-initiatives';
// send the template item model aka {item:{...}, data:{...}}
activateInitiative(
    templateItemModel,
    "New Intiative Title",
    "Collaboration Group Title",
    "Data Sharing Group Title",
    progressCallback,
    requestOptions
    ).then((initiativeModel) => {

    })
```

### Update an Initiative

```js
import { updateInitiative  } from '@esri/hub-initiatives';
// send the template item model aka {item:{...}, data:{...}}
updateInitiative(initiativeModel, requestOptions)
    .then((initiativeModel) => {

    })
```

### Delete an Initiative
Removing an Initiative involves more then just deleting the item. The collaboration and open data groups are also removed, and optionally, the solutions that were generated as part of the Initiative can also be removed.

Note: This call can take 10 or more seconds, and if Solutions are being removed, it may take a minute or more.

```js
import { removeInitiative  } from '@esri/hub-initiatives';

removeInitiative(initiativeId, progressCallback, requestOptions)
    .then((result) => {

    })
```


### Searching for Initiative Templates

```js
import { searchInitiativeTemplates  } from '@esri/hub-initiatives';
const opts = {
  searchForm: {
    q: "Vision Zero"
  },
  ...requestOptions
} as ISearchRequestOptions;
// pass in an initiative id
searchInitiativeTemplates(opts)
    .then(
        response => // get back initiative item, not a model. To get the full model ({item:{...}, data:{...}}) use fetchInitiative
    );
```

### Searching for Active Initiatives
```js
import { searchInitiatives  } from '@esri/hub-initiatives';
// search for Vision Zero related initiatives, ordered by last modified date
const opts = {
  searchForm: {
    q: "Vision Zero",
    sortField: "modified",
    sortOrder: "desc"
  },
  ...requestOptions
} as ISearchRequestOptions;
// pass in an initiative id
searchInitiatives(opts)
    .then(
        response => // get back initiative item, not a model. To get the full model ({item:{...}, data:{...}}) use fetchInitiative
    );
```