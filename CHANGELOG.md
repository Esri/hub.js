# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased][HEAD]

## [6.4.0] - August 26th 2020

### @esri/hub-common

* New Features
   * **getPortalUrl**: take a Portal API URL and strip the /sharing/rest [`d962e050`](https://github.com/Esri/hub.js/commit/d962e05079e1a8c9352dff62ab6f7bbe8565e49e)
   * **getPortalUrl**: add support for IHubRequestOptions [`5ea0fe86`](https://github.com/Esri/hub.js/commit/5ea0fe86ccebdae854526a8d3d20306711f7f40b)
   * **getItem* functions**: update functions that use getPortalUrl to also accept IHubRequestOptions [`af8f2e01`](https://github.com/Esri/hub.js/commit/af8f2e0164adf3fa1d2ee8ed0730bc36c63ef19f)
   * **getPortalUrl**: add support for IRequestOptions [`f302041a`](https://github.com/Esri/hub.js/commit/f302041aaa4e54558eec99ae109ee3d23b602528)
   * **item url fns**: update functions that use getPortalUrl to also accept IRequestOptions [`0fbbc23a`](https://github.com/Esri/hub.js/commit/0fbbc23af9cc0ae546d3fe0d59964116234b5332)
   * **getItemThumbnailUrl**: add token if needed and support for IRequestOptions [`5b07247d`](https://github.com/Esri/hub.js/commit/5b07247d00fb082e1c2658ecfe5081f338bde213)
* Bug Fixes
   * **getItemApiUrl**: fix missing ?f=json [`083ee028`](https://github.com/Esri/hub.js/commit/083ee0287dd7c5906c99607b5e4b2e6dd084fc5c) [#330](https://github.com/Esri/hub.js/issues/330)

### @esri/hub-downloads

* New Features
   * **Added**: "where" filter to portal download requests [`0737df66`](https://github.com/Esri/hub.js/commit/0737df66ab9fd3c7b0d631082e3958314b77d21c)

### @esri/hub-initiatives

* New Features
   * **item url fns**: update functions that use getPortalUrl to also accept IRequestOptions [`0fbbc23a`](https://github.com/Esri/hub.js/commit/0fbbc23af9cc0ae546d3fe0d59964116234b5332)

### @esri/hub-sites

* New Features
   * **item url fns**: update functions that use getPortalUrl to also accept IRequestOptions [`0fbbc23a`](https://github.com/Esri/hub.js/commit/0fbbc23af9cc0ae546d3fe0d59964116234b5332)

### Other Changes

* Bug Fixes
   * **getItemApiUrl**: fix missing ?f=json [`dea1dd42`](https://github.com/Esri/hub.js/commit/dea1dd42b77121842b1461717b5b5e0dd5958b10)

* Chores
   * ensure all projects use tslib ^1.13.0
   * updated rollup-* to latest to get latest iltorb

## [6.3.0] - August 19th 2020

### @esri/hub-common

* New Features
  * **groups** `addUsersToGroups` Adds, invites or emails users about joining a group, based on the privileges of the requesting user.
  * **docs** added more guides

## [6.2.1] - August 14th 2020

### @esri/hub-common

* Bug Fixes
   * **hubApiRequest**: url should include /api/v3 [`5ca01f39`](https://github.com/Esri/hub.js/commit/5ca01f39afd667d2beeab0df1d440aff09bf653a)

## [6.2.0] - August 13th 2020

### @esri/hub-common

* New Features
   * **types**: add common Hub types needed for getContent() [`a1304061`](https://github.com/Esri/hub.js/commit/a1304061356bd96cb50e70ea84dda634a572c065)
   * **thumbnail url**: getItemThumbnailUrl() can take the portal URL instead of request options [`fd403198`](https://github.com/Esri/hub.js/commit/fd4031981e2ee7c6ed4aad215b997c62256bf74c)
   * **thumbnail url**: getItemThumbnailUrl() can take a portal object instead of request options [`1ccd5a30`](https://github.com/Esri/hub.js/commit/1ccd5a30fe14b05b23499b1565cf7481dc6a1c59)
   * **url utils**: add a utility fn to build URLs from a host, path, and queryParams [`b3c33315`](https://github.com/Esri/hub.js/commit/b3c33315c0981573c29002e1929f83465916779d)
   * **extent**: add function to create an extent from coordinates [`ee97f502`](https://github.com/Esri/hub.js/commit/ee97f502a3b3196245908fec612c704cc9bc1b2c)
   * **item urls**: add fn to get the URL of an item page in the Portal home app [`de904dd0`](https://github.com/Esri/hub.js/commit/de904dd00f02fde81cfdc96874c16e8e24b47226)
   * **item urls**: add a fn to get the portal rest api end point for an item data [`0b0f3af9`](https://github.com/Esri/hub.js/commit/0b0f3af9f3712c7825a824279b05fc09b82faaa6)
   * **item urls**: add a fn to get the URL for an item portal API endpoint [`599ae794`](https://github.com/Esri/hub.js/commit/599ae794858f963854fc2d3a8a71bfd547c57796)
   * **request**: add hubRequestApi() for making requests to the Hub API [`bfb9b698`](https://github.com/Esri/hub.js/commit/bfb9b6984da7d1e119fd57cde422571490921e7c)

### @esri/hub-content

* New Features
   * **content utils**: add a function to parse item and layer ids from dataset id [`f321a40a`](https://github.com/Esri/hub.js/commit/f321a40a9c34d310b8fcf19a6dffbf15116bfcb5)
   * **getContent**: add functions for fetching content from portal [`db56b8cd`](https://github.com/Esri/hub.js/commit/db56b8cd0b6f68940e22e715c282d925e7d61923)

### @esri/hub-downloads

* Bug Fixes
   * **downloads**: fix broken search for previously cached download files with a format-name including whitespace. Keywords actually do not require inclusion of the export-format type, since the search already includes a `type`; which refers to the export-format.
* Misc.
   * **download metadata**: remove duplicate urlBuilder fn [`feec3220`](https://github.com/Esri/hub.js/commit/feec322072c49dfc9063bdaae3310acd3227581b)

### Other Changes

* Chores
   * **linting**: configure husky to run lint-staged on ever commit [`f4e6cf24`](https://github.com/Esri/hub.js/commit/f4e6cf240036e67b8e9f52782422a6a6508094c8) [#308](https://github.com/Esri/hub.js/issues/308)
   * **linting**: add and run scripts to format TS files in each package [`c50eff30`](https://github.com/Esri/hub.js/commit/c50eff30ebcc97e860d11b1d13e0e441e74e01d3)

## [6.1.3] - August 12th 2020

### @esri/hub-common

* Bug Fixes
   * **cloneObject**: fix cloneObject's handling of Date properties [`81e6b257`](https://github.com/Esri/hub.js/commit/81e6b2577b6c2bae18bddcde8b43a34180a585c1) [#309](https://github.com/Esri/hub.js/issues/309)

### Other Changes

* Bug Fixes
   * **search**: Revert c/141567 changed Hub Page and Site Page types to Site types from Document&amp;amp;amp;quot; [`1b4732f8`](https://github.com/Esri/hub.js/commit/1b4732f88807fbc61a6c3ade6668d9f9a56e8c90)

## [6.1.2] - July 30th 2020

* Bug Fixes
  * **hub-surveys**: Fixed error that could occur in `getSurveyModels` method when no Fieldworker or Feature Service are returned. [141783](https://esriarlington.tpondemand.com/entity/141783-collaborators-can-use-sharing-quick-actions)

## [6.1.1] - July 30th 2020

* Bug Fixes
  * **hub-surveys**: Fixed error that could occur in `getSurveyModels` method when no Fieldworker or Feature Service are returned. [141783](https://esriarlington.tpondemand.com/entity/141783-collaborators-can-use-sharing-quick-actions)

## [6.1.0] - July 23rd 2020

* New Feature
  * **hub-downloads**: adds method for
    * getting metadata for a particular dataset download file from Hub API or Portal API (private/enterprise datasets)
    * requesting the export of a dataset to a particular download file format from Hub API or Portal API (private/enterprise datasets)
    * polling the status of download export from Hub API or Portal API (private/enterprise datasets)

* Changed
  * **hub-search** Pages moved from `Document` to `Site` Types

## [6.0.1] - July 20th 2020

* Changed
  * **hub-surveys**: Changed `setAccess` to only change access to survey Form and Fieldworker. [138621](https://esriarlington.tpondemand.com/entity/138621-owneradmin-can-set-sharing-level-for)

## [6.0.0] - July 16th 2020

### @esri/hub-sites

* Breaking Changes
   * **sites**: remove deprecated functions [`3e7fb63`](https://github.com/Esri/hub.js/commit/3e7fb632b2a2387ff590c7d9148db7ab6d896274) [#269](https://github.com/Esri/hub.js/issues/269)

## [5.0.0] - July 10th 2020

* Changed
  * **hub-teams**: created teams package

* Bug Fixes
  * **hub-sites**: fetching app and survey card items as dependencies during templating process
  * **hub-sites**: not including core team in templated gallery cards (https://github.com/Esri/solution.js/issues/392)

## [4.5.1] - July 2nd 2020

* Documentation
  * **hub-surveys**: Updated README. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

## [4.5.0] - July 2nd 2020

* New Feature
  * **hub-common**: Added a static logger wrapper class that logs based on the set level [130847](https://esriarlington.tpondemand.com/entity/130847-add-a-hub-logger-wrapper-method)

* Changed
  * **hub-surveys**: Changed `getStakeholderModel` to search by `Survey2Data` relationship for `formId`. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  * **hub-surveys**: Improved `getSurveyModels` performance by parallelizing `getStakeholderModel` and `getInputFeatureServiceModel` calls. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  * **hub-surveys**: Changed `getSurveyModels`, `getGroupSharingDetails`, `setAccess`, `shareWithGroup` and `unshareWithGroup` signatures to accept `formId`: `string` vs `formModel`: `IForm`. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  * **hub-surveys**: Moved `get-*` methods from `sharing` dir into `items` dir. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

## [4.4.0] - June 30th 2020

### @esri/hub-common
* New Features
  * added `isUpdateGroup`, `runRevertableTask`, and `processRevertableTasks` utility methods [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

### @esri/hub-surveys
* New Package
   * Created `hub-surveys` package [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
   * Added `setAccess`, `shareWithGroup` and `unshareWithGroup` methods [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

## [4.3.0] - June 25th 2020

### @esri/hub-common
* New Feature
  * **hub-common**: add `doesItemExistWithTitle` and `getUniqueItemTitle` [c8a869c](https://github.com/Esri/hub.js/commit/c8a869c23f69fcd89f33d390ee5339160f950481)
  * **hub-common**: added `batch` utility method that allows for serial processing of batches of concurrent tasks [131321](https://esriarlington.tpondemand.com/entity/131321-purge-script-hasntisnt-purged-the-hub)

## [4.2.2] - June 1st 2020

* New Feature
  * **hub-sites**: `updateSite` and `updatePage` send `clearEmptyFields: true` allowing item properties to be cleared [fb64477](https://github.com/Esri/hub.js/commit/fb64477ff528d770acc5a7caceb47aec2c1446e3)

## [4.2.1] - June 1st 2020

* Bug Fixes
   * **hub-sites**: allow old site item type in linkSiteAndPage [`202c2c1`](https://github.com/Esri/hub.js/commit/202c2c1f57eee635f85af612f19d6fb576611a10)

## [4.2.0] - May 27th 2020

### @esri/hub-sites

* New Features
   * **hub-sites**: added page utils

## [4.1.0] - May 21st 2020



## [4.0.0] - May 20th 2020



## [3.9.3] - May 14th 2020

### @esri/hub-common

* New Features
   * **hub-sites**: team utils

## [3.9.2] - May 11th 2020

### @esri/hub-common

* Bug Fixes
   * **hub-common**: resolve UMD Build Issues [`e60ba72`](https://github.com/Esri/hub.js/commit/e60ba72d2b8aaa9e36633842ce0a4fe9617e327c)
   * **hub-common**: removing es2017 from the tsconfig lib array [`8f13db0`](https://github.com/Esri/hub.js/commit/8f13db0df787d56566c249be27739d11384bbd36)

### @esri/hub-events

* Bug Fixes
   * **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

### @esri/hub-initiatives

* Bug Fixes
   * **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

### @esri/hub-sites

* Bug Fixes
   * **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

### @esri/hub-solutions

* Bug Fixes
   * **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

## [3.9.1] - May 6th 2020



## [3.9.0] - May 6th 2020

### @esri/hub-sites and @esri/hub-common

* New Features
   * **common**: add `interpolate` [`1f3156d`](https://github.com/Esri/hub.js/commit/1f3156d18934b16d69173753ef3236a638aa0331)

## [3.8.0] - May 4th 2020

* New Features
   * domain utils [5d2cf85](https://github.com/Esri/hub.js/commit/5d2cf85455cdc1b5966e385fd01d4a6a51f58926)

### @esri/hub-common

## [3.7.6] - May 2nd 2020

### @esri/hub-common

* Bug Fixes
   * **hub-common**: add token to resource urls [`ba72310`](https://github.com/Esri/hub.js/commit/ba72310acf8268f3900719f36be6654a08d25f54)

### Other Changes

* Bug Fixes
   * **hub-common**: add token to resource urls [`bca4e15`](https://github.com/Esri/hub.js/commit/bca4e15c02963393102dd7a7e812dc2252a6d3b0)

## [3.7.5] - April 30th 2020

### @esri/hub-initiatives
   * Bug Fixes
      * **fix hub-initiatives UMD build** [`6a38816`](https://github.com/Esri/hub.js/commit/6a388166b5da8fc2d76f7c81d9084cf6e665fc60)

### @esri/hub-common
   * Bug Fixes
      * **fix adlib import on IE** [`964febf`](https://github.com/Esri/hub.js/commit/964febf1dbae482c2a892e8392f164a0e80026ef)

## [3.7.4] - April 30th 2020



## [3.7.3] - April 29th 2020

* New Features
   * **common**: add deleteProp [`494415b`](https://github.com/Esri/hub.js/commit/494415bf4621605b215bed646722ea3116e351c1)

## [3.7.2] - April 28th 2020

### @esri/hub-common

## [3.7.1] - April 28th 2020



## [3.7.0] - April 28th 2020

* New Features
   * **common**: add isGuid and other utils [`b1c2a94`](https://github.com/Esri/hub.js/commit/b1c2a94c4c90bc5986056c173fabf5c09280e3d3)

### @esri/hub-initiatives

* Bug Fixes
   * **Fixes current initiative schema to be 2.2 so that the 2.2 migration runs**: set correct current i [`bce256c`](https://github.com/Esri/hub.js/commit/bce256cb89de5d91fbecec35b5ffb6b63e6adf3e)

## [3.6.9] - April 23rd 2020

### @esri/hub-initiatives

* Bug Fixes
   * **Fixes current initiative schema to be 2.2 so that the 2.2 migration runs**: set correct current i [`bce256c`](https://github.com/Esri/hub.js/commit/bce256cb89de5d91fbecec35b5ffb6b63e6adf3e)

## [3.6.8] - April 13th 2020

### @esri/hub-initiatives

* Bug Fixes
  * **udpateModel** Drop use of rest-js internal fn `determineOwner`

## [3.6.7] - March 30th 2020

### @esri/hub-initiatives

* Chores
   * Ensure that data.recommendedTemplates will be taken from the template and applied to the resulting model

## [3.6.6] - February 27th 2020

### @esri/hub-initiatives

* Chores
   * **migrate initiative item to create recommendedTemplates array**: migrate initiative item to crea [`239649c`](https://github.com/Esri/hub.js/commit/239649c14837a8266af8393e17101f4e9dff8b00)

## [3.6.5] - January 28th 2020

### @esri/hub-search

* Bug Fixes
   * **search**: all filters should be consistent and default to `any`

## [3.6.4] - January 28th 2020

### @esri/hub-search
* Bug Fixes
    * **search**: filter out falsey type arrays. Fixes an issue where an unsupported collection is filtered on, resulting in an undefined array of types to iterate over.

## [3.6.3] - January 27th 2020



## [3.6.2] - January 2nd 2020



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
[3.6.2]: https://github.com/Esri/hub.js/compare/v3.6.1...v3.6.2 "v3.6.2"
[3.6.3]: https://github.com/Esri/hub.js/compare/v3.6.2...v3.6.3 "v3.6.3"
[3.6.4]: https://github.com/Esri/hub.js/compare/v3.6.3...v3.6.4 "v3.6.4"
[3.6.5]: https://github.com/Esri/hub.js/compare/v3.6.4...v3.6.5 "v3.6.5"
[3.6.6]: https://github.com/Esri/hub.js/compare/v3.6.5...v3.6.6 "v3.6.6"
[3.6.7]: https://github.com/Esri/hub.js/compare/v3.6.6...v3.6.7 "v3.6.7"
[3.6.8]: https://github.com/Esri/hub.js/compare/v3.6.7...v3.6.8 "v3.6.8"
[3.7.0]: https://github.com/Esri/hub.js/compare/v3.6.8...v3.7.0 "v3.7.0"
[3.7.1]: https://github.com/Esri/hub.js/compare/v3.7.0...v3.7.1 "v3.7.1"
[3.7.2]: https://github.com/Esri/hub.js/compare/v3.7.1...v3.7.2 "v3.7.2"
[3.7.3]: https://github.com/Esri/hub.js/compare/v3.7.2...v3.7.3 "v3.7.3"
[3.7.4]: https://github.com/Esri/hub.js/compare/v3.7.3...v3.7.4 "v3.7.4"
[3.7.6]: https://github.com/Esri/hub.js/compare/v3.7.4...v3.7.6 "v3.7.6"
[3.8.0]: https://github.com/Esri/hub.js/compare/v3.7.6...v3.8.0 "v3.8.0"
[3.9.1]: https://github.com/Esri/hub.js/compare/v3.8.0...v3.9.1 "v3.9.1"
[3.9.2]: https://github.com/Esri/hub.js/compare/v3.9.1...v3.9.2 "v3.9.2"
[4.0.0]: https://github.com/Esri/hub.js/compare/v3.9.2...v4.0.0 "v4.0.0"
[4.1.0]: https://github.com/Esri/hub.js/compare/v4.0.0...v4.1.0 "v4.1.0"
[4.2.0]: https://github.com/Esri/hub.js/compare/v4.1.0...v4.2.0 "v4.2.0"
[4.2.1]: https://github.com/Esri/hub.js/compare/v4.2.0...v4.2.1 "v4.2.1"
[4.2.2]: https://github.com/Esri/hub.js/compare/v4.2.1...v4.2.2 "v4.2.2"
[4.4.0]: https://github.com/Esri/hub.js/compare/v4.2.2...v4.4.0 "v4.4.0"
[4.5.0]: https://github.com/Esri/hub.js/compare/v4.4.0...v4.5.0 "v4.5.0"
[4.5.1]: https://github.com/Esri/hub.js/compare/v4.5.0...v4.5.1 "v4.5.1"
[5.0.0]: https://github.com/Esri/hub.js/compare/v4.5.1...v5.0.0 "v5.0.0"
[6.0.0]: https://github.com/Esri/hub.js/compare/v5.0.0...v6.0.0 "v6.0.0"
[6.0.1]: https://github.com/Esri/hub.js/compare/v6.0.0...v6.0.1 "v6.0.1"
[6.1.0]: https://github.com/Esri/hub.js/compare/v6.0.1...v6.1.0 "v6.1.0"
[6.1.1]: https://github.com/Esri/hub.js/compare/v6.1.0...v6.1.1 "v6.1.1"
[6.1.2]: https://github.com/Esri/hub.js/compare/v6.1.1...v6.1.2 "v6.1.2"
[6.1.3]: https://github.com/Esri/hub.js/compare/v6.1.2...v6.1.3 "v6.1.3"
[6.2.0]: https://github.com/Esri/hub.js/compare/v6.1.3...v6.2.0 "v6.2.0"
[6.2.1]: https://github.com/Esri/hub.js/compare/v6.2.0...v6.2.1 "v6.2.1"
[6.3.0]: https://github.com/Esri/hub.js/compare/v6.2.1...v6.3.0 "v6.3.0"
[6.4.0]: https://github.com/Esri/hub.js/compare/v6.3.0...v6.4.0 "v6.4.0"
[HEAD]: https://github.com/Esri/hub.js/compare/v6.4.0...HEAD "Unreleased Changes"
