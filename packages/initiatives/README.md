[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/hub.js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/hub-initiatives.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/hub-initiatives
[travis-img]: https://img.shields.io/travis/Esri/hub.js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/hub.js

# @esri/hub-initiatives

> Module to interact with ArcGIS Hub Initiatives in Node.js and modern browsers.

### Example

```bash
npm install @esri/hub-initiatives
```


## Coarse Grained API
The `@esri/hub-initiatives` exposes both  coarse and fine grained APIs. If your application simply needs to create an Initiative from a template, then the coarse grained API is for you. If your application is more focused on working with / editing / orchestrating solutions for Initiatives (i.e. the Hub), then the fine-grained api is likely a better fit.


### Get an Initiative by Id
To get an Initiative Model (` {item:{...}, data:{...}}`) you can use this call. If you do not need the `data` you can use the [@esri/arcgis-rest-items::getItem(id)](https://esri.github.io/arcgis-rest-js/api/items/getItem/) call instead.

```js
import { fetchInitiative  } from '@esri/hub-initiatives';

// pass in an initiative id
fetchInitiative("abc123", requestOptions)
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


### [NOT IMPLEMENTED YET] Searching for Initiative Templates

```js
import { searchInitiativeTemplates  } from '@esri/hub-initiatives';

// pass in an initiative id
searchInitiativeTemplates("query", requestOptions)
    .then(
        response => // get back initiative item, not a model. To get the full model ({item:{...}, data:{...}}) use fetchInitiative
    );
```

### [NOT IMPLEMENTED YET] Searching for Active Initiatives
```js
import { searchInitiatives  } from '@esri/hub-initiatives';

// pass in an initiative id
searchInitiatives("query", requestOptions)
    .then(
        response => // get back initiative item, not a model. To get the full model ({item:{...}, data:{...}}) use fetchInitiative
    );
```


## Fine Grained API

The fine grained API is composed of individual function calls which the Hub application uses when working with Initiatives through their entire life-cycle. These are documented in the [Hub.js Documentation](https://esri.github.io/hub.js/api/)


### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/hub.js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/ArcGIS/hub.js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/hub.js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright &copy; 2018 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](../../LICENSE) file.
