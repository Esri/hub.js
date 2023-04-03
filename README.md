[![npm version][npm-img]][npm-url]
[![build status][build-img]][build-url]
[![Coverage Status][coverage-img]][coverage-url]
[![apache licensed][license-img]][license-url]

[npm-img]: https://img.shields.io/npm/v/@esri/hub-common.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/hub-common
[build-img]: https://github.com/Esri/hub.js/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/Esri/hub.js/actions/workflows/release.yml
[coverage-img]: https://codecov.io/gh/Esri/hub.js/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Esri/hub.js
[license-img]: https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square
[license-url]: #license

# @esri/hub.js

> compact, modular JavaScript wrappers for ArcGIS Hub that run in Node.js and modern browsers.

## Table of Contents

- [API Reference](#api-reference)
- [Instructions](#instructions)
- [Packages](#packages)
- [FAQ](#frequently-asked-questions)
- [Issues](#issues)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [Recommended Extensions](#recommended-extensions)
- [Code of Conduct](/CODE_OF_CONDUCT.md)
- [License](#license)


### API Reference

The documentation is published at http://esri.github.io/hub.js/ (source code [here](/docs/src)).

### Instructions

You can install dependencies by cloning the repository and running:

```bash
npm install
```

**Note:** This project uses [volta](https://volta.sh/) to manage node/npm versions. We strongly suggest you do, too :)

Afterward, for a list of all available commands run `npm run`.

Some useful commands include:

- `npm test` runs _all_ the tests and confirms the API is functioning as expected.
- There is also a `Debug Node Tests` configuration in the `.vscode/launch.json` which will run the Node tests in the VS Code debugger.
- `npm run test:chrome:debug` runs _all_ the tests in a browser, and will re-run when changes are made. Note: in some situations, spies/stubs will fail on subsequent test runs. We are not certain why this occurs, but the resolution is to stop/start the test runner.
- `npm run docs:serve` will run the documentation site locally at http://localhost:3000
- `npm run build` will run the ESM and CJS build for _all_ the packages

### Packages

- [`@esri/hub-common`](./packages/common) - Common TypeScript types and utility functions.
- [`@esri/hub-discussions`](./packages/discussions) - Module to interact with ArcGIS Hub Discussions API
- [`@esri/hub-downloads`](./packages/downloads) - Helper functions for working with downloads.
- [`@esri/hub-events`](./packages/events) - Helper functions for working with Events.
- [`@esri/hub-initiatives`](./packages/initiatives) - Helper functions for working with [Initiatives](http://doc.arcgis.com/en/hub/initiatives/initiatives-overview.htm).
- [`@esri/hub-search`](./packages/search) - Helper functions for search on ArcGIS Online.
- [`@esri/hub-sites`](./packages/sites) - Helper functions for working with [Sites](http://doc.arcgis.com/en/hub/sites/create-a-hub-site.htm), Pages and Domains.
- [`@esri/hub-surveys`](./packages/surveys) - Helper functions for working with Surveys.
- [`@esri/hub-teams`](./packages/teams) - Helper functions for working with ArcGIS Online groups in a Hub context.

#### Deprecated Packages

- [`@esri/hub-annotations`](https://github.com/Esri/hub.js/tree/cee44463c5cbf616abdb7786551d72a7792bb3c4/packages/annotations) - Hub Annotations have been replaced with Hub Discussions, see [`@esri/hub-discussions`](./packages/discussions)
- [`@esri/hub-auth`](https://github.com/Esri/hub.js/tree/v6.10.0/packages/auth) - moved to [`@esri/hub-common`](./packages/common)
- [`@esri/hub-types`](https://github.com/Esri/hub.js/tree/v6.10.0/packages/types) - moved to [`@esri/hub-common`](./packages/common)
- [`@esri/hub-content`](https://github.com/Esri/hub.js/tree/2379fbeb1672d059025c6efdc84b34b78ce23709/packages/content) - moved to [`@esri/hub-common`](./packages/common)

### Design Philosophy

`hub.js` is designed as a set of data manipulation functions, not persistent objects with behavior. You should not use `new` in conjunction with this library. Just include the modules your application needs and use them to hide lower-level abstractions for making API calls for hub related things. Your application should manage the state of the data you receive from these methods.

This project builds on the packages in [`arcgis-rest-js`](https://esri.github.io/arcgis-rest-js), so if you want even lower-level access, you can also use them directly.

#### Why Not Objects?

Persistent objects often introduce memory leaks in JavaScript applications. As soon as you instantiate a `new` object, you need to consider its lifespan. If you happen to assign that object inside a closure or somewhere else long-lived, you might end up with references that cannot be destroyed by the garbage collector. Creating clean separation between _functions-that-fetch-or-manipulate-data_ and _application-state-as-a-javascript-object_ helps to avoid this problem.

We are aiming for _functional_ equivalence to [`hub-py`](https://github.com/esridc/hub-py) so that the objects and capabilities are familiar, not necessarily to make the APIs _identical_.

[More about Javascript Memory Leaks](https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)

### Frequently Asked Questions

- [Is this a _supported_ Esri product?](docs/FAQ.md#is-this-a-supported-esri-product)
- [Why TypeScript?](docs/FAQ.md#why-typescript) What if I prefer [Vanilla.js](https://stackoverflow.com/questions/20435653/what-is-vanillajs)?

### Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/hub.js/issues) first. Have you found a new bug? Want to request a new feature? We'd [**love**](https://github.com/Esri/hub.js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, @esri/hub.js is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

#### Release Process

See the [release process](RELEASE.md) document.

### Recommended Extensions

To assist you in your development efforts, we have recommended certain extensions for VScode. On editor load, you should see a pop up in the bottom right that will direct you to the download point.

If you have another useful extension that you'd like to recommend, add an entry to the `recommendations` array in `extensions.json` (hint: hitting `cmd+i` while in the array will bring up a list of all your installed extensions). Submit a PR with your changes through the normal process.

### License

Copyright &copy; 2018-2019 Esri

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
