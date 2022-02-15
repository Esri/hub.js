Guide for Hub team on how to work with Hub.js

# Why are we moving logic into Hub.js?

We want to extract business logic from the Ember app, and move it into a strongly typed, highly-tested set of packages so we are able to...

- streamline the logic in the app itself
  - single Hub.js call, vs orchestrating a dozen rest-js calls
- provide a set of libraries for "automating" hub
- leverage the same logic in Hub Stencil components that can be used outside of the application
- encapsulate the same logic in a REST API (long-term)

# How do I move logic into Hub.js?

There are a number of common workflows when working with Hub.js and the Hub Ember application

## Adding Functions to Hub.js for use in Stencil Components

This should be the dominant workflow from July 2021 forward.

- develop Stencil component in `hub-components`, testing things in Storybook
- use existing Hub.js functions, until you need something that's not present yet
- add util to the `hub-components` repo, where you write function in typescript
- use Storybook to verify the function and the component work as you want them to
- add the function to the appropriate package in Hub.js and add tests
- open Hub.js PR, get it approved & merged
- cut a release (see Releasing section below)
- bump Hub.js version in `hub-components` and install
- re-verify component operates as expected
- PR to `hub-components`, merge, release, consume component in Hub Ember app

## Adding a Function in Hub.js that is used in a Ember route/controller/component

This is the pre-July 2021 workflow [More details here](https://github.com/ArcGIS/opendata-ui/blob/master/docs/migrate-to-hub-js.md)

- work in Ember app, creating component/route/controller etc
- use existing Hub.js functions, until you need something that's not present yet
- add a util to the Ember app, write the needed function(s) in there
- get it working the way you need it to
- PR feature into Hub app repo
- add the function to the appropriate package in Hub.js and add tests
- open Hub.js PR, get it approved & merged
- cut a release (see Releasing section below)
- bump Hub.js version in Hub App and install
- remove utility function(s)
- import functions from Hub.js package
- re-verify component/route/controller operates as expected
- PR to Hub App, removing the util, adding the Hub.js version bump

## Small changes to a Function in Hub.js

The easiest thing to do is edit the function in the Hub.js package, under `node_modules`. You can then verify it within the ember app, and when its working...

- add/update the function to the appropriate package in Hub.js and add tests
- open Hub.hs PR, get it approved & merged
- cut a release (see Releasing section below)
- bump Hub.js version in Hub App and `yarn` to install
- verify things work
- PR to Hub App to bump Hub.js package version

> **Reminder**: when you make changes to files under `node_modules` you need to re-start ember.
> **Reminder**: you will lose all changes made in `node_modules` when you `yarn`

## Large changes to a Function in Hub.js

This is where things get complex. We have a few options:

- work within the Hub.js repo, leverage "e2e" subsystem to verify actual network calls etc
- `npm link` between Hub.js and the Hub Ember app

### Hub.js e2e Tests

Hub.js has e2e test infrastructure, but it is _not_ intended to be run on a regular basis or drive code-coverage. Instead, it's a means to verify the underlying API calls, in a browser, without having to "link" into a UI app (Stencil or Hub app).

# Semantic Commit Messages

As of June 24th, 2021, pull requests to Hub.js will require at least one [conventional commit message](https://www.conventionalcommits.org/en/v1.0.0/#summary) in order to automatically generate the CHANGELOG.md entries during the release process.

The easiest way to do this is by running `npm run c` instead of `git commit...`. Alternatively you can structure your commit message so it aligns with the standard.

Pattern: `<type>(package): message`

Types: `feat,fix,docs,style,refactor,perf,test,build,ci,chore,revert`
Package: `hub-sites, hub-common etc`. This is optional if the commit touches multiple packages.

# Breaking Changes

This project follows [semantic versioning](https://semver.org/), and in general, we want to avoid breaking changes, as that requires all consuming projects to bump their versions vs automatically getting updates by using semver ranges.

If we must make a change that is breaking (typically changing fn arguments or return values), we try to stage it out as follows:

- create a new fn, with the new params, add tests etc
- add deprecation warning to old fn similar to what's shown below

````
// TODO: remove this at next breaking version
/**
 * ```js
 * import { getCategory } from "@esri/hub-common";
 * //
 * getCategory('Feature Layer')
 * > 'dataset'
 * ```
 * **DEPRECATED: Use newFunction() instead**
 * returns the Hub category for a given item type
 * @param itemType The ArcGIS item type
 * @returns the category of a given item type.
 */
export function oldFunction(itemType: string = ""): string {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use newFunction() instead. oldFunction will be removed at vX.0.0"
  );
````

- PR the change, and denote it as a `feat` which will indicate a "minor" release

This allows consumers to get the updated function, see the deprecation warning in their console, and then make changes in their app.

When we plan a major release, as part of that process we go through the codebase, searching for the `// TODO: remove this at next breaking version` comments, and removing them.

Those commits should have messages with a `!` in them to denote a breaking change

```
$ git commit -m 'refactor!: remove oldFunction'
```

That will indicate a major release is needed for that commit.

## Releasing

Currently the release process is semi-automated. And it's picky... so for now, after you get your PR approved and merge it, ask Tom or Dave to cut a release.

Longer term we want to move to automating the release process via [semantic release](https://semantic-release.gitbook.io/semantic-release/) which is a set of patterns that enables CI to automate the release process.
