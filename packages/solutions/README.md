[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/hub.js/master/LICENSE)

[npm-img]: https://img.shields.io/npm/v/@esri/hub-solutions.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@esri/hub-solutions
[travis-img]: https://img.shields.io/travis/Esri/hub.js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/hub.js

# @esri/hub-solutions

> Module to interact with ArcGIS Hub Solutions in Node.js and modern browsers.

### Example

```bash
npm install @esri/hub-solutions
```

## [NOT IMPLEMENTED] Coarse Grained API
The `@esri/hub-solutions` exposes both  coarse and fine grained APIs. If your application simply needs to create a Solution from a template, then the coarse grained API is for you. If your application is more focused on defining Indicators, working with multiple Solutions, in conjunction with an Initiative (i.e. the Hub), then the fine-grained api is likely a better fit.

## Get a Solution Model by Id

```js
import { getSolution  } from '@esri/hub-solutions';

getSolution("solution-item-id", requestOptions)
    .then(
      solutionItemModel => // get back "model" {item:{...}, data:{...}}
    );
```

## Get a Solution Template Model by Id

*TODO* Document the required permissions/privs required

```js
import { getSolutionTemplate  } from '@esri/hub-solutions';

getSolutionTemplate("template-item-id", requestOptions)
    .then(
      templateItemModel => // get back "model" {item:{...}, data:{...}}
    );
```


## Create a Solution as part of an Initiative 
This assumes any required Indicators are already defined as part of the Initiative

*TODO* Document the required permissions/privs required

```js
import { createInitiativeSolution  } from '@esri/hub-solutions';

createInitiativeSolution("template-item-id", "initiative-item-id", requestOptions)
    .then(
      response => console.log()
    );
```

## Create a Solution not associated with an Initiative 

*TODO* Document the required permissions/privs required

```js
import { createSolution  } from '@esri/hub-solutions';

createSolution("template-item-id", requestOptions)
    .then(
      response => console.log()
    );
```

## Remove a Solution 
This will remove the Solution item and all of it's child items.
If the Solution is associated with an Initiative (`item.properties.initiativeId` exists), it will be removed from the Initiative model's relationship hashes.

*TODO* Document the required permissions/privs required

```js
import { removeSolution  } from '@esri/hub-solutions';

removeSolution("solution-item-id", requestOptions)
    .then(
      response => console.log()
    );
```

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
