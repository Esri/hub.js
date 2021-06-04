# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [8.4.2] - May 31st 2021

### Other Changes

* Bug Fixes
   * **content**: prefer item extent from dataset) [`8fac706e`](https://github.com/Esri/hub.js/commit/8fac706eb997003f94e70e36eb5c61744bca792f)

## [8.4.1] - May 22nd 2021

### @esri/hub-content
- Bug Fixes
  - **content** export `getContentMetadata()` from the root

## [8.4.0] - May 19th 2021

### Other Changes

- New Features
  - **content**: getContent now includes metadataUpdatedDate, metadataUpdatedDateSouce, metadataUpdatedDatePrecision, updatedDatePrecision, &amp;amp; publishedDatePrecision

## [8.3.1] - April 27th 2021

### Other Changes

* Chores
   * **demos**: add an Ember application demo [`a0eec085`](https://github.com/Esri/hub.js/commit/a0eec08540bc8641ed63bef965eea7c6b7c74476) [#506](https://github.com/Esri/hub.js/issues/506)
   * **demos**: add a node demo [`8efca64a`](https://github.com/Esri/hub.js/commit/8efca64a86279d0eca661fee3777bc92d2b7c95f)
   * **everything**: use es2017 as default ESM build; add Ember dev script [`f9ffcdf7`](https://github.com/Esri/hub.js/commit/f9ffcdf7f4f8b5f2d5aa26c2f83f4107b3f1dbcb)
* Bug Fixes
   * **content**: update datasetToContent method to add isProxied property to result [`c86968e9`](https://github.com/Esri/hub.js/commit/c86968e9f514fec04edd378b947ec181bbf1e803) [#https://devtopia.esri.com/dc/hub/issues/71](https://github.com/Esri/hub.js/issues/https://devtopia.esri.com/dc/hub/issues/71)

## [8.3.0] - April 16th 2021

### Other Changes

- Chores
  - **demos**: add a webpack demo [`cae0f6ac`](https://github.com/Esri/hub.js/commit/cae0f6acef637fff53d3970940f8193359c9ea8e)
- Bug Fixes
  - **hub-teams**: content teams membershipAccess set to everyone [`e645669f`](https://github.com/Esri/hub.js/commit/e645669f56a233f2a0d6101b33f8dd22e84ac037)

## [8.2.2] - April 14th 2021

### Other Changes

- Bug Fixes
  - **hub-teams**: hub Basic core teams should default to membershipAccess of collaboration [`84e68f75`](https://github.com/Esri/hub.js/commit/84e68f75467bfcefd412314967bdc6e327d54f35)

## [8.2.1] - April 9th 2021

- New Features
  - **sites** `shareItemsToSiteGroups` function is officially public
  - **sites** added `getTeamById`, `getTeamMembers`, `searchTeamMembers` and `searchTeamContent` functions

## [8.2.0] - April 2nd 2021

### Other Changes

- New Features
  - **hub-common**: adds a setProp utility [`c6290e69`](https://github.com/Esri/hub.js/commit/c6290e690d4e1b6acc6e96293219f2a3d36a4d86)
  - **site drafts**: site drafts will now contain a schema version [`963d11fd`](https://github.com/Esri/hub.js/commit/963d11fd62b2debe0d03fdc11f3a3c1acf5854e6)
- Bug Fixes
  - **site drafts**: applying schema migrations to site drafts [`aa4a03ae`](https://github.com/Esri/hub.js/commit/aa4a03ae9bc55d5358378cb29008c6a87be584a5) [#498](https://github.com/Esri/hub.js/issues/498)
  - **update-site**: update site runs migrations on the site model before performing a &amp;amp;amp;amp;amp;amp;amp;amp;quot;patch&amp;amp;amp;amp;amp;amp;amp;amp;quot; [`08a57943`](https://github.com/Esri/hub.js/commit/08a579432adf77120fe00826b0f16046850716ef)

## [8.1.0] - March 31st 2021

### Other Changes

- New Features
  - **content**: getContent now always fetches the item from the AGO API when authenticated [`50c7f414`](https://github.com/Esri/hub.js/commit/50c7f41406601aed95e4cf52dc8c15353aedf8f7)

## [8.0.0] - March 29th 2021

### Other Changes

- Breaking Changes
  - **content**: remove comingSoon() [`4d435545`](https://github.com/Esri/hub.js/commit/4d4355453b06d3b8fd1afe700ee22ecaa835d9e2)
  - **common**: remmove getType() [`66be1efa`](https://github.com/Esri/hub.js/commit/66be1efa611e2bcca1e21a35dbba421ad9847c3c)
  - **sites**: remove no-op fns for un/linkig sites &amp;amp;amp;amp;amp;amp;amp;amp;amp;amp; pages [`40e47c1a`](https://github.com/Esri/hub.js/commit/40e47c1aeb9b904c1ebbe847ad029c680d47d16b)
  - **sites**: move `updateSite()`&amp;amp;amp;amp;amp;amp;amp;#39;s `allowList` tp options [496](https://github.com/Esri/hub.js/pull/496)
  - **sites**: move `updatePage()`&amp;amp;amp;amp;amp;amp;amp;#39;s `maybePatchList` to `options.allowList` [496](https://github.com/Esri/hub.js/pull/496)
- Bug Fixes
  - **Site drafts and migrations**: do not update schemaVersion when updating publish status when creat [`19db57fc`](https://github.com/Esri/hub.js/commit/19db57fc6ae1bf295f5c040c6cadd1301a539083)

## [7.3.2] - March 25th 2021

### Other Changes

- Bug Fixes
  - **hub teams package**: ensure `canUserCreateTeamInProduct` checks if the current user has &amp;amp;amp;amp;amp;amp;amp;amp;gt;507 groups, and returns false if they do. Since these checks will run before the teams are created, and the max anticipated teams that would be created in a single operation would be 5, and the max number of groups is 512, we chose 507 as the cut-off. [`e27fdb4`](https://github.com/Esri/hub.js/pull/495/commits/e27fdb442854b0aff5394bd84a9f3f89fd7d1435)

## [7.3.1] - March 24th 2021

### Other Changes

- Bug Fixes
  - **hub teams package**: update well known teams to account for 9.1 online changes around permissions [`2b686893`](https://github.com/Esri/hub.js/commit/2b686893a7fa42c1c7225c55c83e8e98fe83c1c3)

## [7.3.0] - March 16th 2021

### Other Changes

- New Features
  - **hub-downloads**: add disabled download state
    [`2b4874a4`](https://github.com/Esri/hub.js/commit/2b4874a4b7a93836c803008ce14921324db38b30)

## [7.2.0] - March 15th 2021

### Other Changes

- New Features
  - **everything**: distribute es2017 build [`9755530a`](https://github.com/Esri/hub.js/commit/9755530a3fc3ed9b3578626eabfff6144f98115f) [#488](https://github.com/Esri/hub.js/issues/488)

## [7.1.1] - March 9th 2021

### Other Changes

- Bug Fixes
  - **hub-sites**: ensure that we respect interpolation of site title [`188e88c6`](https://github.com/Esri/hub.js/commit/188e88c69086c06bbfaed28040667d1a102eb525)

## [7.1.0] - March 5th 2021

### Other Changes

- New Features
  - **common**: cleanly pass rootCause forward in OperationError, add docs [`386fff4b`](https://github.com/Esri/hub.js/commit/386fff4be21fb6c3def44012447644601513377d)
  - **content**: add date enrichments to content [`2333c124`](https://github.com/Esri/hub.js/commit/2333c124d8f5d5142f3a63a3daee8d32da00f31c)

## [7.0.9] - February 26th 2021

### Other Changes

- Chores
  - **everything**: adding rest-js 3 to peer dep ranges [`e3bd9012`](https://github.com/Esri/hub.js/commit/e3bd90121ff30fb54bcb44c6530a328aed154cae) [#473](https://github.com/Esri/hub.js/issues/473)

## [7.0.8] - February 24th 2021

- Bug Fixes
  - **downloadss**: Alter `typekeywords` for item and layer index so that search queries don&amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;#39;t fail for datasets with layer index `1` (#472) [`19da868`](https://github.com/Esri/hub.js/commit/19da86833a91dd007384ef1887081e17568c9e9e)

## [7.0.7] - February 22nd 2021

- Bug Fixes
  - **commmon**: Export `OperationStack` and `OperationError` which were added months ago, but just not exported

## [7.0.6] - February 18th 2021

### Other Changes

- Bug Fixes
  - **downloadss**: use key `typekeywords` in POSTs to Portal /update (#470) [`5c54d6d`](https://github.com/Esri/hub.js/commit/5c54d6d328e45e90cea34c622d4be7cb4ea5489f)

## [7.0.5] - February 3rd 2021

Addresses failed release

## [7.0.4] - February 3rd 2021

Attempt to address failed release

## [7.0.3] - February 3rd 2021

- New Features
  - **datasetToItem**: now includes contentStatus

## [7.0.2] - February 2nd 2021

### Other Changes

- Bug Fixes
  - **sites**: remove download sidepanel capability from the site template (#461) [`c7b514ee`](https://github.com/Esri/hub.js/commit/c7b514eeecceb63c8abca1a012343c56f8d4b7e4)

## [7.0.1] - January 27th 2021

- New Features
  - **search**: add merge function for aggregations (#450) [`56de3de8`](https://github.com/Esri/hub.js/commit/56de3de89c1fc47a5564297372e52e9072065fad)

## [7.0.0] - January 26th 2021

### Other Changes

- Code Style
  - **use hostname instead of domain prop on domain entry**: use hostname instead of domain prop on d [`d62e0002`](https://github.com/Esri/hub.js/commit/d62e00021a097051b6178a33ed64ef1cfb1c200e)

## [6.24.0] - January 26th 2021

- New Features
  - **downloads**: add support of ready_unknown status for portal (#458) [`4fe9f2914`](https://github.com/Esri/hub.js/commit/f4fe9f291446406e65282f2fdfbdc633cec85d75)
  - **downloads**: added target change to allow locking of private non-enterprise datasets [`6596ac96c`](https://github.com/Esri/hub.js/commit/6596ac96c1dda7464a573b03673cf19377abf681)
  - **sites**: enable the new download sidebar capability by default (#460) [`9441efc30`](https://github.com/Esri/hub.js/commit/9441efc301ad5e235f187707b96f0cefca23ef28)

## [6.23.0] - January 22nd 2021

- New Features
  - **getContent**: now accepts an `IModel` object [4e9b21e](https://github.com/Esri/hub.js/commit/4e9b21ec831113859919d55da58496a0532939e9)

## [6.22.3] - January 21st 2021

### Other Changes

- Bug Fixes
  - **annotations**: throw error when all adds or updates fail [`e1c08555`](https://github.com/Esri/hub.js/commit/e1c08555d43ace22ff423bf9456d824515563b2c) [#430](https://github.com/Esri/hub.js/issues/430)

## [6.22.2] - January 12th 2021

### Other Changes

- Bug Fixes
  - **sites**: fix logic for site url on portal [`d10c5058`](https://github.com/Esri/hub.js/commit/d10c5058c9bb8a4630489e5b77d341fcce589981)

## [6.22.1] - January 7th 2021

### Other Changes

- Bug Fixes
  - **sites**: coerce numeric site title to string [`0cb6a740`](https://github.com/Esri/hub.js/commit/0cb6a740e3bd296dc67494b9b2cb6d2260b77b86)
  - **sites**: derive domain from title unless title includes unicode chars [`72b892cc`](https://github.com/Esri/hub.js/commit/72b892ccb6ce88eb167c055b011c708b68f3dd1c)

## [6.22.0] - January 7th 2021

- New Features
  - **pollDownloadMetadata**: can determine if hub dataset exports without tracking dates are finished [9bc03d1](https://github.com/Esri/hub.js/commit/9bc03d141f45d354ce3c5a1174130a5b9f9ead66)

## [6.21.1] - January 4th 2021

### Other Changes

- Bug Fixes
  - **downloads**: portalRequestDownloadMetadata() function did not recongize layer id (#444) [`163ad99`](https://github.com/Esri/hub.js/commit/163ad999b6dee4d27509c2a731029742de712289)

## [6.21.0] - December 18th 2020

### @esri/hub-content

- Bug Fixes
  - **content**: add structuredLicense to content from dataset [`ba8bb967`](https://github.com/Esri/hub.js/commit/ba8bb967f0fb91d280e9e8849517a44b73e0ad79)

## [6.20.1] - December 18th 2020

### @esri/hub-common

- Bug Fixes
  - **common**: fix umd build not bundling adlib [`95634176`](https://github.com/Esri/hub.js/commit/956341762122233c4b3824fb4ff31f12cb44ca8d)

## [6.20.0] - December 15th 2020

### @esri/hub-sites

- New Features
  - **createSiteModalFromTemplate**: now creates initiative items on basic orgs [b4f0116](https://github.com/Esri/hub.js/commit/b4f0116efb0ec12b4698f28203d91b127c7919d4)

## [6.19.1] - December 1st 2020

### @esri/hub-content

- Bug Fixes
  - **getItemThumbnailUrl**: re-add support for unsupported options.width [`c0f455d2`](https://github.com/Esri/hub.js/commit/f95f3c73a5d1f6d0d670bd7f193a316104f3a42d)

## [6.19.0] - November 18th 2020

### @esri/hub-downloads

- New Features
  - **downloads** - support multilayer items in portal download metadata request
- Bug Fixes
  - **downloads** - for portal metadata, search for CSV Collection or KML collection if item is multilayer and format is CSV or KML

## [6.18.0] - November 13th 2020

- New Features
  - **common** - new utils `last`, `filterBy`, `uniqueBy`, and classes `OperationStack` and `OperationError`

## [6.17.0] - November 11th 2020

### Other Changes

- Bug Fixes
  - **hub-teams**: respect org-level public sharing flag [`5933a5c8`](https://github.com/Esri/hub.js/commit/5933a5c8f88bdace52d327876381d42ad60eaf5b)

## [6.16.0] - November 9th 2020

### Other Changes

- New Features
  - **fetchAllPages**: adds a function to fetch all pages of a search in batches [`a81b6ee1`](https://github.com/Esri/hub.js/commit/a81b6ee1ee8d499a049085ed314f4a4bedcceead)

## [6.15.0] - November 3rd 2020

### @esri/hub-common

- New Features
  - **common**: add IHubContent.isDownloadable and isDownloadable(content) [`d6f8c0b9`](https://github.com/Esri/hub.js/commit/d6f8c0b99241efccff26215bc02fb65f316fec8d)

### @esri/hub-content

- New Features
  - **content**: getContent() populates content.isDownloadable [`d6f8c0b9`](https://github.com/Esri/hub.js/commit/d6f8c0b99241efccff26215bc02fb65f316fec8d)

## [6.14.0] - October 28th 2020

### Other Changes

- New Features
  - **hub-sites**: add getMembers function [`90323218`](https://github.com/Esri/hub.js/commit/9032321872d91d66e520cac70f7f1907839c1d1d)
  - **hub-sites**: add getMembers function [`a1be1466`](https://github.com/Esri/hub.js/commit/a1be1466ce922649843e39a0e36b0aa2ad7e16b5)
  - **hub-sites**: adds socialSharing as default capability for non-ent… (#412) [`0b0feee6`](https://github.com/Esri/hub.js/commit/0b0feee6b2599f9496e30ce81b27382f442775d9)
- Bug Fixes
  - **common**: bump adlib for bug fix [`0b40037a`](https://github.com/Esri/hub.js/commit/0b40037a6eaa4f4963200b7533d25150047a73d7)

## [6.13.3] - October 22nd 2020

### @esri/hub-common

- Bug Fixes
  - **getItemThumbnailUrl**: drop support for unsupported options.width [`c0f455d2`](https://github.com/Esri/hub.js/commit/c0f455d2f8fcf5a474a88ef06e81f5fd884ac30e)

### @esri/hub-content

- Bug Fixes
  - **withPortalUrls**: pass token when calling from withPortalUrls() [`b7cfcad8`](https://github.com/Esri/hub.js/commit/b7cfcad8f55b38b96696da5fc7c6875301cdead2)

## [6.13.2] - October 20th 2020

### @esri/hub-common

- Bug Fixes
  - `Solution` collection now exported [`1e4e50a`](https://github.com/Esri/hub.js/commit/1e4e50ae66ca5cc44532ec5d5492c6f663a94838)

### Other Changes

- Misc.
  - **members**: remove unused members package [`ac138337`](https://github.com/Esri/hub.js/commit/ac13833749992f2fd6690d0bc517c1b996478446)

## [6.13.1] - October 16th 2020

### @esri/hub-common, @esri/hub-content

- Bug Fixes
  - `Solution` items moved into own collection, data still fetched in `getContent` [`d83d5857`](https://github.com/Esri/hub.js/commit/5208cfa869f0e7451fe92a75dbe3787fe3f67ce8)

## [6.13.0] - October 16th 2020

### Other Changes

- New Features

  - **getContent**: fetch item data for templates [`6e8835ff`](https://github.com/Esri/hub.js/commit/6e8835ffe4349b2c327e98ccfd2dacb717a8c95e)
  - **getContent**: ensure orgId for hub created content [`d5fc9e41`](https://github.com/Esri/hub.js/commit/d5fc9e418346bdbb27b23ef2d59877c6b9c51bd2) [#401](https://github.com/Esri/hub.js/issues/401)

- Bug Fixes
  - **HubType**: remove trailing space from map and app types [`d83d5857`](https://github.com/Esri/hub.js/commit/d83d58579f931088754f40f9eb85aa9d1f7549b2)

## [6.12.1] - October 14th 2020

### @esri/hub-sites

- Bug Fixes
  - **getPaths**: fix summary statistic cards not returning dependencies [`9ff1ecd4`](9ff1ecd43433a52e4998f4b48c1b31365cfe85ad)

## [6.12.0] - October 14th 2020

### Other Changes

- New Features

  - **getContent**: return a property w/ an array of any errors that happened during composition [`b78696d5`](https://github.com/Esri/hub.js/commit/b78696d564a13b82e760937c7f74ee5bb59645de)
  - **getContent**: return item group ids [`b0b8401f`](https://github.com/Esri/hub.js/commit/b0b8401fa72b45fd27797fb6b48c34d00ed4c107)

- Misc.
  - **change domain service url to v3 api**: change domain service url to v3 api [`fc34df84`](https://github.com/Esri/hub.js/commit/fc34df84d51b00ec01ef5a01689761c6a4193ebf)
  - **change params for \_getDomainServiceUrl**: \_getDomainServiceUrl takes hubApiUrl string instea [`f1592b8e`](https://github.com/Esri/hub.js/commit/f1592b8eccc05379733698a7e41c6c85c19bbf17)

## [6.11.3] - October 8th 2020

### @esri/hub-sites

- Bug Fixes
  - **change domain service url to v3 api**: change domain service url to v3 api [`fc34df84`](https://github.com/Esri/hub.js/commit/fc34df84d51b00ec01ef5a01689761c6a4193ebf)

## [6.11.2] - October 5th 2020

### Other Changes

- Bug Fixes
  - **collections**: treat city engine web scenes as apps, not maps [`f06bff04`](https://github.com/Esri/hub.js/commit/f06bff042f8529af2f3b0a81180c3efdf7f668f3)
  - **collections**: add missing Urban Model to app collection [`53785847`](https://github.com/Esri/hub.js/commit/53785847e9be491f2942b5fbe4e0358fb6a06d97)

## [6.11.1] - October 5th 2020

- Bug Fixes
- **getContent**: now parses categories for private data and stores originals on `content.itemCategories`. [`5298969`](https://github.com/Esri/hub.js/commit/529896996887506da4e47b3c977d6cda6f3239a3)
- Chores
- **getDraftResource**: now uses `getItemResource` from `rest-portal` [`c41dd7f4`](https://github.com/Esri/hub.js/commit/c41dd7f4d25ac45c8b725e3552dd20e9e78d74af)

## [6.11.0] - September 22nd 2020

### @esri/hub-surveys

- New Features
  - **surveys**: add survey status methods (#378) [`c63ba14a`](https://github.com/Esri/hub.js/commit/c63ba14a98b4ae8bd6a0ee12aa1d3dc558792a4e)

### Other Changes

- Chores
  - **lerna**: hoist package dependencies to the root; add script to clean dependencies [`19e8c603`](https://github.com/Esri/hub.js/commit/19e8c603f5c3ea639166ff6a24394158e2dd3217) [#363](https://github.com/Esri/hub.js/issues/363)
- Misc.
  - **types**: remove hub-types and move types into other packages [`82f50dd9`](https://github.com/Esri/hub.js/commit/82f50dd981784478906177275a88651854f98d0f)
  - **auth**: remove hub-auth and move auth functions to hub-common [`674d3f52`](https://github.com/Esri/hub.js/commit/674d3f52f40ea400eb7b308ccf0ddef21396335b)

## [6.10.0] - September 17th 2020

### @esri/hub-content

- New Features
  - **datasetToContent**: add metadata [`f5014531`](https://github.com/Esri/hub.js/commit/f50145317008d780f75e782749edc0414487537c)
  - **getContentMetadata**: add a function to fetch item metadata and return it as JSON [`0e2712b3`](https://github.com/Esri/hub.js/commit/0e2712b3282ae3a2fbaab7fc3624e3f3c15470cf) [#353](https://github.com/Esri/hub.js/issues/353)
  - **slugs**: expose isSlug, addContextToSlug, and removeContextFromSlug functions [`eece2b3d`](https://github.com/Esri/hub.js/commit/eece2b3dd5c6ce1d0a243c56e120ff1c205d8fac)
  - **getContentFromPortal**: return item metadata parsed as XML if it exists [`7bbce079`](https://github.com/Esri/hub.js/commit/7bbce0792a9945bccb02e3ae3e199ccadc7368e9)

## [6.9.1] - September 8th 2020

### @esri/hub-content

- Bug Fixes
  - **getContentFromHub**: return first record when filtering by slug [`0f5b34d8`](https://github.com/Esri/hub.js/commit/0f5b34d8e9cf9f67c8fa04d4e4dc58de72a6a8b5) [#372](https://github.com/Esri/hub.js/issues/372)

### Other Changes

- Bug Fixes
  - **getContentFromHub**: return first record when filtering by slug [`fc16e3fa`](https://github.com/Esri/hub.js/commit/fc16e3fad3e96b08088cf83af7768b7fecb9afcc)

## [6.9.0] - September 8th 2020

### @esri/hub-common

- New Features
  - **normalizeItemType**: solution type normalization, normalizedType in content [`2103d7d8`](https://github.com/Esri/hub.js/commit/2103d7d85089f94cc443e4432acb054ce6ab8688) [#367](https://github.com/Esri/hub.js/issues/367) [#366](https://github.com/Esri/hub.js/issues/366)

### @esri/hub-content

- New Features
  - **normalizeItemType**: solution type normalization, normalizedType in content [`2103d7d8`](https://github.com/Esri/hub.js/commit/2103d7d85089f94cc443e4432acb054ce6ab8688) [#367](https://github.com/Esri/hub.js/issues/367) [#366](https://github.com/Esri/hub.js/issues/366)

## [6.8.0] - September 4th 2020

### @esri/hub-common

- New Features
  - **getItemThumbnailUrl**: add support for specifying width of thumbnail [`9c71627b`](https://github.com/Esri/hub.js/commit/9c71627b2805f274cd8223cbdfb78625bedbad72)
  - **normalizeItemType**: deprecates `getType` and adds support for Hub Initiative Template types [`78a6fe0d`](https://github.com/Esri/hub.js/commit/78a6fe0d758e115c0b0ecc5f170ac913591153e2)
  - **collections**: add template collection, getHubItemType only accepts items [`57b783a2`](https://github.com/Esri/hub.js/commit/57b783a242b7a2747db0dbc7fce57155c56ad93f) [#347](https://github.com/Esri/hub.js/issues/347) [#354](https://github.com/Esri/hub.js/issues/354)

### @esri/hub-content

- Bug Fixes
  - **normalizeItemType**: getType =&amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;gt; normalizeItemType, support for Hub Initiative Template types [`78a6fe0d`](https://github.com/Esri/hub.js/commit/78a6fe0d758e115c0b0ecc5f170ac913591153e2)
  - **collections**: add template collection, getHubItemType only accepts items [`57b783a2`](https://github.com/Esri/hub.js/commit/57b783a242b7a2747db0dbc7fce57155c56ad93f) [#347](https://github.com/Esri/hub.js/issues/347) [#354](https://github.com/Esri/hub.js/issues/354)

### @esri/hub-sites

- Bug Fixes
  - **normalizeItemType**: getType =&amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;gt; normalizeItemType, support for Hub Initiative Template types [`78a6fe0d`](https://github.com/Esri/hub.js/commit/78a6fe0d758e115c0b0ecc5f170ac913591153e2)

### Other Changes

- New Features
  - **committing**: npm run c will tell you if no staged changes immediately [`b3fe3db9`](https://github.com/Esri/hub.js/commit/b3fe3db969d9e516bfedb0109d610d197cb178fb)
  - **getItemThumbnailUrl**: add support for specifying width of thumbnail [`5e27c7fd`](https://github.com/Esri/hub.js/commit/5e27c7fd781787a321040754cb6885cf455f74ef)

## [6.7.2] - September 3rd 2020

### @esri/hub-content

- Bug Fixes

  - **itemToContent**: handles empty extent [`d696e453`](https://github.com/Esri/hub.js/commit/d696e453fbbbb5254ce2055053164f1fd22f6f3c)

## [6.7.1] - September 3rd 2020

### @esri/hub-sites

- Bug Fixes
  - **updatePage**: updatePage now supports the old call signature [`1c17d461`](https://github.com/Esri/hub.js/commit/1c17d46177663b2a1051add2dce0fb9fe2032c4a)

## [6.7.0] - September 2nd 2020

### @esri/hub-common

- New Features
  - **hubApiRequest**: add support for request.params [`2882c685`](https://github.com/Esri/hub.js/commit/2882c68502fb083af72c9433142310855a624a19)

### @esri/hub-content

- New Features
  - **dataset slugs**: add isSlug() to determine if an identifier is a slug [`e6462675`](https://github.com/Esri/hub.js/commit/e64626756f7d136945f308c1f32fddc8a1847dce)
  - **dataset slugs**: add addContextToSlug() to prefix slug with context (orgKey) [`0d326630`](https://github.com/Esri/hub.js/commit/0d3266303a5fa1643c089d4f5f8bf96e924654f1)
  - **dataset slugs**: add removeContextFromSlug() to remove context (orgKey) from slugs [`88ba30c0`](https://github.com/Esri/hub.js/commit/88ba30c08d0bfcfd012f360da13095bc043615df)
  - **getContent**: add support for slugs as well as ids [`c2e2623b`](https://github.com/Esri/hub.js/commit/c2e2623b7dd71735ea4e6572879d77e98af175ff) [#320](https://github.com/Esri/hub.js/issues/320)

### @esri/hub-sites

- Bug Fixes
  - **updateSite**: updateSite no longer attempts to remove unused resources [`ee8d8e18`](https://github.com/Esri/hub.js/commit/ee8d8e184adde57fe9b93de0425c6ff7176718b7)

## [6.6.1] - September 1st 2020

- Bug Fixes
  - **updating sites and page**: no longer attempts to remove unused resources [d6fc827](https://github.com/Esri/hub.js/commit/d6fc8276bb5eb9dbeca21f3226ccd397a3f880e6) [5c31afe](https://github.com/Esri/hub.js/commit/5c31afe35c642b032a320665bc9eddba07c0152a)

## [6.6.0] - September 1st 2020

### @esri/hub-common

- New Features
  - **getCollection**: add a function to return the Hub collection for a given item type [`017f2252`](https://github.com/Esri/hub.js/commit/017f225296d8fc2d545a0c7aa8b00318cbc01b92)

### @esri/hub-content

- Bug Fixes
  - **getItemHubType**: return feedback for items of type Form [`53d845f6`](https://github.com/Esri/hub.js/commit/53d845f6524a1688a3ce431fb2afda75d1560bd6) [#336](https://github.com/Esri/hub.js/issues/336)

## [6.5.1] - August 31st 2020

### @esri/hub-content

- Bug Fixes
  - **getContent**: fix handle un-indexed (usually private) content [`f8a2592f`](https://github.com/Esri/hub.js/commit/f8a2592f21017c5304f43ad6fe8bdb7e974082fd) [#341](https://github.com/Esri/hub.js/issues/341)

## [6.5.0] - August 31st 2020

### @esri/hub-sites

- New Features
  - **Added**: isPage and isSite utilities [`836d9ba`](https://github.com/Esri/hub.js/commit/836d9ba7e15ea73f33750f16b071baf855d60610)
- Bug Fixes
  - **draft support**: saving drafts now works for web mapping application sites [`3ae82d8`](https://github.com/Esri/hub.js/commit/3ae82d826eae7cac90be7a0e47c9ef26c38bcb28)

## [6.4.0] - August 26th 2020

### @esri/hub-common

- New Features
  - **getPortalUrl**: take a Portal API URL and strip the /sharing/rest [`d962e050`](https://github.com/Esri/hub.js/commit/d962e05079e1a8c9352dff62ab6f7bbe8565e49e)
  - **getPortalUrl**: add support for IHubRequestOptions [`5ea0fe86`](https://github.com/Esri/hub.js/commit/5ea0fe86ccebdae854526a8d3d20306711f7f40b)
  - **getItem\* functions**: update functions that use getPortalUrl to also accept IHubRequestOptions [`af8f2e01`](https://github.com/Esri/hub.js/commit/af8f2e0164adf3fa1d2ee8ed0730bc36c63ef19f)
  - **getPortalUrl**: add support for IRequestOptions [`f302041a`](https://github.com/Esri/hub.js/commit/f302041aaa4e54558eec99ae109ee3d23b602528)
  - **item url fns**: update functions that use getPortalUrl to also accept IRequestOptions [`0fbbc23a`](https://github.com/Esri/hub.js/commit/0fbbc23af9cc0ae546d3fe0d59964116234b5332)
  - **getItemThumbnailUrl**: add token if needed and support for IRequestOptions [`5b07247d`](https://github.com/Esri/hub.js/commit/5b07247d00fb082e1c2658ecfe5081f338bde213)
- Bug Fixes
  - **getItemApiUrl**: fix missing ?f=json [`083ee028`](https://github.com/Esri/hub.js/commit/083ee0287dd7c5906c99607b5e4b2e6dd084fc5c) [#330](https://github.com/Esri/hub.js/issues/330)

### @esri/hub-downloads

- New Features
  - **Added**: where filter to portal download requests [`0737df66`](https://github.com/Esri/hub.js/commit/0737df66ab9fd3c7b0d631082e3958314b77d21c)

### @esri/hub-initiatives

- New Features
  - **item url fns**: update functions that use getPortalUrl to also accept IRequestOptions [`0fbbc23a`](https://github.com/Esri/hub.js/commit/0fbbc23af9cc0ae546d3fe0d59964116234b5332)

### @esri/hub-sites

- New Features
  - **item url fns**: update functions that use getPortalUrl to also accept IRequestOptions [`0fbbc23a`](https://github.com/Esri/hub.js/commit/0fbbc23af9cc0ae546d3fe0d59964116234b5332)

### Other Changes

- Bug Fixes

  - **getItemApiUrl**: fix missing ?f=json [`dea1dd42`](https://github.com/Esri/hub.js/commit/dea1dd42b77121842b1461717b5b5e0dd5958b10)

- Chores
  - ensure all projects use tslib ^1.13.0
  - updated rollup-\* to latest to get latest iltorb

## [6.3.0] - August 19th 2020

### @esri/hub-common

- New Features
  - **groups** `addUsersToGroups` Adds, invites or emails users about joining a group, based on the privileges of the requesting user.
  - **docs** added more guides

## [6.2.1] - August 14th 2020

### @esri/hub-common

- Bug Fixes
  - **hubApiRequest**: url should include /api/v3 [`5ca01f39`](https://github.com/Esri/hub.js/commit/5ca01f39afd667d2beeab0df1d440aff09bf653a)

## [6.2.0] - August 13th 2020

### @esri/hub-common

- New Features
  - **types**: add common Hub types needed for getContent() [`a1304061`](https://github.com/Esri/hub.js/commit/a1304061356bd96cb50e70ea84dda634a572c065)
  - **thumbnail url**: getItemThumbnailUrl() can take the portal URL instead of request options [`fd403198`](https://github.com/Esri/hub.js/commit/fd4031981e2ee7c6ed4aad215b997c62256bf74c)
  - **thumbnail url**: getItemThumbnailUrl() can take a portal object instead of request options [`1ccd5a30`](https://github.com/Esri/hub.js/commit/1ccd5a30fe14b05b23499b1565cf7481dc6a1c59)
  - **url utils**: add a utility fn to build URLs from a host, path, and queryParams [`b3c33315`](https://github.com/Esri/hub.js/commit/b3c33315c0981573c29002e1929f83465916779d)
  - **extent**: add function to create an extent from coordinates [`ee97f502`](https://github.com/Esri/hub.js/commit/ee97f502a3b3196245908fec612c704cc9bc1b2c)
  - **item urls**: add fn to get the URL of an item page in the Portal home app [`de904dd0`](https://github.com/Esri/hub.js/commit/de904dd00f02fde81cfdc96874c16e8e24b47226)
  - **item urls**: add a fn to get the portal rest api end point for an item data [`0b0f3af9`](https://github.com/Esri/hub.js/commit/0b0f3af9f3712c7825a824279b05fc09b82faaa6)
  - **item urls**: add a fn to get the URL for an item portal API endpoint [`599ae794`](https://github.com/Esri/hub.js/commit/599ae794858f963854fc2d3a8a71bfd547c57796)
  - **request**: add hubRequestApi() for making requests to the Hub API [`bfb9b698`](https://github.com/Esri/hub.js/commit/bfb9b6984da7d1e119fd57cde422571490921e7c)

### @esri/hub-content

- New Features
  - **content utils**: add a function to parse item and layer ids from dataset id [`f321a40a`](https://github.com/Esri/hub.js/commit/f321a40a9c34d310b8fcf19a6dffbf15116bfcb5)
  - **getContent**: add functions for fetching content from portal [`db56b8cd`](https://github.com/Esri/hub.js/commit/db56b8cd0b6f68940e22e715c282d925e7d61923)

### @esri/hub-downloads

- Bug Fixes
  - **downloads**: fix broken search for previously cached download files with a format-name including whitespace. Keywords actually do not require inclusion of the export-format type, since the search already includes a `type`; which refers to the export-format.
- Misc.
  - **download metadata**: remove duplicate urlBuilder fn [`feec3220`](https://github.com/Esri/hub.js/commit/feec322072c49dfc9063bdaae3310acd3227581b)

### Other Changes

- Chores
  - **linting**: configure husky to run lint-staged on ever commit [`f4e6cf24`](https://github.com/Esri/hub.js/commit/f4e6cf240036e67b8e9f52782422a6a6508094c8) [#308](https://github.com/Esri/hub.js/issues/308)
  - **linting**: add and run scripts to format TS files in each package [`c50eff30`](https://github.com/Esri/hub.js/commit/c50eff30ebcc97e860d11b1d13e0e441e74e01d3)

## [6.1.3] - August 12th 2020

### @esri/hub-common

- Bug Fixes
  - **cloneObject**: fix cloneObject handling of Date properties [`81e6b257`](https://github.com/Esri/hub.js/commit/81e6b2577b6c2bae18bddcde8b43a34180a585c1) [#309](https://github.com/Esri/hub.js/issues/309)

### Other Changes

- Bug Fixes
  - **search**: Revert c/141567 changed Hub Page and Site Page types to Site types from Document [`1b4732f8`](https://github.com/Esri/hub.js/commit/1b4732f88807fbc61a6c3ade6668d9f9a56e8c90)

## [6.1.2] - July 30th 2020

- Bug Fixes
  - **hub-surveys**: Fixed error that could occur in `getSurveyModels` method when no Fieldworker or Feature Service are returned. [141783](https://esriarlington.tpondemand.com/entity/141783-collaborators-can-use-sharing-quick-actions)

## [6.1.1] - July 30th 2020

- Bug Fixes
  - **hub-surveys**: Fixed error that could occur in `getSurveyModels` method when no Fieldworker or Feature Service are returned. [141783](https://esriarlington.tpondemand.com/entity/141783-collaborators-can-use-sharing-quick-actions)

## [6.1.0] - July 23rd 2020

- New Feature

  - **hub-downloads**: adds method for
    - getting metadata for a particular dataset download file from Hub API or Portal API (private/enterprise datasets)
    - requesting the export of a dataset to a particular download file format from Hub API or Portal API (private/enterprise datasets)
    - polling the status of download export from Hub API or Portal API (private/enterprise datasets)

- Changed
  - **hub-search** Pages moved from `Document` to `Site` Types

## [6.0.1] - July 20th 2020

- Changed
  - **hub-surveys**: Changed `setAccess` to only change access to survey Form and Fieldworker. [138621](https://esriarlington.tpondemand.com/entity/138621-owneradmin-can-set-sharing-level-for)

## [6.0.0] - July 16th 2020

### @esri/hub-sites

- Breaking Changes
  - **sites**: remove deprecated functions [`3e7fb63`](https://github.com/Esri/hub.js/commit/3e7fb632b2a2387ff590c7d9148db7ab6d896274) [#269](https://github.com/Esri/hub.js/issues/269)

## [5.0.0] - July 10th 2020

- Changed

  - **hub-teams**: created teams package

- Bug Fixes
  - **hub-sites**: fetching app and survey card items as dependencies during templating process
  - **hub-sites**: not including core team in templated gallery cards (https://github.com/Esri/solution.js/issues/392)

## [4.5.1] - July 2nd 2020

- Documentation
  - **hub-surveys**: Updated README. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

## [4.5.0] - July 2nd 2020

- New Feature

  - **hub-common**: Added a static logger wrapper class that logs based on the set level [130847](https://esriarlington.tpondemand.com/entity/130847-add-a-hub-logger-wrapper-method)

- Changed
  - **hub-surveys**: Changed `getStakeholderModel` to search by `Survey2Data` relationship for `formId`. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  - **hub-surveys**: Improved `getSurveyModels` performance by parallelizing `getStakeholderModel` and `getInputFeatureServiceModel` calls. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  - **hub-surveys**: Changed `getSurveyModels`, `getGroupSharingDetails`, `setAccess`, `shareWithGroup` and `unshareWithGroup` signatures to accept `formId`: `string` vs `formModel`: `IForm`. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  - **hub-surveys**: Moved `get-*` methods from `sharing` dir into `items` dir. [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

## [4.4.0] - June 30th 2020

### @esri/hub-common

- New Features
  - added `isUpdateGroup`, `runRevertableTask`, and `processRevertableTasks` utility methods [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

### @esri/hub-surveys

- New Package
  - Created `hub-surveys` package [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)
  - Added `setAccess`, `shareWithGroup` and `unshareWithGroup` methods [136998](https://esriarlington.tpondemand.com/entity/136998-chore-hoist-all-sharing-logic-into)

## [4.3.0] - June 25th 2020

### @esri/hub-common

- New Feature
  - **hub-common**: add `doesItemExistWithTitle` and `getUniqueItemTitle` [c8a869c](https://github.com/Esri/hub.js/commit/c8a869c23f69fcd89f33d390ee5339160f950481)
  - **hub-common**: added `batch` utility method that allows for serial processing of batches of concurrent tasks [131321](https://esriarlington.tpondemand.com/entity/131321-purge-script-hasntisnt-purged-the-hub)

## [4.2.2] - June 1st 2020

- New Feature
  - **hub-sites**: `updateSite` and `updatePage` send `clearEmptyFields: true` allowing item properties to be cleared [fb64477](https://github.com/Esri/hub.js/commit/fb64477ff528d770acc5a7caceb47aec2c1446e3)

## [4.2.1] - June 1st 2020

- Bug Fixes
  - **hub-sites**: allow old site item type in linkSiteAndPage [`202c2c1`](https://github.com/Esri/hub.js/commit/202c2c1f57eee635f85af612f19d6fb576611a10)

## [4.2.0] - May 27th 2020

### @esri/hub-sites

- New Features
  - **hub-sites**: added page utils

## [4.1.0] - May 21st 2020



## [4.0.0] - May 20th 2020



## [3.9.3] - May 14th 2020

### @esri/hub-common

- New Features
  - **hub-sites**: team utils

## [3.9.2] - May 11th 2020

### @esri/hub-common

- Bug Fixes
  - **hub-common**: resolve UMD Build Issues [`e60ba72`](https://github.com/Esri/hub.js/commit/e60ba72d2b8aaa9e36633842ce0a4fe9617e327c)
  - **hub-common**: removing es2017 from the tsconfig lib array [`8f13db0`](https://github.com/Esri/hub.js/commit/8f13db0df787d56566c249be27739d11384bbd36)

### @esri/hub-events

- Bug Fixes
  - **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

### @esri/hub-initiatives

- Bug Fixes
  - **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

### @esri/hub-sites

- Bug Fixes
  - **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

### @esri/hub-solutions

- Bug Fixes
  - **peerDependencies**: fix invalid peerDependencies [`08fae37`](https://github.com/Esri/hub.js/commit/08fae37875aa3e68a82970a54eedcbe13ef001a8) [#251](https://github.com/Esri/hub.js/issues/251)

## [3.9.1] - May 6th 2020



## [3.9.0] - May 6th 2020

### @esri/hub-sites and @esri/hub-common

- New Features
  - **common**: add `interpolate` [`1f3156d`](https://github.com/Esri/hub.js/commit/1f3156d18934b16d69173753ef3236a638aa0331)

## [3.8.0] - May 4th 2020

- New Features
  - domain utils [5d2cf85](https://github.com/Esri/hub.js/commit/5d2cf85455cdc1b5966e385fd01d4a6a51f58926)

### @esri/hub-common

## [3.7.6] - May 2nd 2020

### @esri/hub-common

- Bug Fixes
  - **hub-common**: add token to resource urls [`ba72310`](https://github.com/Esri/hub.js/commit/ba72310acf8268f3900719f36be6654a08d25f54)

### Other Changes

- Bug Fixes
  - **hub-common**: add token to resource urls [`bca4e15`](https://github.com/Esri/hub.js/commit/bca4e15c02963393102dd7a7e812dc2252a6d3b0)

## [3.7.5] - April 30th 2020

### @esri/hub-initiatives

- Bug Fixes
  - **fix hub-initiatives UMD build** [`6a38816`](https://github.com/Esri/hub.js/commit/6a388166b5da8fc2d76f7c81d9084cf6e665fc60)

### @esri/hub-common

- Bug Fixes
  - **fix adlib import on IE** [`964febf`](https://github.com/Esri/hub.js/commit/964febf1dbae482c2a892e8392f164a0e80026ef)

## [3.7.4] - April 30th 2020



## [3.7.3] - April 29th 2020

- New Features
  - **common**: add deleteProp [`494415b`](https://github.com/Esri/hub.js/commit/494415bf4621605b215bed646722ea3116e351c1)

## [3.7.2] - April 28th 2020

### @esri/hub-common

## [3.7.1] - April 28th 2020



## [3.7.0] - April 28th 2020

- New Features
  - **common**: add isGuid and other utils [`b1c2a94`](https://github.com/Esri/hub.js/commit/b1c2a94c4c90bc5986056c173fabf5c09280e3d3)

### @esri/hub-initiatives

- Bug Fixes
  - **Fixes current initiative schema to be 2.2 so that the 2.2 migration runs**: set correct current i [`bce256c`](https://github.com/Esri/hub.js/commit/bce256cb89de5d91fbecec35b5ffb6b63e6adf3e)

## [3.6.9] - April 23rd 2020

### @esri/hub-initiatives

- Bug Fixes
  - **Fixes current initiative schema to be 2.2 so that the 2.2 migration runs**: set correct current i [`bce256c`](https://github.com/Esri/hub.js/commit/bce256cb89de5d91fbecec35b5ffb6b63e6adf3e)

## [3.6.8] - April 13th 2020

### @esri/hub-initiatives

- Bug Fixes
  - **udpateModel** Drop use of rest-js internal fn `determineOwner`

## [3.6.7] - March 30th 2020

### @esri/hub-initiatives

- Chores
  - Ensure that data.recommendedTemplates will be taken from the template and applied to the resulting model

## [3.6.6] - February 27th 2020

### @esri/hub-initiatives

- Chores
  - **migrate initiative item to create recommendedTemplates array**: migrate initiative item to crea [`239649c`](https://github.com/Esri/hub.js/commit/239649c14837a8266af8393e17101f4e9dff8b00)

## [3.6.5] - January 28th 2020

### @esri/hub-search

- Bug Fixes
  - **search**: all filters should be consistent and default to `any`

## [3.6.4] - January 28th 2020

### @esri/hub-search

- Bug Fixes
  - **search**: filter out falsey type arrays. Fixes an issue where an unsupported collection is filtered on, resulting in an undefined array of types to iterate over.

## [3.6.3] - January 27th 2020



## [3.6.2] - January 2nd 2020



## [3.6.0] - November 18th 2019

### @esri/hub-common

- New Features
  - **support-more-than-3-countFields**: support-more-than-3-countFields [`7141bb6`](https://github.com/Esri/hub.js/commit/7141bb660ea74de3ac3fa5347f34828d360bb1b3)

### @esri/hub-search

- New Features
  - **support-more-than-3-countFields**: support-more-than-3-countFields [`7141bb6`](https://github.com/Esri/hub.js/commit/7141bb660ea74de3ac3fa5347f34828d360bb1b3)

## [3.5.0] - November 8th 2019

### @esri/hub-search

- New Features
  - **categories**: filter and aggregate by categories [`e8eb882`](https://github.com/Esri/hub.js/commit/e8eb88291b711ca55edc1edfeedc7489315dc7ef)

## [3.4.0] - November 4th 2019

### @esri/hub-common

- New Features
  - **filter-between-dates**: filter AGO items by modified date [`a6291f0`](https://github.com/Esri/hub.js/commit/a6291f0be3a6ae1bf97ee459291dd7cb282304d1)

### @esri/hub-search

- New Features
  - **filter-between-dates**: filter AGO items by modified date [`a6291f0`](https://github.com/Esri/hub.js/commit/a6291f0be3a6ae1bf97ee459291dd7cb282304d1)

## [3.3.0] - October 23rd 2019

### @esri/hub-search

- New Features
  - **support categories and license filter**: support categories and license filter [`9126679`](https://github.com/Esri/hub.js/commit/9126679426e5648bc527f76850b678f72bd3952b)

## [3.2.2] - October 15th 2019

### @esri/hub-initiatives

- Bug Fixes
  - **bump initiative schema version**: bump initiative schema version [`cb2c267`](https://github.com/Esri/hub.js/commit/cb2c267150451bb4695c82c385471b7f4ac76d62)

## [3.2.1] - September 17th 2019

- Bug Fixes
  - **common**: add `Site Page` to the type list of the `Document` category

## [3.2.0] - September 10th 2019

### @esri/hub-common

- New Features
  - **extend**: implement extend in `hub-common` [`5e0ff68`](https://github.com/Esri/hub.js/commit/5e0ff68571203ec8460c69f6d57debd2eb3a4fe7)

## [3.1.0] - September 9th 2019

### Other Changes

- Bug Fixes
  - **search**: format item extent properly [`163250e`](https://github.com/Esri/hub.js/commit/163250e0bf6589b75f95ba775cc62ab5757418c4)

## [3.0.1] - September 5th 2019

### @esri/hub-initiatives

- Bug Fixes
  - **swallow group delete failures on initiative deletion**: swallow group delete failures on initiative deletion [`e11e83d`](https://github.com/Esri/hub.js/commit/e11e83de14a464462bb81ccb9c3de5f1e81be8b1)

## [3.0.0] - September 4th 2019

- Changed
  - Migrate to new initiative schema where groupId is now stored as collaborationGroupId
  - Remove `progressCallback` from activate and remove initiative processes
  - Change `activateInitiative` and `createInitiativeModelFromTemplate` to expect a hash of groupIds corresponding to existing groups for the new initiative model

## [2.7.1] - August 30th 2019

### Other Changes

- Bug Fixes
  - **search**: multiple filters should be ANDed together [`aeeecbc`](https://github.com/Esri/hub.js/commit/aeeecbcaa3b37e054eff0449e77dfcee07701859)
  - **search**: multiple filters should be ANDed together [`b458eae`](https://github.com/Esri/hub.js/commit/b458eae66cf8181ddc8c839cede6da36db93158d)

## [2.7.0] - August 29th 2019

- New Features
  - **search**: support filters specified implicitly

## [2.6.0] - August 20th 2019



## [2.5.0] - August 15th 2019

### Other Changes

- New Features
  - **search**: use restricted option to scope search [`ce5c823`](https://github.com/Esri/hub.js/commit/ce5c823beea49553a1d8f8b35c0f66d05867693a)
  - **search**: use restricted option to scope search [`d3b699f`](https://github.com/Esri/hub.js/commit/d3b699f35fcc9962390a2f81b8883daf110bd7fd)

## [2.4.1] - August 12th 2019

### @esri/hub-search

- Bug Fixes
  - **lowercase ago param keys**: lowercase ago param keys [`708fa9f`](https://github.com/Esri/hub.js/commit/708fa9fb300620c1fb8a4c9a9a1dfc168f5a03dc)

## [2.4.0] - July 25th 2019

### @esri/hub-search

- New Features
  - **enable catalog serialization on orgId and initiativeId**: enable catalog serialization on orgId [`3316230`](https://github.com/Esri/hub.js/commit/3316230e5dd0e30bc899eb43d816d95cb0b8710b)

## [2.3.1] - July 3rd 2019

### @esri/hub-initiatives

- Bug Fixes
  - **initiatives**: do not create an open-data group when activating an initiative [`914f9ac`](https://github.com/Esri/hub.js/commit/914f9ac60437674d758e235b15b361f01e79f841)

## [2.3.0] - June 25th 2019

### @esri/hub-common

- Added
  - getType and getTypeCategories of an item

## [2.2.5] - June 25th 2019

### @esri/hub-initiatives

- Bug Fixes
  - **initiatives**: removeInitiative detaches and deletes site only if it exists in AGO [`2f53e4e`](https://github.com/Esri/hub.js/commit/2f53e4e9d59dc2b103e6928a24670a62b159b200)

## [2.2.4] - June 18th 2019

### @esri/hub-annotations

- Bug Fixes
  - **annotation users**: pass portal when getting annotation user [`458cb21`](https://github.com/Esri/hub.js/commit/458cb218ff148bab73216ddb93b8c6a9e506e7f1)

## [2.2.3] - June 12th 2019

### @esri/hub-annotations

- Bug Fixes
  - **annotation users**: pass auth when getting anno user; handle failed requests [`d8485d2`](https://github.com/Esri/hub.js/commit/d8485d20a4b2428ae9847f5ee9672df780c4a14f) [#40](https://github.com/Esri/hub.js/issues/40)

## [2.2.2] - June 7th 2019

### @esri/hub-initiatives

- Bug Fixes
  - removeInitiative removes initiative followers group

## [2.2.1] - June 5th 2019

### @esri/hub-initiatives

- Bug Fixes
  - Follow/unfollow initiative sends authOptions when fetching the initiative

## [2.2.0] - June 4th 2019

### @esri/hub-search

- Bug Fixes
  - Fixed a bug wherein a blank string did not construct AGO query properly. Added a check in place for that
  - Removed circular dependency in `computeItemsFacets` function
- Chores
  - Developed an algorithm to encode urls cleanly in `serialize` function

### @esri/hub-common

- Added
  - unique function for identifying if a value is unique in an array (useful for getting unique values in an array)

### @esri/hub-initiatives

- Changed
  - followInitiative and unfollowInitiative to account for initiative followers group

## [2.1.0] - May 14th 2019

### @esri/hub-search

- Added
  - new package! 🙏 @pranavkulkarni 🙏

## [2.0.0] - May 6th 2019

### @esri/hub-domains

- Breaking Changes
  - this package has been deprecated

### @esri/hub-sites

- Breaking Changes
  - `fetchDomain()` has been renamed to `getDomain()`
  - `fetchDomains()` has been renamed to `getDomains()`

### @esri/hub-initiatives

- Breaking Changes
  - `fetchInitiative()` has been renamed to `getInitiative()`
  - `IFollowInitiativeRequestOptions` has been renamed `IFollowInitiativeOptions`

### @esri/hub-annotations

- Breaking Changes

  - addAnnotations and updateAnnotations now expect `features` (instead of `adds` or `updates`).
  - `ISearchAnnoRequestOptions` has been renamed `ISearchAnnoOptions`
  - `IVoteRequestOptions` has been renamed `IVoteOptions`

- Bug Fixes
  - it is now possible to call `createAnnotationService()` when working with a custom portal.

### @esri/hub-events

- Breaking Changes
  - `IEventRegisterRequestOptions` has been renamed `IEventRegisterOptions`

### Other Changes

- Bug Fixes

  - Hub.js now depends on ArcGIS REST JS v2.x
  - ArcGIS REST JS packages are now listed as peerDependencies.

- Documentation
  - **book**: get doc in sync with rest-js v2.0.0 [`cc7c49d`](https://github.com/Esri/hub.js/commit/cc7c49d439c43130d3f9a6ead6c732056126b1ad)

## [1.11.1] - April 23rd 2019

### @esri/hub-common

- Fixes
  - ensure that `undefined` is returned by `getHubApiUrl()` for non-arcgis.com urls.

### @esri/hub-domains

- Fixes
  - centralize logic for returning hub urls.

## [1.11.0] - April 11th 2019

### @esri/hub-events

- New Features
  - new `getEventFeatureServiceUrl()` and `getEventServiceItem()` methods [`a7fc6be`](https://github.com/Esri/hub.js/commit/a7fc6be7613626246e4f53ce6f3e160b73b02864)
  - `getEventServiceUrl` gets the REST API [`7c9836b`]((https://github.com/Esri/hub.js/commit/7c9836b1d44e4db1c1cd6b46020d19b419f70320)

### @esri/hub-common

- Bug Fixes
  - export `getTypes` and `getCategories` methods [`0dfba00`](https://github.com/Esri/hub.js/commit/0dfba00e5cb75d95a89942f8ed0f6eae53c6d035)

## [1.10.0] - March 29th 2019

### @esri/hub-\*

- New Features
  - **tree**: advertise sideEffect free code to webpack [`47bcbae`](https://github.com/Esri/hub.js/commit/47bcbaee600daa92e14cc097219886158d59548e)

### @esri/hub-events

- New Features
  - new `registerForEvent()` and `unregisterForEvent()` methods [`f4bd391`](https://github.com/Esri/hub.js/commit/f4bd391c67cc9711860ea3d49f83936d3c0bcb86)

## [1.9.0] - March 21st 2019

### @esri/hub-initiatives

- New Features
  - new methods for users to follow and unfollow initiatives [`aeef22e`](https://github.com/Esri/hub.js/commit/aeef22e9e645033bde8eff29cc3a1c01891b6db5)

### Other Changes

- Chores
  - **changelog**: ensure that CHANGELOG script generates valid diff urls [`bbb82c1`](https://github.com/Esri/hub.js/commit/bbb82c19a4772f23505a9f155e644759d22bb2e1)

## [1.8.1] - March 4th 2019

### @esri/hub-auth

- Fixes
  - ensure pkg.unpkg filename/path is correct [`7fb1294`](https://github.com/Esri/hub.js/commit/7fb12944060f8ebcfdb262deddead16570becfd5)

## [1.8.0] - February 25th 2019

### @esri/hub-common

- New Features
  - new functions for ArcGIS item category mapping [`4407c6a`](https://github.com/Esri/hub.js/commit/4407c6a251a6621cc31b55cb1a20915ecc218890)

### @esri/hub-events

- Fixes
  - make sure authentication is passed through and searchItems is used internally when searching events [`7785f76`](https://github.com/Esri/hub.js/commit/7785f76895dc7ed1ba790291996b8cefaf03c704)
  - short circuit when there are no sites to search [`371e642`](https://github.com/Esri/hub.js/commit/371e6423396de0af164d6e837e2ba2e2cb9a298a)

### Other Changes

- Chores
  - use pkg.unpkg to point the CDN at our UMD instead of `browser` so that webpack users can utilize the ES6. [`ee332be`](https://github.com/Esri/hub.js/commit/ee332be32f0ada505f810caa27f41f5b1c6b61cd)
- more linting (to resolve TS 3.x errors) [`61d5a98`](https://github.com/Esri/hub.js/commit/61d5a98a1dece9ce9793f45b83e22214d72a6007)

## [1.7.2] - February 13th 2019

### @esri/hub-annotations

- Fixes
  - ensure that correct summary statistics are generated when searching for annotation votes [`169656a`](https://github.com/Esri/hub.js/commit/169656ac948ab898ee90bd5299f6b469de89fa3f)

## [1.7.1] - February 12th 2019

### @esri/hub-annotations

- Fixes
  - fix incorrect `WHERE` clause construction [`36ea324`](https://github.com/Esri/hub.js/commit/36ea32466401f7a7692db4ac5d59b1a6e4944e92)
  - ensure upvotes/downvotes arent returned by `searchAnnotations()` [`4b76141`](https://github.com/Esri/hub.js/commit/4b76141d0a4e6fa72616506ad1b32cdd19de0491)
  - ensure users can delete their own upvote/downvotes [`4b76141`](https://github.com/Esri/hub.js/commit/4b76141d0a4e6fa72616506ad1b32cdd19de0491)
  - use `vote` as an annotation fieldname (instead of `value`) [`4b76141`](https://github.com/Esri/hub.js/commit/4b76141d0a4e6fa72616506ad1b32cdd19de0491)

## [1.7.0] - January 30th 2019

### @esri/hub-annotations

- New Features
  - adds functions to get the number of votes for annotations

## [1.6.1] - January 29th 2019

### @esri/hub-annotations

- Changes
  - use `OBJECTID` as unique identifier for annotations instead of `author`.

## [1.6.0] - January 29th 2019

### @esri/hub-common

- New Features
  - **hub-common**: new `maybePush` function [`5094699`](https://github.com/Esri/hub.js/commit/50946990985db3583148fd521eec7adf4dc03989)
  - **hub-common**: new `maybeAdd()` function [`cbc0a7d`](https://github.com/Esri/hub.js/commit/cbc0a7dab6c81ee9eec16799ac06c883c14481d7)

## [1.5.3] - December 20th 2018

### @esri/hub-annotations

- Changes
  - Added `voteOnAnnotation()` to enable 👍 and 👎 on other user comments.

### Other Changes

- Fixes
  - misc doc improvements for developers and contributors.

## [1.5.2] - November 29th 2018

### @esri/hub-initiatives

- Changes
  - Use the owners item url when deleting an initiative item

## [1.5.1] - November 21st 2018

### @esri/hub-annotations

- Fixes
  - added support for a new `features` constructor option on addAnnotations() to keep in sync with rest-js.

### Other Changes

- Fixes
  - fixed malformed SemVer version ranges in multiple packages.

## [1.5.0] - November 21st 2018

### @esri/hub-events

- New Features
  - new `searchEvents()` method.

### @esri/hub-annotations

- Fixes
  - `geometry` is now passed along by `searchAnnotations()`
  - annotations from anonymous users are now handled correctly by search

## [1.4.0] - October 30th 2018

### @esri/hub-annotations

- New Package!

### @esri/hub-events

- New Package!

### Other Changes

- Chores
  - **tooling**: add scripts to re-run builds in watch mode for specified packages [`5e68ba0`](https://github.com/Esri/hub.js/commit/5e68ba07de9b0a642b07421d24b1be3aa1421475) [#78](https://github.com/Esri/hub.js/issues/78)
  - **ci**: retry tests on failure (#92) [`9c23992`](https://github.com/Esri/hub.js/commit/9c23992c82f4a1382aead7b70311683926d94118)
  - **rollup**: upgrade to latest rollup and use rollup watch to re-run … [`12c22e3`](https://github.com/Esri/hub.js/commit/12c22e30812a4af1bd37851a243cf4598efbd17f)
  - **ci**: only build master branch and PRs [`a0d41ac`](https://github.com/Esri/hub.js/commit/a0d41acf5c3244fbaada4dbcc49e30f514d9ce3b)
  - **rollup**: upgrade to latest rollup and rollup-plugin-filesize [`796231e`](https://github.com/Esri/hub.js/commit/796231ef9ab71df9a5dec589f7f481dcdf42f752)
- Documentation
  - **anno search**: fix formatting of code snippet on annotations sear… [`6be767a`](https://github.com/Esri/hub.js/commit/6be767a8897c95c8c915ad6623b4c6bcba796ed3)

## [1.3.0] - September 20th 2018

### @esri/hub-sites

- Misc.
  - **sites**: rename fetchDomain(s) to getDomain(s) [`69dc88e`](https://github.com/Esri/hub.js/commit/69dc88e99bbd186d683c51978eb8face23cb24ce) [#60](https://github.com/Esri/hub.js/issues/60)

### Other Changes

- Documentation
  - **README**: replace package name/descriptoin of hub-common-types w/… [`4e21d75`](https://github.com/Esri/hub.js/commit/4e21d75be238d7a5c42e208e3f4acf4329a7e7ba)
- Chore
  - **all**: bump ArcGIS REST JS [#66](https://github.com/Esri/hub.js/pull/66)

## [1.2.0] - September 17th 2018

- New Features
  - Coarse-grained and fine-grained functions to create/remove Initiatives

## [1.1.1] - August 15th 2018

### @esri/hub-common

- New Features
  - `findBy(arr, deep.path)` now supports deep-dotting into objects inside an array.

## [1.1.0] - August 10th 2018

### @esri/hub-common

- Breaking Changes
  - package rename (from `@esri/hub-common-types` to `@esri/hub-common`)
- New Features
  - Functional utility methods for introspecting and manipulating objects and arrays. [#46](https://github.com/Esri/hub.js/pull/46)

### @esri/hub-solutions

- New Package!

### @esri/hub-auth

- New Package!

- New Features
  - wrapper method `arcgisHub.completeOAuth2` wraps the underlying `rest-js` call with additional logic to make newly created community users searchable. [#43](https://github.com/Esri/hub.js/pull/43)

### @esri/hub-annotations

- Bug Fixes
  - **annotations**: fix type errors that prevent running bootstrap and tests [`301412f`](https://github.com/Esri/hub.js/commit/301412fda6706d913843e303a71301c203e78e89) [#47](https://github.com/Esri/hub.js/issues/47)

### Other Changes

- Documentation
  - **cdn**: update cdn sample to show that deps are external [`87874dd`](https://github.com/Esri/hub.js/commit/87874dd26ebedb547afbdb96d7395b9ef27d956b)
  - **cdn**: update cdn sample to show that deps are external [`3304466`](https://github.com/Esri/hub.js/commit/3304466dee59b167a584360d57beff3cef0ce020)
- Bug Fixes
  - **annotations**: fix type errors that prevent running bootstrap and … [`07a0dfc`](https://github.com/Esri/hub.js/commit/07a0dfc151f66c220a1dbfb23c786e9e33e01fe6)

## [1.0.1] - July 12th 2018

### @esri/hub-annotations

- Bug Fixes
  - **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### @esri/hub-common-types

- Bug Fixes
  - **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### @esri/hub-initiatives

- Bug Fixes
  - **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### @esri/hub-sites

- Bug Fixes
  - **all**: treat arcigs-rest-js packages as external and bump to latest [`76ac218`](https://github.com/Esri/hub.js/commit/76ac2187c069a0d73ab27ea7ca9942d33b232ac9)

### Other Changes

- Bug Fixes
  - **all**: treat arcigs-rest-js packages as external and bump to latest [`dc69b18`](https://github.com/Esri/hub.js/commit/dc69b18993b786380edc5ccc3a5bfe0c56ad8c8e)

## [1.0.0] - July 9th 2018

Initial Release

[]: https://github.com/Esri/hub.js/compare/48be7ee38cd92cd342565215304f2a2979b1f822...v "v"
[1.0.0]: https://github.com/Esri/hub.js/compare/v...v1.0.0 "v1.0.0"
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
[3.6.9]: https://github.com/Esri/hub.js/compare/v3.6.8...v3.6.9 "v3.6.9"
[3.7.0]: https://github.com/Esri/hub.js/compare/v3.6.9...v3.7.0 "v3.7.0"
[3.7.1]: https://github.com/Esri/hub.js/compare/v3.7.0...v3.7.1 "v3.7.1"
[3.7.2]: https://github.com/Esri/hub.js/compare/v3.7.1...v3.7.2 "v3.7.2"
[3.7.3]: https://github.com/Esri/hub.js/compare/v3.7.2...v3.7.3 "v3.7.3"
[3.7.4]: https://github.com/Esri/hub.js/compare/v3.7.3...v3.7.4 "v3.7.4"
[3.7.5]: https://github.com/Esri/hub.js/compare/v3.7.4...v3.7.5 "v3.7.5"
[3.7.6]: https://github.com/Esri/hub.js/compare/v3.7.5...v3.7.6 "v3.7.6"
[3.8.0]: https://github.com/Esri/hub.js/compare/v3.7.6...v3.8.0 "v3.8.0"
[3.9.0]: https://github.com/Esri/hub.js/compare/v3.8.0...v3.9.0 "v3.9.0"
[3.9.1]: https://github.com/Esri/hub.js/compare/v3.9.0...v3.9.1 "v3.9.1"
[3.9.2]: https://github.com/Esri/hub.js/compare/v3.9.1...v3.9.2 "v3.9.2"
[3.9.3]: https://github.com/Esri/hub.js/compare/v3.9.2...v3.9.3 "v3.9.3"
[4.0.0]: https://github.com/Esri/hub.js/compare/v3.9.3...v4.0.0 "v4.0.0"
[4.1.0]: https://github.com/Esri/hub.js/compare/v4.0.0...v4.1.0 "v4.1.0"
[4.2.0]: https://github.com/Esri/hub.js/compare/v4.1.0...v4.2.0 "v4.2.0"
[4.2.1]: https://github.com/Esri/hub.js/compare/v4.2.0...v4.2.1 "v4.2.1"
[4.2.2]: https://github.com/Esri/hub.js/compare/v4.2.1...v4.2.2 "v4.2.2"
[4.2.3]: https://github.com/Esri/hub.js/compare/v4.2.2...v4.2.3 "v4.2.3"
[4.3.0]: https://github.com/Esri/hub.js/compare/v4.2.3...v4.3.0 "v4.3.0"
[4.4.0]: https://github.com/Esri/hub.js/compare/v4.3.0...v4.4.0 "v4.4.0"
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
[6.5.0]: https://github.com/Esri/hub.js/compare/v6.4.0...v6.5.0 "v6.5.0"
[6.5.1]: https://github.com/Esri/hub.js/compare/v6.5.0...v6.5.1 "v6.5.1"
[6.6.0]: https://github.com/Esri/hub.js/compare/v6.5.1...v6.6.0 "v6.6.0"
[6.6.1]: https://github.com/Esri/hub.js/compare/v6.6.0...v6.6.1 "v6.6.1"
[6.7.0]: https://github.com/Esri/hub.js/compare/v6.6.1...v6.7.0 "v6.7.0"
[6.7.1]: https://github.com/Esri/hub.js/compare/v6.7.0...v6.7.1 "v6.7.1"
[6.7.2]: https://github.com/Esri/hub.js/compare/v6.7.1...v6.7.2 "v6.7.2"
[6.8.0]: https://github.com/Esri/hub.js/compare/v6.7.2...v6.8.0 "v6.8.0"
[6.9.0]: https://github.com/Esri/hub.js/compare/v6.8.0...v6.9.0 "v6.9.0"
[6.9.1]: https://github.com/Esri/hub.js/compare/v6.9.0...v6.9.1 "v6.9.1"
[6.10.0]: https://github.com/Esri/hub.js/compare/v6.9.1...v6.10.0 "v6.10.0"
[6.11.0]: https://github.com/Esri/hub.js/compare/v6.10.0...v6.11.0 "v6.11.0"
[6.11.1]: https://github.com/Esri/hub.js/compare/v6.11.0...v6.11.1 "v6.11.1"
[6.11.2]: https://github.com/Esri/hub.js/compare/v6.11.1...v6.11.2 "v6.11.2"
[6.11.3]: https://github.com/Esri/hub.js/compare/v6.11.2...v6.11.3 "v6.11.3"
[6.12.0]: https://github.com/Esri/hub.js/compare/v6.11.3...v6.12.0 "v6.12.0"
[6.12.1]: https://github.com/Esri/hub.js/compare/v6.12.0...v6.12.1 "v6.12.1"
[6.13.0]: https://github.com/Esri/hub.js/compare/v6.12.1...v6.13.0 "v6.13.0"
[6.13.1]: https://github.com/Esri/hub.js/compare/v6.13.0...v6.13.1 "v6.13.1"
[6.13.2]: https://github.com/Esri/hub.js/compare/v6.13.1...v6.13.2 "v6.13.2"
[6.13.3]: https://github.com/Esri/hub.js/compare/v6.13.2...v6.13.3 "v6.13.3"
[6.14.0]: https://github.com/Esri/hub.js/compare/v6.13.3...v6.14.0 "v6.14.0"
[6.15.0]: https://github.com/Esri/hub.js/compare/v6.14.0...v6.15.0 "v6.15.0"
[6.16.0]: https://github.com/Esri/hub.js/compare/v6.15.0...v6.16.0 "v6.16.0"
[6.17.0]: https://github.com/Esri/hub.js/compare/v6.16.0...v6.17.0 "v6.17.0"
[6.18.0]: https://github.com/Esri/hub.js/compare/v6.17.0...v6.18.0 "v6.18.0"
[6.19.0]: https://github.com/Esri/hub.js/compare/v6.18.0...v6.19.0 "v6.19.0"
[6.19.1]: https://github.com/Esri/hub.js/compare/v6.19.0...v6.19.1 "v6.19.1"
[6.20.0]: https://github.com/Esri/hub.js/compare/v6.19.1...v6.20.0 "v6.20.0"
[6.20.1]: https://github.com/Esri/hub.js/compare/v6.20.0...v6.20.1 "v6.20.1"
[6.21.0]: https://github.com/Esri/hub.js/compare/v6.20.1...v6.21.0 "v6.21.0"
[6.21.1]: https://github.com/Esri/hub.js/compare/v6.21.0...v6.21.1 "v6.21.1"
[6.22.0]: https://github.com/Esri/hub.js/compare/v6.21.1...v6.22.0 "v6.22.0"
[6.22.1]: https://github.com/Esri/hub.js/compare/v6.22.0...v6.22.1 "v6.22.1"
[6.22.2]: https://github.com/Esri/hub.js/compare/v6.22.1...v6.22.2 "v6.22.2"
[6.22.3]: https://github.com/Esri/hub.js/compare/v6.22.2...v6.22.3 "v6.22.3"
[6.23.0]: https://github.com/Esri/hub.js/compare/v6.22.3...v6.23.0 "v6.23.0"
[6.24.0]: https://github.com/Esri/hub.js/compare/v6.23.0...v6.24.0 "v6.24.0"
[7.0.0]: https://github.com/Esri/hub.js/compare/v6.24.0...v7.0.0 "v7.0.0"
[7.0.1]: https://github.com/Esri/hub.js/compare/v7.0.0...v7.0.1 "v7.0.1"
[7.0.2]: https://github.com/Esri/hub.js/compare/v7.0.1...v7.0.2 "v7.0.2"
[7.0.3]: https://github.com/Esri/hub.js/compare/v7.0.2...v7.0.3 "v7.0.3"
[7.0.4]: https://github.com/Esri/hub.js/compare/v7.0.3...v7.0.4 "v7.0.4"
[7.0.5]: https://github.com/Esri/hub.js/compare/v7.0.4...v7.0.5 "v7.0.5"
[7.0.6]: https://github.com/Esri/hub.js/compare/v7.0.5...v7.0.6 "v7.0.6"
[7.0.7]: https://github.com/Esri/hub.js/compare/v7.0.6...v7.0.7 "v7.0.7"
[7.0.8]: https://github.com/Esri/hub.js/compare/v7.0.7...v7.0.8 "v7.0.8"
[7.0.9]: https://github.com/Esri/hub.js/compare/v7.0.8...v7.0.9 "v7.0.9"
[7.1.0]: https://github.com/Esri/hub.js/compare/v7.0.9...v7.1.0 "v7.1.0"
[7.1.1]: https://github.com/Esri/hub.js/compare/v7.1.0...v7.1.1 "v7.1.1"
[7.2.0]: https://github.com/Esri/hub.js/compare/v7.1.1...v7.2.0 "v7.2.0"
[7.3.0]: https://github.com/Esri/hub.js/compare/v7.2.0...v7.3.0 "v7.3.0"
[7.3.1]: https://github.com/Esri/hub.js/compare/v7.3.0...v7.3.1 "v7.3.1"
[7.3.2]: https://github.com/Esri/hub.js/compare/v7.3.1...v7.3.2 "v7.3.2"
[8.0.0]: https://github.com/Esri/hub.js/compare/v7.3.2...v8.0.0 "v8.0.0"
[8.1.0]: https://github.com/Esri/hub.js/compare/v8.0.0...v8.1.0 "v8.1.0"
[8.2.0]: https://github.com/Esri/hub.js/compare/v8.1.0...v8.2.0 "v8.2.0"
[8.2.1]: https://github.com/Esri/hub.js/compare/v8.2.0...v8.2.1 "v8.2.1"
[8.2.2]: https://github.com/Esri/hub.js/compare/v8.2.1...v8.2.2 "v8.2.2"
[8.3.0]: https://github.com/Esri/hub.js/compare/v8.2.2...v8.3.0 "v8.3.0"
[8.3.1]: https://github.com/Esri/hub.js/compare/v8.3.0...v8.3.1 "v8.3.1"
[8.4.0]: https://github.com/Esri/hub.js/compare/v8.3.1...v8.4.0 "v8.4.0"
[8.4.1]: https://github.com/Esri/hub.js/compare/v8.4.0...v8.4.1 "v8.4.1"
[8.4.2]: https://github.com/Esri/hub.js/compare/v8.4.1...v8.4.2 "v8.4.2"
[HEAD]: https://github.com/Esri/hub.js/compare/v8.4.2...HEAD "Unreleased Changes"
