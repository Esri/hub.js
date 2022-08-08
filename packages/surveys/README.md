[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![gzip bundle size][gzip-image]][npm-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/hub.js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/hub-surveys.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/hub-surveys
[travis-img]: https://img.shields.io/travis/Esri/hub.js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/hub.js
[coverage-img]: https://codecov.io/gh/Esri/hub.js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Esri/hub.js

# @esri/hub-surveys

> Module to interact with ArcGIS Hub Surveys in Node.js and modern browsers.

### Example

```bash
npm install @esri/hub-surveys
```

```js
import { setAccess } from "@esri/hub-surveys";

// Sets a Survey Form, Feature Service & Fieldworker View (if it exists) access
// Stakeholder View access is set separately
setAccess(
  "8a2fea7edecc47eb9818b4f5a220ee72", // ID of Survey Form item
  "private", // "private", "public", or "org"
  requestOptions // rest.js request options
)
  .then((results) => {
    // results is an array containing the rest.js setAccess result for each
    // survey item whose access we successfully changed
  })
  .catch((error) => {
    // one or more rest.js setItemAccess calls failed. error is first
    // encountered error. all successful setItemAccess calls have automatically
    // been reverted at this point
  });
```

```js
import { shareWithGroup } from "@esri/hub-surveys";

// Shares Survey items with the given Survey Form ID & group ID. Transactional in nature.
shareWithGroup(
  "8a2fea7edecc47eb9818b4f5a220ee72", // ID of Survey Form item
  "9a2fea7edecc47eb9818b4f5a220ee71", // ID of group to share Survey items to
  requestOptions // rest.js request options
)
  .then((results) => {
    // all rest.js shareItemWithGroup calls succeeded. results is an array of
    // rest.js shareItemWithGroup results.
  })
  .catch((error) => {
    // one or more rest.js shareItemWithGroup calls failed. error is first
    // encountered error. all successful shareItemWithGroup calls have automatically
    // been reverted at this point
  });
```

```js
import { unshareWithGroup } from "@esri/hub-surveys";

// Unshares Survey items for the given Survey Form ID & group ID. Transactional in nature.
unshareWithGroup(
  "8a2fea7edecc47eb9818b4f5a220ee72", // ID of Survey Form item
  "9a2fea7edecc47eb9818b4f5a220ee71", // ID of group to share Survey items to
  requestOptions // rest.js request options
)
  .then((results) => {
    // all rest.js unshareItemWithGroup calls succeeded. results is an array of
    // rest.js unshareItemWithGroup results.
  })
  .catch((error) => {
    // one or more rest.js unshareItemWithGroup calls failed. error is first
    // encountered error. all successful unshareItemWithGroup calls have automatically
    // been reverted at this point
  });
```

```js
import { getSurveyModels } from "@esri/hub-surveys";

// Retrieves a dictionary of Survey models for a given Survey Form item ID
getSurveyModels(
  "8a2fea7edecc47eb9818b4f5a220ee72", // ID of Survey Form item
  requestOptions // rest.js request options
)
  .then((results) => {
    // results => {
    //   form: { item: { ... } },
    //   featuresService: { item: { ... } },
    //   fieldworker: { item: { ... } },
    //   stakeholder: { item: { ... } },
    // };
  });
```

## [API Reference](https://esri.github.io/hub.js/api/surveys/)

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/hub.js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/Esri/hub.js/issues/new) to hear from you.

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
