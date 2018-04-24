# @esri/hub-request

> A module for making requests to ArcGIS Hub that runs in Node.js and modern browsers.

### Example

```bash
npm install @esri/hub-request
```

```js
import { helloHub  } from '@esri/arcgis-hub-request';

const url = "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data";

helloHub()
    .then(response => {
        console.log(response) // dummy data
    });
```

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/ArcGIS/hub.js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/ArcGIS/hub.js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/arcgis-rest-js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright 2018 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.
