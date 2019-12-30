# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.6.1] - December 30th 2019

## [Unreleased][HEAD]



## [3.6.0] - November 18th 2019

### @esri/hub-common

* New Features
   * **support-more-than-3-countFields**: support-more-than-3-countFields [`7141bb6`](https://github.com/Esri/hub.js/commit/7141bb660ea74de3ac3fa5347f34828d360bb1b3)

### @esri/hub-search

* New Features
   * **support-more-than-3-countFields**: support-more-than-3-countFields [`7141bb6`](https://github.com/Esri/hub.js/commit/7141bb660ea74de3ac3fa5347f34828d360bb1b3)

## [3.5.0] - November 8th 2019

### @esri/hub-search

* New Features
   * **categories**: filter and aggregate by categories [`e8eb882`](https://github.com/Esri/hub.js/commit/e8eb88291b711ca55edc1edfeedc7489315dc7ef)

## [3.4.0] - November 4th 2019

### @esri/hub-common

* New Features
   * **filter-between-dates**: filter AGO items by modified date [`a6291f0`](https://github.com/Esri/hub.js/commit/a6291f0be3a6ae1bf97ee459291dd7cb282304d1)

### @esri/hub-search

* New Features
   * **filter-between-dates**: filter AGO items by modified date [`a6291f0`](https://github.com/Esri/hub.js/commit/a6291f0be3a6ae1bf97ee459291dd7cb282304d1)

## [3.3.0] - October 23rd 2019

### @esri/hub-search

* New Features
   * **support categories and license filter**: support categories and license filter [`9126679`](https://github.com/Esri/hub.js/commit/9126679426e5648bc527f76850b678f72bd3952b)

## [3.2.2] - October 15th 2019

### @esri/hub-initiatives

* Bug Fixes
   * **bump initiative schema version**: bump initiative schema version [`cb2c267`](https://github.com/Esri/hub.js/commit/cb2c267150451bb4695c82c385471b7f4ac76d62)

## [3.2.1] - September 17th 2019

* Bug Fixes
   * **common**: add `Site Page` to the type list of the `Document` category

## [3.2.0] - September 10th 2019

### @esri/hub-common

* New Features
   * **extend**: implement extend in `hub-common` [`5e0ff68`](https://github.com/Esri/hub.js/commit/5e0ff68571203ec8460c69f6d57debd2eb3a4fe7)

## [3.1.0] - September 9th 2019

### Other Changes

* Bug Fixes
   * **search**: format item extent properly [`163250e`](https://github.com/Esri/hub.js/commit/163250e0bf6589b75f95ba775cc62ab5757418c4)

## [3.0.1] - September 5th 2019

### @esri/hub-initiatives

* Bug Fixes
   * **swallow group delete failures on initiative deletion**: swallow group delete failures on initiative deletion [`e11e83d`](https://github.com/Esri/hub.js/commit/e11e83de14a464462bb81ccb9c3de5f1e81be8b1)

## [3.0.0] - September 4th 2019

* Changed
   * Migrate to new initiative schema where groupId is now stored as collaborationGroupId
   * Remove `progressCallback` from activate and remove initiative processes
   * Change `activateInitiative` and `createInitiativeModelFromTemplate` to expect a hash of groupIds corresponding to existing groups for the new initiative model

## [2.7.1] - August 30th 2019

### Other Changes

* Bug Fixes
   * **search**: multiple filters should be ANDed together [`aeeecbc`](https://github.com/Esri/hub.js/commit/aeeecbcaa3b37e054eff0449e77dfcee07701859)
   * **search**: multiple filters should be ANDed together [`b458eae`](https://github.com/Esri/hub.js/commit/b458eae66cf8181ddc8c839cede6da36db93158d)

## [2.7.0] - August 29th 2019

* New Features
   * **search**: support filters specified implicitly

## [2.6.0] - August 20th 2019



## [2.5.0] - August 15th 2019

### Other Changes

* New Features
   * **search**: use restricted option to scope search [`ce5c823`](https://github.com/Esri/hub.js/commit/ce5c823beea49553a1d8f8b35c0f66d05867693a)
   * **search**: use restricted option to scope search [`d3b699f`](https://github.com/Esri/hub.js/commit/d3b699f35fcc9962390a2f81b8883daf110bd7fd)

## [2.4.1] - August 12th 2019

### @esri/hub-search

* Bug Fixes
   * **lowercase ago param keys**: lowercase ago param keys [`708fa9f`](https://github.com/Esri/hub.js/commit/708fa9fb300620c1fb8a4c9a9a1dfc168f5a03dc)

## [2.4.0] - July 25th 2019

### @esri/hub-search

* New Features
   * **enable catalog serialization on orgId and initiativeId**: enable catalog serialization on orgId [`3316230`](https://github.com/Esri/hub.js/commit/3316230e5dd0e30bc899eb43d816d95cb0b8710b)

## [2.3.1] - July 3rd 2019

### @esri/hub-initiatives

* Bug Fixes
   * **initiatives**: do not create an open-data group when activating an initiative [`914f9ac`](https://github.com/Esri/hub.js/commit/914f9ac60437674d758e235b15b361f01e79f841)

## [2.3.0] - June 25th 2019

### @esri/hub-common

* Added
  * getType and getTypeCategories of an item

## [2.2.5] - June 25th 2019

### @esri/hub-initiatives

* Bug Fixes
   * **initiatives**: removeInitiative detaches and deletes site only if it exists in AGO [`2f53e4e`](https://github.com/Esri/hub.js/commit/2f53e4e9d59dc2b103e6928a24670a62b159b200)

## [2.2.4] - June 18th 2019

### @esri/hub-annotations

* Bug Fixes
   * **annotation users**: pass portal when getting annotation user [`458cb21`](https://github.com/Esri/hub.js/commit/458cb218ff148bab73216ddb93b8c6a9e506e7f1)

## [2.2.3] - June 12th 2019

### @esri/hub-annotations

* Bug Fixes
   * **annotation users**: pass auth when getting anno user; handle failed requests [`d8485d2`](https://github.com/Esri/hub.js/commit/d8485d20a4b2428ae9847f5ee9672df780c4a14f) [#40](https://github.com/Esri/hub.js/issues/40)

## [2.2.2] - June 7th 2019

### @esri/hub-initiatives

* Bug Fixes
  * removeInitiative removes initiative followers group

## [2.2.1] - June 5th 2019

### @esri/hub-initiatives

* Bug Fixes
  * Follow/unfollow initiative sends authOptions when fetching the initiative

## [2.2.0] - June 4th 2019

### @esri/hub-search

* Bug Fixes
   * Fixed a bug wherein a blank string did not construct AGO query properly. Added a check in place for that
   * Removed circular dependency in `computeItemsFacets` function
* Chores
   * Developed an algorithm to encode urls cleanly in `serialize` function

### @esri/hub-common

* Added
  * unique function for identifying if a value is unique in an array (useful for getting unique values in an array)

### @esri/hub-initiatives

* Changed
  * followInitiative and unfollowInitiative to account for initiative followers group

## [2.1.0] - May 14th 2019

### @esri/hub-search

* Added
   * new package! 🙏 @pranavkulkarni 🙏

## [2.0.0] - May 6th 2019

### @esri/hub-domains

* Breaking Changes
   * this package has been deprecated

### @esri/hub-sites

* Breaking Changes
   * `fetchDomain()` has been renamed to `getDomain()`
   * `fetchDomains()` has been renamed to `getDomains()`

### @esri/hub-initiatives

* Breaking Changes
   * `fetchInitiative()` has been renamed to `getInitiative()`
   * `IFollowInitiativeRequestOptions` has been renamed `IFollowInitiativeOptions`

### @esri/hub-annotations

* Breaking Changes
   * addAnnotations and updateAnnotations now expect `features` (instead of `adds` or `updates`).
   * `ISearchAnnoRequestOptions` has been renamed `ISearchAnnoOptions`
   * `IVoteRequestOptions` has been renamed `IVoteOptions`

* Bug Fixes
   * it is now possible to call `createAnnotationService()` when working with a custom portal.

### @esri/hub-events

* Breaking Changes
   * `IEventRegisterRequestOptions` has been renamed `IEventRegisterOptions`

### Other Changes

* Bug Fixes
   * Hub.js now depends on ArcGIS REST JS v2.x
   * ArcGIS REST JS packages are now listed as peerDependencies.

* Documentation
   * **book**: get doc in sync with rest-js v2.0.0 [`cc7c49d`](https://github.com/Esri/hub.js/commit/cc7c49d439c43130d3f9a6ead6c732056126b1ad)

## [1.11.1] - April 23rd 2019

### @esri/hub-common

* Fixes
  * ensure that `undefined` is returned by `getHubApiUrl()` for non-arcgis.com urls.

### @esri/hub-domains

* Fixes
  * centralize logic for returning hub urls.

## [1.11.0] - April 11th 2019

### @esri/hub-events

* New Features
   * new `getEventFeatureServiceUrl()` and `getEventServiceItem()` methods [`a7fc6be`](https://github.com/Esri/hub.js/commit/a7fc6be7613626246e4f53ce6f3e160b73b02864)
   * `getEventServiceUrl` gets the REST API [`7c9836b`]((https://github.com/Esri/hub.js/commit/7c9836b1d44e4db1c1cd6b46020d19b419f70320)

### @esri/hub-common

* Bug Fixes
   * export `getTypes` and `getCategories` methods [`0dfba00`](https://github.com/Esri/hub.js/commit/0dfba00e5cb75d95a89942f8ed0f6eae53c6d035)

## [1.10.0] - March 29th 2019

### @esri/hub-*

* New Features
   * **tree**: advertise sideEffect free code to webpack [`47bcbae`](https://github.com/Esri/hub.js/commit/47bcbaee600daa92e14cc097219886158d59548e)

### @esri/hub-events

* New Features
   * new `registerForEvent()` and `unregisterForEvent()` methods [`f4bd391`](https://github.com/Esri/hub.js/commit/f4bd391c67cc9711860ea3d49f83936d3c0bcb86)

## [1.9.0] - March 21st 2019

### @esri/hub-initiatives

* New Features
  * new methods for users to follow and unfollow initiatives [`aeef22e`](https://github.com/Esri/hub.js/commit/aeef22e9e645033bde8eff29cc3a1c01891b6db5)

### Other Changes

* Chores
   * **changelog**: ensure that CHANGELOG script generates valid diff urls [`bbb82c1`](https://github.com/Esri/hub.js/commit/bbb82c19a4772f23505a9f155e644759d22bb2e1)

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
[1.5.2]: https://github.com/Esri/hub.js/compare/v1.5.1...v1.5.2 "v1.5.2"
[1.5.3]: https://github.com/Esri/hub.js/compare/v1.5.2...v1.5.3 "v1.5.3"
[1.6.0]: https://github.com/Esri/hub.js/compare/v1.5.3...v1.6.0 "v1.6.0"
[1.6.1]: https://github.com/Esri/hub.js/compare/v1.6.0...v1.6.1 "v1.6.1"
[1.7.0]: https://github.com/Esri/hub.js/compare/v1.6.1...v1.7.0 "v1.7.0"
[1.7.1]: https://github.com/Esri/hub.js/compare/v1.7.0...v1.7.1 "v1.7.1"
[1.7.2]: https://github.com/Esri/hub.js/compare/v1.7.1...v1.7.2 "v1.7.2"
[1.8.0]: https://github.com/Esri/hub.js/compare/v1.7.2...v1.8.0 "v1.8.0"
[1.8.1]: https://github.com/Esri/hub.js/compare/v1.8.0...v1.8.1 "v1.8.1"
[1.9.0]: https://github.com/Esri/hub.js/compare/v1.8.1...v1.9.0 "v1.9.0"
[1.10.0]: https://github.com/Esri/hub.js/compare/v1.9.0...v1.10.0 "v1.10.0"
[1.11.0]: https://github.com/Esri/hub.js/compare/v1.10.0...v1.11.0 "v1.11.0"
[1.11.1]: https://github.com/Esri/hub.js/compare/v1.11.0...v1.11.1 "v1.11.1"
[2.0.0]: https://github.com/Esri/hub.js/compare/v1.11.1...v2.0.0 "v2.0.0"
[2.1.0]: https://github.com/Esri/hub.js/compare/v2.0.0...v2.1.0 "v2.1.0"
[2.1.1]: https://github.com/Esri/hub.js/compare/v2.1.0...v2.1.1 "v2.1.1"
[2.2.0]: https://github.com/Esri/hub.js/compare/v2.1.1...v2.2.0 "v2.2.0"
[2.2.1]: https://github.com/Esri/hub.js/compare/v2.2.0...v2.2.1 "v2.2.1"
[2.2.2]: https://github.com/Esri/hub.js/compare/v2.2.1...v2.2.2 "v2.2.2"
[2.2.3]: https://github.com/Esri/hub.js/compare/v2.2.2...v2.2.3 "v2.2.3"
[2.2.4]: https://github.com/Esri/hub.js/compare/v2.2.3...v2.2.4 "v2.2.4"
[2.2.5]: https://github.com/Esri/hub.js/compare/v2.2.4...v2.2.5 "v2.2.5"
[2.3.0]: https://github.com/Esri/hub.js/compare/v2.2.5...v2.3.0 "v2.3.0"
[2.3.1]: https://github.com/Esri/hub.js/compare/v2.3.0...v2.3.1 "v2.3.1"
[2.4.0]: https://github.com/Esri/hub.js/compare/v2.3.1...v2.4.0 "v2.4.0"
[2.4.1]: https://github.com/Esri/hub.js/compare/v2.4.0...v2.4.1 "v2.4.1"
[2.5.0]: https://github.com/Esri/hub.js/compare/v2.4.1...v2.5.0 "v2.5.0"
[2.6.0]: https://github.com/Esri/hub.js/compare/v2.5.0...v2.6.0 "v2.6.0"
[2.7.0]: https://github.com/Esri/hub.js/compare/v2.6.0...v2.7.0 "v2.7.0"
[2.7.1]: https://github.com/Esri/hub.js/compare/v2.7.0...v2.7.1 "v2.7.1"
[3.0.0]: https://github.com/Esri/hub.js/compare/v2.7.1...v3.0.0 "v3.0.0"
[3.0.1]: https://github.com/Esri/hub.js/compare/v3.0.0...v3.0.1 "v3.0.1"
[3.1.0]: https://github.com/Esri/hub.js/compare/v3.0.1...v3.1.0 "v3.1.0"
[3.2.0]: https://github.com/Esri/hub.js/compare/v3.1.0...v3.2.0 "v3.2.0"
[3.2.1]: https://github.com/Esri/hub.js/compare/v3.2.0...v3.2.1 "v3.2.1"
[3.2.2]: https://github.com/Esri/hub.js/compare/v3.2.1...v3.2.2 "v3.2.2"
[3.3.0]: https://github.com/Esri/hub.js/compare/v3.2.2...v3.3.0 "v3.3.0"
[3.4.0]: https://github.com/Esri/hub.js/compare/v3.3.0...v3.4.0 "v3.4.0"
[3.5.0]: https://github.com/Esri/hub.js/compare/v3.4.0...v3.5.0 "v3.5.0"
[3.6.0]: https://github.com/Esri/hub.js/compare/v3.5.0...v3.6.0 "v3.6.0"
[3.6.1]: https://github.com/Esri/hub.js/compare/v3.6.0...v3.6.1 "v3.6.1"
[HEAD]: https://github.com/Esri/hub.js/compare/v3.6.1...HEAD "Unreleased Changes"
