# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

### [Unreleased][HEAD]

## [1.8.1] - March 4th 2019

### @esri/hub-auth

* Fixes
  * ensure pkg.unpkg filename/path is correct [`7fb1294`](https://github.com/Esri/hub.js/commit/7fb12944060f8ebcfdb262deddead16570becfd5)

## [1.8.0] - February 25th 2019

### @esri/hub-common

* New Features
  * new functions for ArcGIS item category mapping [`4407c6a`](https://github.com/Esri/hub.js/commit/4407c6a251a6621cc31b55cb1a20915ecc218890)

### @esri/hub-events

* Fixes
  * make sure authentication is passed through and searchItems is used internally when searching events [`7785f76`](https://github.com/Esri/hub.js/commit/7785f76895dc7ed1ba790291996b8cefaf03c704)
  * short circuit when there are no sites to search [`371e642`](https://github.com/Esri/hub.js/commit/371e6423396de0af164d6e837e2ba2e2cb9a298a)


### Other Changes

* Chores
  * use pkg.unpkg to point the CDN at our UMD instead of `browser` so that webpack users can utilize the ES6. [`ee332be`](https://github.com/Esri/hub.js/commit/ee332be32f0ada505f810caa27f41f5b1c6b61cd)
* more linting (to resolve TS 3.x errors) [`61d5a98`](https://github.com/Esri/hub.js/commit/61d5a98a1dece9ce9793f45b83e22214d72a6007)

## [1.7.2] - February 13th 2019

### @esri/hub-annotations

* Fixes
  * ensure that correct summary statistics are generated when searching for annotation votes [`169656a`](https://github.com/Esri/hub.js/commit/169656ac948ab898ee90bd5299f6b469de89fa3f)

## [1.7.1] - February 12th 2019

### @esri/hub-annotations

* Fixes
  * fix incorrect `WHERE` clause construction [`36ea324`](https://github.com/Esri/hub.js/commit/36ea32466401f7a7692db4ac5d59b1a6e4944e92)
  * ensure upvotes/downvotes arent returned by `searchAnnotations()` [`4b76141`](https://github.com/Esri/hub.js/commit/4b76141d0a4e6fa72616506ad1b32cdd19de0491)
  * ensure users can delete their own upvote/downvotes [`4b76141`](https://github.com/Esri/hub.js/commit/4b76141d0a4e6fa72616506ad1b32cdd19de0491)
  * use `vote` as an annotation fieldname (instead of `value`) [`4b76141`](https://github.com/Esri/hub.js/commit/4b76141d0a4e6fa72616506ad1b32cdd19de0491)

## [1.7.0] - January 30th 2019

### @esri/hub-annotations

* New Features
  * adds functions to get the number of votes for annotations

## [1.6.1] - January 29th 2019

### @esri/hub-annotations

* Changes
  * use `OBJECTID` as unique identifier for annotations instead of `author`.

## [1.6.0] - January 29th 2019

### @esri/hub-common

* New Features
   * **hub-common**: new `maybePush` function [`5094699`](https://github.com/Esri/hub.js/commit/50946990985db3583148fd521eec7adf4dc03989)
   * **hub-common**: new `maybeAdd()` function [`cbc0a7d`](https://github.com/Esri/hub.js/commit/cbc0a7dab6c81ee9eec16799ac06c883c14481d7)

## [1.5.3] - December 20th 2018

### @esri/hub-annotations

* Changes
  * Added `voteOnAnnotation()` to enable 👍 and 👎 on other user comments.

### Other Changes

* Fixes
  * misc doc improvements for developers and contributors.

## [1.5.2] - November 29th 2018

### @esri/hub-initiatives

* Changes
  * Use the owners item url when deleting an initiative item

## [1.5.1] - November 21st 2018

### @esri/hub-annotations

* Fixes
  * added support for a new `features` constructor option on addAnnotations() to keep in sync with rest-js.

### Other Changes

* Fixes
  * fixed malformed SemVer version ranges in multiple packages.

## [1.5.0] - November 21st 2018

### @esri/hub-events

* New Features
  * new `searchEvents()` method.

### @esri/hub-annotations

* Fixes
  * `geometry` is now passed along by `searchAnnotations()`
  * annotations from anonymous users are now handled correctly by search

## [1.4.0] - October 30th 2018

### @esri/hub-annotations

* New Package!

### @esri/hub-events

* New Package!

### Other Changes

* Chores
   * **tooling**: add scripts to re-run builds in watch mode for specified packages [`5e68ba0`](https://github.com/Esri/hub.js/commit/5e68ba07de9b0a642b07421d24b1be3aa1421475) [#78](https://github.com/Esri/hub.js/issues/78)
   * **ci**: retry tests on failure (#92) [`9c23992`](https://github.com/Esri/hub.js/commit/9c23992c82f4a1382aead7b70311683926d94118)
   * **rollup**: upgrade to latest rollup and use rollup watch to re-run … [`12c22e3`](https://github.com/Esri/hub.js/commit/12c22e30812a4af1bd37851a243cf4598efbd17f)
   * **ci**: only build master branch and PRs [`a0d41ac`](https://github.com/Esri/hub.js/commit/a0d41acf5c3244fbaada4dbcc49e30f514d9ce3b)
   * **rollup**: upgrade to latest rollup and rollup-plugin-filesize [`796231e`](https://github.com/Esri/hub.js/commit/796231ef9ab71df9a5dec589f7f481dcdf42f752)
* Documentation
   * **anno search**: fix formatting of code snippet on annotations sear… [`6be767a`](https://github.com/Esri/hub.js/commit/6be767a8897c95c8c915ad6623b4c6bcba796ed3)

## [1.3.0] - September 20th 2018

### @esri/hub-sites

* Misc.
   * **sites**: rename fetchDomain(s) to getDomain(s) [`69dc88e`](https://github.com/Esri/hub.js/commit/69dc88e99bbd186d683c51978eb8face23cb24ce) [#60](https://github.com/Esri/hub.js/issues/60)

### Other Changes

* Documentation
   * **README**: replace package name/descriptoin of hub-common-types w/… [`4e21d75`](https://github.com/Esri/hub.js/commit/4e21d75be238d7a5c42e208e3f4acf4329a7e7ba)
* Chore
   * **all**: bump ArcGIS REST JS [#66](https://github.com/Esri/hub.js/pull/66)

## [1.2.0] - September 17th 2018

* New Features
  * Coarse-grained and fine-grained functions to create/remove Initiatives

## [1.1.1] - August 15th 2018

### @esri/hub-common

* New Features
  * `findBy(arr, deep.path)` now supports deep-dotting into objects inside an array.

## [1.1.0] - August 10th 2018

### @esri/hub-common

* Breaking Changes
   * package rename (from `@esri/hub-common-types` to `@esri/hub-common`)
* New Features
   * Functional utility methods for introspecting and manipulating objects and arrays. [#46](https://github.com/Esri/hub.js/pull/46)

### @esri/hub-solutions

* New Package!

### @esri/hub-auth

* New Package!

* New Features
   * wrapper method `arcgisHub.completeOAuth2` wraps the underlying `rest-js` call with additional logic to make newly created community users searchable. [#43](https://github.com/Esri/hub.js/pull/43)

### @esri/hub-annotations

* Bug Fixes
   * **annotations**: fix type errors that prevent running bootstrap and tests [`301412f`](https://github.com/Esri/hub.js/commit/301412fda6706d913843e303a71301c203e78e89) [#47](https://github.com/Esri/hub.js/issues/47)

### Other Changes

* Documentation
   * **cdn**: update cdn sample to show that deps are external [`87874dd`](https://github.com/Esri/hub.js/commit/87874dd26ebedb547afbdb96d7395b9ef27d956b)
   * **cdn**: update cdn sample to show that deps are external [`3304466`](https://github.com/Esri/hub.js/commit/3304466dee59b167a584360d57beff3cef0ce020)
* Bug Fixes
   * **annotations**: fix type errors that prevent running bootstrap and … [`07a0dfc`](https://github.com/Esri/hub.js/commit/07a0dfc151f66c220a1dbfb23c786e9e33e01fe6)

## [1.0.1] - July 12th 2018

### @esri/hub-annotations

* Bug Fixes
   * **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### @esri/hub-common-types

* Bug Fixes
   * **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### @esri/hub-initiatives

* Bug Fixes
   * **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### @esri/hub-sites

* Bug Fixes
   * **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### Other Changes

* Bug Fixes
   * **all**: treat arcigs-rest-js packages as external and bump to latest [`dc69b18`](https://github.com/Esri/hub.js/commit/dc69b18993b786380edc5ccc3a5bfe0c56ad8c8e)

## [1.0.0] - July 9th 2018

Initial Release

[1.0.0]: https://github.com/Esri/hub.js/compare/48be7ee38cd92cd342565215304f2a2979b1f822...v1.0.0 "v1.0.0"
[1.0.1]: https://github.com/Esri/hub.js/compare/v1.0.0...v1.0.1 "v1.0.1"
[1.1.0]: https://github.com/Esri/hub.js/compare/v1.0.1...v1.1.0 "v1.1.0"
[1.1.1]: https://github.com/Esri/hub.js/compare/v1.1.0...v1.1.1 "v1.1.1"
[1.2.0]: https://github.com/Esri/hub.js/compare/v1.1.1...v1.2.0 "v1.2.0"
[1.3.0]: https://github.com/Esri/hub.js/compare/v1.2.0...v1.3.0 "v1.3.0"
[1.4.0]: https://github.com/Esri/hub.js/compare/v1.3.0...v1.4.0 "v1.4.0"
[1.5.0]: https://github.com/Esri/hub.js/compare/v1.4.0...v1.5.0 "v1.5.0"
[1.5.1]: https://github.com/Esri/hub.js/compare/v1.5.0...v1.5.1 "v1.5.1"
[1.5.3]: https://github.com/Esri/hub.js/compare/v1.5.1...v1.5.3 "v1.5.3"
[1.6.0]: https://github.com/Esri/hub.js/compare/v1.5.3...v1.6.0 "v1.6.0"
[1.6.1]: https://github.com/Esri/hub.js/compare/v1.6.0...v1.6.1 "v1.6.1"
[1.7.0]: https://github.com/Esri/hub.js/compare/v1.6.1...v1.7.0 "v1.7.0"
[1.7.1]: https://github.com/Esri/hub.js/compare/v1.7.0...v1.7.1 "v1.7.1"
[1.7.2]: https://github.com/Esri/hub.js/compare/v1.7.1...v1.7.2 "v1.7.2"
[1.8.0]: https://github.com/Esri/hub.js/compare/v1.7.2...v1.8.0 "v1.8.0"
[1.8.1]: https://github.com/Esri/hub.js/compare/v1.8.0...v1.8.1 "v1.8.1"
[HEAD]: https://github.com/Esri/hub.js/compare/v1.8.1...HEAD "Unreleased Changes"
