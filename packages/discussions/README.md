[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![gzip bundle size][gzip-image]][npm-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/hub.js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/hub-discussions.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/hub-discussions
[travis-img]: https://img.shields.io/travis/Esri/hub.js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/hub.js
[coverage-img]: https://codecov.io/gh/Esri/hub.js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Esri/hub.js

# @esri/hub-discussions

## IMPORTANT NOTICE:

> **This package will be deprecated in a future breaking release.**

 `@esri/hub-discussions` has been merged into `@esri/hub-common` beginning with `@esri/hub-common` version `15.38.0`. Please update your project dependencies and import statements to use `@esri/hub-common`.

<br>
<br>
<br>
<br>


> Module to interact with ArcGIS Hub Discussions API in Node.js and modern browsers.

### Example

```bash
npm install @esri/hub-discussions @esri/arcgis-rest-auth @esri/arcgis-rest-request @esri/hub-common
```
```js
import { searchPosts } from "@esri/hub-discussions";

// get posts for org
searchPosts({ access: ['org'], orgs: ['3ef']}).then(response => {
  return response.items;
  // [
  //   IPost{},
  //   ...
  // ]
});
```

## [API Reference](https://esri.github.io/hub.js/api/discussions/)

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/hub.js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [**love**](https://github.com/Esri/hub.js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/hub.js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](CONTRIBUTING.md).

### License

Copyright &copy; 2021 Esri

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
