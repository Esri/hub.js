Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Before filing an issue

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/ArcGIS/hub.js/issues) first.  Have you found a new bug?  Want to request a new feature?  We'd [love](https://github.com/ArcGIS/hub.js/issues/new) to hear from you.

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-oss).

**Please include the following information in your issue:**
* Browser (or Node.js) version
* a snippet of code
* an explanation of
  * what you saw
  * what you expected to see

### I want to contribute, what should I work on?

We're just getting started so even just telling us what you want to see would be extremely helpful!

### Getting a development environment set up

You don't _have to_ but we recommend installing TypeScript, TSLint, Prettier and EditorConfig extensions for your editor of choice.

* https://atom.io/packages/atom-typescript
* https://github.com/Microsoft/TypeScript-Sublime-Plugin
* etc...

### Running the tests

@esri/hub.js has a comprehensive test suite built with [Vitest](https://vitest.dev/) The tests can be found in `/packages/*/test/`.

You can run _all_ the tests with `npm test` and continuously re-run tests as you make changes to source or test files w/ `npm test:watch`.

### Formatting commit messsages

Using [`npm run c`](https://github.com/Esri/hub.js/blob/4aeb8f23c3c91beaf44c05ac32278e5a22b5a69e/package.json#L112) (instead of `git commit`) creates commit messages that our handy [script](https://github.com/Esri/arcgis-rest-js/blob/master/support/changelog.js) can parse to categorize your bug fix, new feature or breaking change and associate it with relevant packages to update our [CHANGELOG](CHANGELOG.md) automatically the next time we :rocket: a release.

This isn't mandatory, but it is pretty cool. :sparkles:

### Building the documentation site locally.

We use TypeDoc and acetate to turn the inline documentation into a snazzy website.

* `npm run docs:serve` > http://localhost:3000

### Publishing a release

The release tooling in this repo is based on arcgis-rest-js, so see [those release instructions](https://github.com/Esri/arcgis-rest-js/blob/master/RELEASE.md).
