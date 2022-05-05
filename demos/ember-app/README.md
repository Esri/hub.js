# Hub.js Ember Demo

This demo is used to verify that ember-auto-import dynamic and static imports work as expected with the Hub.js packages.

## Running this demo

1. Make sure you run `npm run build` in the monorepo root to setup the dependencies
1. cd into `demos/ember-app`
1. Run `npm start`
1. Load `http://localhost:4200/` in a web browser.

## Developing

This demo can be used to verify that the Hub.js code that you are developing works in Ember. To run this demo in development mode, _from the root of the monorepo_:

1. run `npm run build` (if you haven't already)
1. Run `npm run dev:ember`
1. Load `http://localhost:4200/` in a web browser.

That will start watching code in the Hub.js packages that this demo depends on and then start the ember server.

### Adding Hub.js Dependencies

To add Hub.js packages, you must:
1. stop the server (if needed)
1. add the package to this package's dependencies
1. run `npm run build` in the monorepo root
1. add the package to the `alias` and `watchDependencies` lists under the `autoImport` configuration in `ember-cli-build.js`
1. update the `dev:ember` script in the `package.json` at the monorepo root to `run dev` in that package

Below is the standard Ember-CLI generated README:

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd ember-app`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
