[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache licensed][license-img]][license-url]

[npm-img]: https://img.shields.io/npm/v/@esri/hub.js.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/hub.js
[travis-img]: https://img.shields.io/travis/Esri/hub.js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/hub.js
[coverage-img]: https://coveralls.io/repos/github/Esri/hub.js/badge.svg
[coverage-url]: https://coveralls.io/github/Esri/hub.js
[license-img]: https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square
[license-url]: #license

# @esri/hub.js

> compact, modular JavaScript wrappers for ArcGIS Hub that run in Node.js and modern browsers.

## Table of Contents

- [Example](#example)
- [API Reference](#api-reference)
- [Instructions](#instructions)
- [Packages](#packages)
- [FAQ](#frequently-asked-questions)
- [Issues](#issues)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [Code of Conduct](/CODE_OF_CONDUCT.md)
- [License](#license)

### Example

```bash
npm install @esri/hub-initiatives
```

```js
import { fetchInitiative  } from '@esri/hub-initiatives';

// pass in an initiative id
fetchInitiative("abc123")
    .then(
        response => // get back initiative metadata
    );
```

### API Reference

The documentation is published at http://esri.github.io/hub.js/ (source code [here](/docs/src)).


### Instructions

You can install dependencies (and bootstrap lerna) by cloning the repository and running:

```bash
npm install
```

Afterward, for a list of all available commands run `npm run`.

Some useful commands include:

* `npm test` runs _all_ the tests and confirms the API is functioning as expected.
* There is also a `Debug Node Tests` configuration in the `.vscode/launch.json` which will run the Node tests in the VS Code debugger.
* `npm run docs:serve` will run the documentation site locally at http://localhost:3000
* `npm run build` will created UMD bundles for _all_ the packages

### Packages

* [`@esri/hub-common-types`](./packages/common-types) - Typescript typings we reuse.
* [`@esri/hub-initiatives`](./packages/initiatives) - Helper functions for working with [Hub Initiatives](https://doc.arcgis.com/en/hub/initiatives/initiatives-overview.htm).
* [`@esri/hub-sites`](./packages/sites) - Helper functions for working with [Hub Sites](https://doc.arcgis.com/en/hub/sites/create-a-hub-site.htm).
* [`@esri/hub-auth`](./packages/auth) - Helper functions for authentication.

### Design Philosophy

`hub.js` is designed as a set of data manipulation functions, not persistent objects with behavior. You should not use `new` in conjunction with this library. Just include the modules your application needs and use them to hide lower-level abstractions for making API calls for hub related things. Your application should manage the state of the data you receive from these methods.

This project builds on the packages in [`arcgis-rest-js`](https://esri.github.io/arcgis-rest-js), so if you want even lower-level access, you can also use them directly.

#### Why Not Objects?

Persistent objects often introduce memory leaks in JavaScript applications. As soon as you instantiate a `new` object, you need to consider it's lifespan. If you happen to assign that object inside a closure or somewhere else long-lived, you might end up with references that can not be destroyed by the garbage collector. Creating clean separation between _functions-that-fetch-or-manipulate-data_ and _application-state-as-a-javascript-object_ helps to avoid this problem.

We are aiming for _functional_ equivalence to [`hub-py`](https://github.com/esridc/hub-py) so that the objects and capabilities are familiar, not necessarily to make the APIs _identical_.

[More about Javascript Memory Leaks](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)

### Frequently Asked Questions

* [Is this a _supported_ Esri product?](docs/FAQ.md#is-this-a-supported-esri-product)
* [Why TypeScript?](docs/FAQ.md#why-typescript) What if I prefer [Vanilla.js](https://stackoverflow.com/questions/20435653/what-is-vanillajs)?

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

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.
