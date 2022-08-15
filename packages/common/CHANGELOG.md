# @esri/hub-common [10.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.2...@esri/hub-common@10.1.0) (2022-08-15)


### Features

* **hub-common:** introduces a getFamilyTypes function that returns the types associated with a prov ([02d7cc7](https://github.com/Esri/hub.js/commit/02d7cc73b0573294a1e6f759264d46b494ad5986))

## @esri/hub-common [10.0.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.1...@esri/hub-common@10.0.2) (2022-08-15)


### Bug Fixes

* update standard license url protocol ([f730997](https://github.com/Esri/hub.js/commit/f730997f257001046ccf31e34277832e19243728))

## @esri/hub-common [10.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0...@esri/hub-common@10.0.1) (2022-08-04)


### Bug Fixes

* isPageType accounts for typekeywords ([82ab99e](https://github.com/Esri/hub.js/commit/82ab99e23c206c6c59bdf14805d205a1e697327e))

# @esri/hub-common [10.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.49.2...@esri/hub-common@10.0.0) (2022-08-03)


### Bug Fixes

* predicates need to be wrapped in parens ([ed9c230](https://github.com/Esri/hub.js/commit/ed9c2308afa32c8867e86682090811b1efb6d9ea))


### chore

* **hub-common:** no longer publish es5 build ([995ce02](https://github.com/Esri/hub.js/commit/995ce02373e8390250e4490b738babb71cb7c303))
* **hub-common:** no longer run and publish UMD build ([2f0d7a2](https://github.com/Esri/hub.js/commit/2f0d7a25332e0864e03f814a34847abb8ee1bc4b))
* **hub-common:** remove bBoxToPolygon() ([75041c2](https://github.com/Esri/hub.js/commit/75041c2e86727f7d0d6ab2e80e5080047721b9d9))


### Code Refactoring

* **hub-common:** remove convertCatalog() ([fc7e62b](https://github.com/Esri/hub.js/commit/fc7e62b914d670247155841edcdadd28ce2e05d2))
* **hub-common:** remove deprecated content properties ([cc00d73](https://github.com/Esri/hub.js/commit/cc00d739203d72e845dc93d839b9442493c7a86f))
* **hub-common:** remove DEPRECATED isExtentCoordinateArray ([180baa7](https://github.com/Esri/hub.js/commit/180baa7e662cf03c17b7fefc39bb152c44aac362))
* **hub-common:** remove deprecated properties from hub search interfaces ([bacf97a](https://github.com/Esri/hub.js/commit/bacf97a67f2bc6b895a4d2f36dfc37f76723a155))
* **hub-common:** remove fetchSite() ([f2482c4](https://github.com/Esri/hub.js/commit/f2482c4377e02d24f7e5e99b0ee97950d98e5435))
* **hub-common:** remove functions that were only used by content search ([2173a66](https://github.com/Esri/hub.js/commit/2173a662d4b2d30f460475a8ba07351fa8089dbb))
* **hub-common:** remove getItemHubType() ([296d2ec](https://github.com/Esri/hub.js/commit/296d2ec943f59af83676081754eaa636e03acda0))
* **hub-common:** remove HubProjectManager.get() ([c472384](https://github.com/Esri/hub.js/commit/c472384f5ead35c86e78eae25266c7ac8104bb9a))
* **hub-common:** remove hubSearchQuery() ([42ea577](https://github.com/Esri/hub.js/commit/42ea577b19aac0f371e43fbcd914abbf5bc153a8))
* **hub-common:** remove setContentHubId() ([b64cee1](https://github.com/Esri/hub.js/commit/b64cee14f8387f3669887cbf1742483fdd116e57))
* **hub-common:** remove unused types ([8eb91be](https://github.com/Esri/hub.js/commit/8eb91bea238f0f757695f873827ca6aa87f21cc5))
* **hub-common:** require type when calling getFamily() ([fcf58f4](https://github.com/Esri/hub.js/commit/fcf58f4041f0eec8a997f12a88326870af19df8e))
* **hub-search:** remove content search classes and functions ([8fdfac1](https://github.com/Esri/hub.js/commit/8fdfac1b631d7e4a1ae7d6d0ce5676f98ef8a23b))
* **hub-sites:** remove hub-sites re-exports from hub-common ([b3e2503](https://github.com/Esri/hub.js/commit/b3e25034e63c00efd9347953208c708342869cce))


### Features

* remove functions, interfaces, tests ([#837](https://github.com/Esri/hub.js/issues/837)) ([19e0e0e](https://github.com/Esri/hub.js/commit/19e0e0e1fcfa6d0c9f5ac685f9e56cacca44d0e0))


* !feat: remove interfaces moved to components (#836) ([72e2d93](https://github.com/Esri/hub.js/commit/72e2d93cae2b5e438ee39abc7bb31b5cb190d3b8)), closes [#836](https://github.com/Esri/hub.js/issues/836)


### BREAKING CHANGES

* **hub-common:** no longer publish es5 build
* **hub-common:** no longer publish a CDN release
* **hub-common:** remove hubApiSearch(), getContentSiteUrls(), & setContentSiteUrls()
* **hub-search:** remove ContentSearchService, searchContent(), searchDatasets()
* **hub-common:** removes isExtentCoordinateArray()
* **hub-common:** remove deprecated properties from hub search interfaces
* **hub-common:** remove HubProjectManager.get()
* **hub-common:** remove setContentHubId()
* **hub-common:** remove convertCatalog()
* **hub-common:** remove fetchSite()
* **hub-common:** remove hubSearchQuery()
* **hub-sites:** remove getTheme(), _addSiteDomains, registerSiteAsApplication, registerBrowserApp from hub-sites
* **hub-common:** remove deprecated properties from content
* **hub-common:** remove HubType, IBBox, IContentEnrichments, and IHubResource types
* **hub-common:** remove getItemHubType()
* **hub-common:** getFamily() requires type
* **hub-common:** remove bBoxToPolygon()
* Removes deprecated things

* refactor: ensure next is a pre-release branch

* fix: ensure CI runs for next branch

* refactor: remove commented code/files

# @esri/hub-common [10.0.0-next.7](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0-next.6...@esri/hub-common@10.0.0-next.7) (2022-08-03)

### Bug Fixes

* predicates need to be wrapped in parens ([ed9c230](https://github.com/Esri/hub.js/commit/ed9c2308afa32c8867e86682090811b1efb6d9ea))

# @esri/hub-common [10.0.0-next.6](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0-next.5...@esri/hub-common@10.0.0-next.6) (2022-08-02)


### Bug Fixes

* enable searching groups by shared edit ([#839](https://github.com/Esri/hub.js/issues/839)) ([30b6bd7](https://github.com/Esri/hub.js/commit/30b6bd7788b8904dcc900c3ce9cfb1e85a6ebd20))

# @esri/hub-common [10.0.0-next.5](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0-next.4...@esri/hub-common@10.0.0-next.5) (2022-08-01)


### chore

* **hub-common:** no longer publish es5 build ([995ce02](https://github.com/Esri/hub.js/commit/995ce02373e8390250e4490b738babb71cb7c303))


### BREAKING CHANGES

* **hub-common:** no longer publish es5 build

# @esri/hub-common [10.0.0-next.4](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0-next.3...@esri/hub-common@10.0.0-next.4) (2022-08-01)


### chore

* **hub-common:** no longer run and publish UMD build ([2f0d7a2](https://github.com/Esri/hub.js/commit/2f0d7a25332e0864e03f814a34847abb8ee1bc4b))


### BREAKING CHANGES

* **hub-common:** no longer publish a CDN release

# @esri/hub-common [10.0.0-next.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0-next.2...@esri/hub-common@10.0.0-next.3) (2022-07-28)


### chore

* **hub-common:** remove bBoxToPolygon() ([75041c2](https://github.com/Esri/hub.js/commit/75041c2e86727f7d0d6ab2e80e5080047721b9d9))


### Code Refactoring

* **hub-common:** remove convertCatalog() ([fc7e62b](https://github.com/Esri/hub.js/commit/fc7e62b914d670247155841edcdadd28ce2e05d2))
* **hub-common:** remove deprecated content properties ([cc00d73](https://github.com/Esri/hub.js/commit/cc00d739203d72e845dc93d839b9442493c7a86f))
* **hub-common:** remove DEPRECATED isExtentCoordinateArray ([180baa7](https://github.com/Esri/hub.js/commit/180baa7e662cf03c17b7fefc39bb152c44aac362))
* **hub-common:** remove deprecated properties from hub search interfaces ([bacf97a](https://github.com/Esri/hub.js/commit/bacf97a67f2bc6b895a4d2f36dfc37f76723a155))
* **hub-common:** remove fetchSite() ([f2482c4](https://github.com/Esri/hub.js/commit/f2482c4377e02d24f7e5e99b0ee97950d98e5435))
* **hub-common:** remove functions that were only used by content search ([2173a66](https://github.com/Esri/hub.js/commit/2173a662d4b2d30f460475a8ba07351fa8089dbb))
* **hub-common:** remove getItemHubType() ([296d2ec](https://github.com/Esri/hub.js/commit/296d2ec943f59af83676081754eaa636e03acda0))
* **hub-common:** remove HubProjectManager.get() ([c472384](https://github.com/Esri/hub.js/commit/c472384f5ead35c86e78eae25266c7ac8104bb9a))
* **hub-common:** remove hubSearchQuery() ([42ea577](https://github.com/Esri/hub.js/commit/42ea577b19aac0f371e43fbcd914abbf5bc153a8))
* **hub-common:** remove setContentHubId() ([b64cee1](https://github.com/Esri/hub.js/commit/b64cee14f8387f3669887cbf1742483fdd116e57))
* **hub-common:** remove unused types ([8eb91be](https://github.com/Esri/hub.js/commit/8eb91bea238f0f757695f873827ca6aa87f21cc5))
* **hub-common:** require type when calling getFamily() ([fcf58f4](https://github.com/Esri/hub.js/commit/fcf58f4041f0eec8a997f12a88326870af19df8e))
* **hub-search:** remove content search classes and functions ([8fdfac1](https://github.com/Esri/hub.js/commit/8fdfac1b631d7e4a1ae7d6d0ce5676f98ef8a23b))
* **hub-sites:** remove hub-sites re-exports from hub-common ([b3e2503](https://github.com/Esri/hub.js/commit/b3e25034e63c00efd9347953208c708342869cce))


### BREAKING CHANGES

* **hub-common:** remove hubApiSearch(), getContentSiteUrls(), & setContentSiteUrls()
* **hub-search:** remove ContentSearchService, searchContent(), searchDatasets()
* **hub-common:** removes isExtentCoordinateArray()
* **hub-common:** remove deprecated properties from hub search interfaces
* **hub-common:** remove HubProjectManager.get()
* **hub-common:** remove setContentHubId()
* **hub-common:** remove convertCatalog()
* **hub-common:** remove fetchSite()
* **hub-common:** remove hubSearchQuery()
* **hub-sites:** remove getTheme(), _addSiteDomains, registerSiteAsApplication, registerBrowserApp from hub-sites
* **hub-common:** remove deprecated properties from content
* **hub-common:** remove HubType, IBBox, IContentEnrichments, and IHubResource types
* **hub-common:** remove getItemHubType()
* **hub-common:** getFamily() requires type
* **hub-common:** remove bBoxToPolygon()

# @esri/hub-common [10.0.0-next.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.0.0-next.1...@esri/hub-common@10.0.0-next.2) (2022-07-22)


### Features

* remove functions, interfaces, tests ([#837](https://github.com/Esri/hub.js/issues/837)) ([19e0e0e](https://github.com/Esri/hub.js/commit/19e0e0e1fcfa6d0c9f5ac685f9e56cacca44d0e0))

# @esri/hub-common [10.0.0-next.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.49.0...@esri/hub-common@10.0.0-next.1) (2022-07-21)


* !feat: remove interfaces moved to components (#836) ([72e2d93](https://github.com/Esri/hub.js/commit/72e2d93cae2b5e438ee39abc7bb31b5cb190d3b8)), closes [#836](https://github.com/Esri/hub.js/issues/836)


### BREAKING CHANGES

* Removes deprecated things

* refactor: ensure next is a pre-release branch

* fix: ensure CI runs for next branch

* refactor: remove commented code/files

## @esri/hub-common [9.49.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.49.1...@esri/hub-common@9.49.2) (2022-08-02)

### Bug Fixes

* predicates need to be wrapped in parens ([58849f5](https://github.com/Esri/hub.js/commit/58849f5528fd7540d8c078604d008f7d3f532d9c))

## @esri/hub-common [9.49.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.49.0...@esri/hub-common@9.49.1) (2022-07-26)


### Bug Fixes

* enable searching groups by shared edit ([#839](https://github.com/Esri/hub.js/issues/839)) ([30b6bd7](https://github.com/Esri/hub.js/commit/30b6bd7788b8904dcc900c3ce9cfb1e85a6ebd20))

# @esri/hub-common [9.49.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.48.0...@esri/hub-common@9.49.0) (2022-07-21)


### Features

* add Catalog and Collection Classes ([#828](https://github.com/Esri/hub.js/issues/828)) ([b08d138](https://github.com/Esri/hub.js/commit/b08d138da089fac6bd1e261de4844883c60935b5))

# @esri/hub-common [9.48.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.47.0...@esri/hub-common@9.48.0) (2022-07-20)


### Features

* fetch org limits functions ([#834](https://github.com/Esri/hub.js/issues/834)) ([6bfbf19](https://github.com/Esri/hub.js/commit/6bfbf19b154f33796b10a20f5e74a838d8db09b9))

# @esri/hub-common [9.47.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.46.1...@esri/hub-common@9.47.0) (2022-07-19)


### Features

* update IHubStage to optionally include a link and linkText ([f556f3d](https://github.com/Esri/hub.js/commit/f556f3d225e891a6460e20c471762b757b4585d7))
* update IHubStage to optionally include a link property ([2fae827](https://github.com/Esri/hub.js/commit/2fae827808e009137264830ae0dba12914742e20))
* update IHubTimeline to include schemaVersion ([8cc8871](https://github.com/Esri/hub.js/commit/8cc8871209b2c389807dc0cc445017a4956c5a90))

## @esri/hub-common [9.46.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.46.0...@esri/hub-common@9.46.1) (2022-07-15)


### Bug Fixes

* correct $application well-known-type ([#831](https://github.com/Esri/hub.js/issues/831)) ([be1fe6d](https://github.com/Esri/hub.js/commit/be1fe6de137a7214e5733d4e4a1ac123f6c3e4f6))

# @esri/hub-common [9.46.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.6...@esri/hub-common@9.46.0) (2022-07-14)


### Features

* change entity search to use IQuery ([#829](https://github.com/Esri/hub.js/issues/829)) ([f3897aa](https://github.com/Esri/hub.js/commit/f3897aa6271c5c19c052da05fadaa1e349966ffe))

## @esri/hub-common [9.45.6](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.5...@esri/hub-common@9.45.6) (2022-07-07)


### Bug Fixes

* resolve null predicate issue; rename file ([#826](https://github.com/Esri/hub.js/issues/826)) ([a1318a6](https://github.com/Esri/hub.js/commit/a1318a64bb92d38e9691af3babff584220531575))

## @esri/hub-common [9.45.5](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.4...@esri/hub-common@9.45.5) (2022-07-01)


### Bug Fixes

* **hub-common:** added title to portal allow list ([e3a1cbf](https://github.com/Esri/hub.js/commit/e3a1cbf608e8c474cc72f33d10e339bd643f5215))

## @esri/hub-common [9.45.4](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.3...@esri/hub-common@9.45.4) (2022-07-01)


### Bug Fixes

* **hub-common:** fix export of a serialization function ([4b15010](https://github.com/Esri/hub.js/commit/4b15010d21a4f6d903bd56f1d9e6d9429c9e46b2))

## @esri/hub-common [9.45.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.2...@esri/hub-common@9.45.3) (2022-06-30)


### Bug Fixes

* remove filtergroups search implementation ([#819](https://github.com/Esri/hub.js/issues/819)) ([0dade7e](https://github.com/Esri/hub.js/commit/0dade7e3850b5bebb4d87ac775677e060b74ccce))

## @esri/hub-common [9.45.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.1...@esri/hub-common@9.45.2) (2022-06-28)


### Bug Fixes

* **hub-common:** fixed icon name for hub projects ([f43b596](https://github.com/Esri/hub.js/commit/f43b596c0c1fd1ef07be8e8a971feabf54c176fd))

## @esri/hub-common [9.45.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.45.0...@esri/hub-common@9.45.1) (2022-06-28)


### Bug Fixes

* update convertCatalog to return latest structure ([#816](https://github.com/Esri/hub.js/issues/816)) ([a84ecae](https://github.com/Esri/hub.js/commit/a84ecae9faf747d9bf00d2188253f127db9fd337))

# @esri/hub-common [9.45.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.44.1...@esri/hub-common@9.45.0) (2022-06-28)


### Features

* **hub-common:** remove icon and isEditing from IHubStage ([a099442](https://github.com/Esri/hub.js/commit/a09944212f14bf526e1003687a1a17e7b2420614))

## @esri/hub-common [9.44.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.44.0...@esri/hub-common@9.44.1) (2022-06-27)


### Bug Fixes

* return aggregations in hub format ([#814](https://github.com/Esri/hub.js/issues/814)) ([53d921a](https://github.com/Esri/hub.js/commit/53d921aa369eea9eceab8eaa33dd2dff6aad1756))

# @esri/hub-common [9.44.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.43.3...@esri/hub-common@9.44.0) (2022-06-24)


### Features

* hubSearch IQuery Implementation ([#812](https://github.com/Esri/hub.js/issues/812)) ([078479d](https://github.com/Esri/hub.js/commit/078479dff75bfbcb3a443352888f062025d61157))

## @esri/hub-common [9.43.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.43.2...@esri/hub-common@9.43.3) (2022-06-23)


### Bug Fixes

* **hub-common:** fix bug where enrichOrg would wrongly fetch org of the authenticated user (not the ([b32acfc](https://github.com/Esri/hub.js/commit/b32acfc2e477af5685bdef3571f679c9f4575fa5))

## @esri/hub-common [9.43.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.43.1...@esri/hub-common@9.43.2) (2022-06-22)


### Performance Improvements

* **hub-common:** fetchContent returns cached recordCount when it can ([3b9b2d6](https://github.com/Esri/hub.js/commit/3b9b2d680a84229af4cd5f2d0fffa8e013e0491a))

## @esri/hub-common [9.43.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.43.0...@esri/hub-common@9.43.1) (2022-06-15)


### Bug Fixes

* whitespace change to kick a release ([d40f5fb](https://github.com/Esri/hub.js/commit/d40f5fbe9e20829e897b75bf2691e218af65851d))

# @esri/hub-common [9.43.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.42.0...@esri/hub-common@9.43.0) (2022-06-15)


### Bug Fixes

* force release ([60c7eae](https://github.com/Esri/hub.js/commit/60c7eae8ce020580824cf638583df2d80eba0567))
* force release - 2 ([25f3815](https://github.com/Esri/hub.js/commit/25f381506e409b823b5a9be718c7542704eb81d5))
* force release due to ci network failure - take 2 ([dbbf4d9](https://github.com/Esri/hub.js/commit/dbbf4d91b5c62f0c864d7627ffe42e9617a489d0))
* reset version numbers so hopefully it can release ([8da9264](https://github.com/Esri/hub.js/commit/8da9264a15040ae06964eddcfda639009a927be0))


### Features

* add well-known-type filter expansions ([#808](https://github.com/Esri/hub.js/issues/808)) ([168671e](https://github.com/Esri/hub.js/commit/168671e86e8bba089f249836a4eb714272ab5bff))

# @esri/hub-common [9.43.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.42.0...@esri/hub-common@9.43.0) (2022-06-15)


### Bug Fixes

* force release due to ci network failure - take 2 ([dbbf4d9](https://github.com/Esri/hub.js/commit/dbbf4d91b5c62f0c864d7627ffe42e9617a489d0))


### Features

* add well-known-type filter expansions ([#808](https://github.com/Esri/hub.js/issues/808)) ([168671e](https://github.com/Esri/hub.js/commit/168671e86e8bba089f249836a4eb714272ab5bff))

# @esri/hub-common [9.43.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.42.0...@esri/hub-common@9.43.0) (2022-06-15)


### Features

* add well-known-type filter expansions ([#808](https://github.com/Esri/hub.js/issues/808)) ([168671e](https://github.com/Esri/hub.js/commit/168671e86e8bba089f249836a4eb714272ab5bff))

# @esri/hub-common [9.42.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.41.1...@esri/hub-common@9.42.0) (2022-06-14)


### Features

* **hub-common:** add isExternal flag to IHubContent's publisher field ([8f2f794](https://github.com/Esri/hub.js/commit/8f2f794d82c94163eddfb418376c0dc23a69c37b))
* **hub-common:** add metadata.contact as a possible source for IHubContent's publisher field ([2fc486e](https://github.com/Esri/hub.js/commit/2fc486e7aeb12f80881f079305f1678e64a1300d))

## @esri/hub-common [9.41.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.41.0...@esri/hub-common@9.41.1) (2022-06-13)


### Bug Fixes

* allow specific props to propogate through to ISearchOptions ([#802](https://github.com/Esri/hub.js/issues/802)) ([32a4c70](https://github.com/Esri/hub.js/commit/32a4c70ee281bdc1fee7cfa86cf6864c93391ada))

# @esri/hub-common [9.41.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.40.0...@esri/hub-common@9.41.0) (2022-06-10)


### Features

* add user search fns ([#806](https://github.com/Esri/hub.js/issues/806)) ([9ea6317](https://github.com/Esri/hub.js/commit/9ea6317f139aff61757c50c099bdca94192c8327))

# @esri/hub-common [9.40.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.39.0...@esri/hub-common@9.40.0) (2022-06-10)


### Bug Fixes

* **hub-common:** enrichOrg uses authentication.portal as a fallback ([1ff49a5](https://github.com/Esri/hub.js/commit/1ff49a58bd486e1b2007e80d2e08235e2e8e499d))


### Features

* **hub-common:** fetch org enrichment in fetchContent and add fallback logic for publisher in compo ([ca89c23](https://github.com/Esri/hub.js/commit/ca89c230377112b855e8ea97f64259dfe19add23))

# @esri/hub-common [9.39.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.38.0...@esri/hub-common@9.39.0) (2022-06-06)


### Features

* add scope to ICatalog and ICollection ([#803](https://github.com/Esri/hub.js/issues/803)) ([5a965c5](https://github.com/Esri/hub.js/commit/5a965c57b993c08317f72feaab8f594521029c37))

# @esri/hub-common [9.38.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.37.0...@esri/hub-common@9.38.0) (2022-06-02)


### Features

* add hubSearch subsystem ([#801](https://github.com/Esri/hub.js/issues/801)) ([eefc831](https://github.com/Esri/hub.js/commit/eefc83157d0958e10acab079b24652550e14b02e))

# @esri/hub-common [9.37.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.36.0...@esri/hub-common@9.37.0) (2022-05-26)


### Features

* add bBoxToExtent(), extentToPolygon(), and getExtentCenter() utils ([b688776](https://github.com/Esri/hub.js/commit/b68877643ff1bae5c6cfa10d14175481c5208128))

# @esri/hub-common [9.36.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.35.0...@esri/hub-common@9.36.0) (2022-05-24)


### Features

* **hub-common:** createItemFromUrlOrFile rtrns itm title, access chnge resp, and item chnge resp ([#799](https://github.com/Esri/hub.js/issues/799)) ([6894ad8](https://github.com/Esri/hub.js/commit/6894ad896effa14a295d76702761438a2c3a7e35))

# @esri/hub-common [9.35.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.34.0...@esri/hub-common@9.35.0) (2022-05-23)


### Features

* **hub-common:** add orderBy field to the IFacet interface ([67bcbc5](https://github.com/Esri/hub.js/commit/67bcbc5d82c0f64c3d7b5b8af0c519e332022026))

# @esri/hub-common [9.34.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.33.0...@esri/hub-common@9.34.0) (2022-05-20)


### Features

* **hub-common:** add project family to compose flow ([2285f8c](https://github.com/Esri/hub.js/commit/2285f8c4f3f42895901836d3c598b6ca3b611ba1))

# @esri/hub-common [9.33.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.32.1...@esri/hub-common@9.33.0) (2022-05-19)


### Features

* add FilterGroup functions ([#794](https://github.com/Esri/hub.js/issues/794)) ([fabd8e7](https://github.com/Esri/hub.js/commit/fabd8e7cf34c058784433cb744a01bee580048ac))

## @esri/hub-common [9.32.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.32.0...@esri/hub-common@9.32.1) (2022-05-18)


### Bug Fixes

* **hub-common:** fixes a type error when checking if additional resource is an item data source ([edb1118](https://github.com/Esri/hub.js/commit/edb1118487ab92211e14a19bb1bbdc0ef2006d8f))

# @esri/hub-common [9.32.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.31.3...@esri/hub-common@9.32.0) (2022-05-17)


### Features

* add search related interfaces ([#780](https://github.com/Esri/hub.js/issues/780)) ([4f8929d](https://github.com/Esri/hub.js/commit/4f8929dc1c5c9cac6dd70dedef2207b7222259df))

## @esri/hub-common [9.31.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.31.2...@esri/hub-common@9.31.3) (2022-05-12)


### Bug Fixes

* **hub-common:** remove leadingElement and trailingElement and make isEditing optional ([60d2a74](https://github.com/Esri/hub.js/commit/60d2a740656dff5f9bfcde1417115937189a371c))
* **hub-common:** use key as the stage identifier ([e0d2cbd](https://github.com/Esri/hub.js/commit/e0d2cbd23465bfc42283f7b4675e36ab6e736d14))

## @esri/hub-common [9.31.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.31.1...@esri/hub-common@9.31.2) (2022-05-12)


### Bug Fixes

* **hub-common:** revert unintended breaking change: getFamily() requires type ([97d0e12](https://github.com/Esri/hub.js/commit/97d0e12566a99de14e1887109293ce91e1d24f0a))

## @esri/hub-common [9.31.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.31.0...@esri/hub-common@9.31.1) (2022-05-12)


### Bug Fixes

* **hub-common:** createItemFromFile properly copies file / handles object mutation ([#790](https://github.com/Esri/hub.js/issues/790)) ([3ecfc1a](https://github.com/Esri/hub.js/commit/3ecfc1a19e52faba4980e4ce93eafcc6e523da51))

# @esri/hub-common [9.31.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.30.1...@esri/hub-common@9.31.0) (2022-05-12)


### Features

* **hub-common:** export createItemFromUrlOrFile ([#789](https://github.com/Esri/hub.js/issues/789)) ([6f30beb](https://github.com/Esri/hub.js/commit/6f30beb41c8917a5e9e4b9c432908e57bb9655f0))

## @esri/hub-common [9.30.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.30.0...@esri/hub-common@9.30.1) (2022-05-11)


### Bug Fixes

* **hub-common:** fix issue where enrichServer was actually fetching the layer for reference layer it ([b11dcb4](https://github.com/Esri/hub.js/commit/b11dcb447a0e93165921fddc7a7ef486044144e9))

# @esri/hub-common [9.30.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.29.0...@esri/hub-common@9.30.0) (2022-05-09)


### Features

* **hub-common:** createItemFromUrlOrFile can also share created item to n groups ([e3c8dd9](https://github.com/Esri/hub.js/commit/e3c8dd9921ab832811f0118f6576a56854ea1757))

# @esri/hub-common [9.29.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.28.0...@esri/hub-common@9.29.0) (2022-04-21)


### Features

* **hub-common:** add convertCatalog function ([#775](https://github.com/Esri/hub.js/issues/775)) ([ce4a36b](https://github.com/Esri/hub.js/commit/ce4a36bdfdb046eb64c075b397056d489ba250c0))

# @esri/hub-common [9.28.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.27.0...@esri/hub-common@9.28.0) (2022-04-12)


### Features

* **hub-common:** add aggregations to seachContentEntities + tests ([2867cd4](https://github.com/Esri/hub.js/commit/2867cd4e59c202d95ef62fe098b89e766662dde9))

# @esri/hub-common [9.27.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.26.2...@esri/hub-common@9.27.0) (2022-04-11)


### Features

* dynamic facets, state functions ([#772](https://github.com/Esri/hub.js/issues/772)) ([6260a82](https://github.com/Esri/hub.js/commit/6260a82964acd79d699fcfa3ec4a62c212c68c00))

## @esri/hub-common [9.26.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.26.1...@esri/hub-common@9.26.2) (2022-04-08)


### Bug Fixes

* **hub-common:** add start parameter to IHubSearchOptions ([c779b56](https://github.com/Esri/hub.js/commit/c779b56ec2a78fbdea84a69afb896c9352f8b831))
* **hub-common:** allows start param to be passed into Project searches ([7f4aa5c](https://github.com/Esri/hub.js/commit/7f4aa5c4dc5290f42341376963d07ad1752178eb))

## @esri/hub-common [9.26.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.26.0...@esri/hub-common@9.26.1) (2022-04-06)


### Bug Fixes

* **hub-common:** fixes removeContextFromSlug to ensure entire context included ([142fd3e](https://github.com/Esri/hub.js/commit/142fd3edb957ac508a0a180e7b91505b1f53b327))

# @esri/hub-common [9.26.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.7...@esri/hub-common@9.26.0) (2022-04-05)


### Features

* **hub-common:** migrate validateUrl function from ember application ([#765](https://github.com/Esri/hub.js/issues/765)) ([39acf77](https://github.com/Esri/hub.js/commit/39acf77a176c65cf891cd27b2bcfba980518adef))

## @esri/hub-common [9.25.7](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.6...@esri/hub-common@9.25.7) (2022-04-04)


### Bug Fixes

* **hub-common:** fix issues composing proxied csvs ([5004f4e](https://github.com/Esri/hub.js/commit/5004f4ec8bb3a5ec10392eb22838d8cf81b46fff))

## @esri/hub-common [9.25.6](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.5...@esri/hub-common@9.25.6) (2022-04-01)


### Bug Fixes

* **hub-common:** re-fetch target layer for legacy services that return sparsely populated layers in ([91af598](https://github.com/Esri/hub.js/commit/91af598a94c4eb6b5dea353ee53d6b8ef694d403))

## @esri/hub-common [9.25.5](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.4...@esri/hub-common@9.25.5) (2022-03-31)


### Bug Fixes

* **hub-common:** fix additional resource logic to handle metadata props possibly being arrays ([717791a](https://github.com/Esri/hub.js/commit/717791aa4531ff1387003fd6dbcee6f54438561e))

## @esri/hub-common [9.25.4](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.3...@esri/hub-common@9.25.4) (2022-03-31)


### Bug Fixes

* **hub-common:** added a quick test for coverage ([6d5ec60](https://github.com/Esri/hub.js/commit/6d5ec6017dbec842c6b8f9b2fd679d1d0be8b067))
* **hub-common:** defaults q param of fetchItemsBySlug to be slug and adds portal ([9d8d04a](https://github.com/Esri/hub.js/commit/9d8d04ac05213c87c21762b5df147468c619f61a))
* **hub-common:** fixes null pointer when fetching a project ([59fd401](https://github.com/Esri/hub.js/commit/59fd401e900abfac9bf5fd453d84ad0fe3ebd7e2))
* **hub-common:** revert automatic assignment of q when searching by slug ([9af7f8e](https://github.com/Esri/hub.js/commit/9af7f8e099ae6d0f6e32fbc8eb9d148593fa416c))

## @esri/hub-common [9.25.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.2...@esri/hub-common@9.25.3) (2022-03-30)


### Bug Fixes

* **hub-common:** searchDescription is for content.summary not content.description ([477229c](https://github.com/Esri/hub.js/commit/477229cacc5eb3c78cf63634ca031f734cb632da))

## @esri/hub-common [9.25.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.1...@esri/hub-common@9.25.2) (2022-03-25)


### Bug Fixes

* **hub-common:** fix composeContent to prefer layer spatialReference to item spatialReference and re ([61f5952](https://github.com/Esri/hub.js/commit/61f59525aef3286d9f01d87b910542879ed85967))

## @esri/hub-common [9.25.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.25.0...@esri/hub-common@9.25.1) (2022-03-24)


### Bug Fixes

* **hub-common:** fetchContent() handles & returns non-fatal errors ([477b0e7](https://github.com/Esri/hub.js/commit/477b0e7d64aa85f265486e5574c6ddba453bcc4f))

# @esri/hub-common [9.25.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.24.2...@esri/hub-common@9.25.0) (2022-03-23)


### Features

* force release ([#756](https://github.com/Esri/hub.js/issues/756)) ([e248015](https://github.com/Esri/hub.js/commit/e248015a02a57389a0dbc1e93cb1731cbff56094))
* release HubSite and HubSiteManager ([#755](https://github.com/Esri/hub.js/issues/755)) ([42a702d](https://github.com/Esri/hub.js/commit/42a702d5ff72b59020d19ff244e7239f224c184a))

## @esri/hub-common [9.24.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.24.1...@esri/hub-common@9.24.2) (2022-03-22)


### Bug Fixes

* **hub-common:** fetchContentRecordCount did not pass auth nor handle errors ([be79422](https://github.com/Esri/hub.js/commit/be794228a66de0eb818b8687ae908f4d30629e73))

## @esri/hub-common [9.24.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.24.0...@esri/hub-common@9.24.1) (2022-03-21)


### Bug Fixes

* **hub-common:** use accordionClosed instead of accordionOpen ([21c410a](https://github.com/Esri/hub.js/commit/21c410acfc8862f24729c5b2ba256be5e110133f))

# @esri/hub-common [9.24.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.23.3...@esri/hub-common@9.24.0) (2022-03-21)


### Features

* **hub-common:** add optional accordionOpen and pageSize to IFacet interface' ([25233b5](https://github.com/Esri/hub.js/commit/25233b5427370d276eda90f4960d91181f43432c))

## @esri/hub-common [9.23.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.23.2...@esri/hub-common@9.23.3) (2022-03-21)


### Bug Fixes

* **hub-common:** add @esri/arcgis-rest-feature-layer as dependency of hub-common ([f8e45b5](https://github.com/Esri/hub.js/commit/f8e45b5ce6034c3039d4b89cd30f2fb987db5e06))
* **hub-common:** only fetch record count for feature layers and tables (e.g. not raster layers) and ([1a7123a](https://github.com/Esri/hub.js/commit/1a7123a08e8b43d716c7c0a295689361eb810475))

## @esri/hub-common [9.23.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.23.1...@esri/hub-common@9.23.2) (2022-03-18)


### Bug Fixes

* **hub-common:** strip _ from content name and title; content.layer is never false ([7066922](https://github.com/Esri/hub.js/commit/7066922a24bb36194c82ae0e54ef452f56c8103e))

## @esri/hub-common [9.23.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.23.0...@esri/hub-common@9.23.1) (2022-03-17)


### Bug Fixes

* **hub-common:** fix urls for single-layer feature services and fix 0 falsy comparision ([9aa478e](https://github.com/Esri/hub.js/commit/9aa478e653fd254625efdfffa833d6f7d1f81167))

# @esri/hub-common [9.23.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.22.0...@esri/hub-common@9.23.0) (2022-03-16)


### Bug Fixes

* **hub-common:** first layer view definition applied to all layers ([4f7ed57](https://github.com/Esri/hub.js/commit/4f7ed57f1acc00190fc5190d5abd057b833b7497))


### Features

* **hub-common:** add viewDefinition and recordCount to fetchContent() response ([2740f00](https://github.com/Esri/hub.js/commit/2740f00d11e609e9d97ffaaee1ec302655495be4))

# @esri/hub-common [9.22.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.21.2...@esri/hub-common@9.22.0) (2022-03-01)


### Features

* **hub-common:** add fetchContent() ([064df1d](https://github.com/Esri/hub.js/commit/064df1d479e13b74832eaef50ff7a3c5be28d1e7))

## @esri/hub-common [9.21.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.21.1...@esri/hub-common@9.21.2) (2022-02-28)


### Bug Fixes

* **hub-common:** fix missing extent in datasetToContent() ([05e4769](https://github.com/Esri/hub.js/commit/05e4769132ea4d637d33e724ead6de5c7a9d9546))

## @esri/hub-common [9.21.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.21.0...@esri/hub-common@9.21.1) (2022-02-28)


### Bug Fixes

* final item type for hub projects ([#736](https://github.com/Esri/hub.js/issues/736)) ([0de27bb](https://github.com/Esri/hub.js/commit/0de27bbaea35079ae7107888a17c82ee87a32a82))

# @esri/hub-common [9.21.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.20.0...@esri/hub-common@9.21.0) (2022-02-28)


### Bug Fixes

* **hub-common:** fix incorrect parentheses/brackets in the test for composeContent ([c889c5c](https://github.com/Esri/hub.js/commit/c889c5c706d5e189b9775d4f4b2d542e3ae020dc))


### Features

* **hub-common:** add additional resources to IHubContent composition logic ([5b49541](https://github.com/Esri/hub.js/commit/5b49541fa56b2c273128a4857985b9f1cb9f0709))
* **hub-common:** conditionally append auth tokens onto addition resource urls ([faba8a0](https://github.com/Esri/hub.js/commit/faba8a03db2457abca320562ebe885c9b7ef3739))

# @esri/hub-common [9.20.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.19.0...@esri/hub-common@9.20.0) (2022-02-25)


### Features

* **hub-common:** add removeDomainsBySiteId() ([ddb5999](https://github.com/Esri/hub.js/commit/ddb59992f071cd72e90b5bdc84b9c1809e415293)), closes [#3230](https://github.com/Esri/hub.js/issues/3230)

# @esri/hub-common [9.19.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.18.0...@esri/hub-common@9.19.0) (2022-02-22)


### Features

* **hub-common:** add composeContent() ([2e549b1](https://github.com/Esri/hub.js/commit/2e549b184509bd7c0871cb895f974405c15a340f))

# @esri/hub-common [9.18.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.17.1...@esri/hub-common@9.18.0) (2022-02-18)


### Features

* project search and set thumbnail fns ([#727](https://github.com/Esri/hub.js/issues/727)) ([43f2143](https://github.com/Esri/hub.js/commit/43f2143f0ef46bb1add6ee236a03550c70a06880))

## @esri/hub-common [9.17.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.17.0...@esri/hub-common@9.17.1) (2022-02-17)


### Bug Fixes

* **hub-common:** fix circular import dependency in HubError ([51cc327](https://github.com/Esri/hub.js/commit/51cc327d72499a2844b442f3f04aa4ecad3a1e0c))

# @esri/hub-common [9.17.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.16.0...@esri/hub-common@9.17.0) (2022-02-16)


### Features

* **hub-common:** add defaultOrder and order props to ISortOption ([2ce21b7](https://github.com/Esri/hub.js/commit/2ce21b71bb9d387dcd37a7667c476ca5638e9a88))

# @esri/hub-common [9.16.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.15.0...@esri/hub-common@9.16.0) (2022-02-16)


### Features

* **hub-common:** add isProxiedCSV and getProxyUrl utils ([06812bb](https://github.com/Esri/hub.js/commit/06812bbbbe709c47945be3095187294e9f8381f1))

# @esri/hub-common [9.15.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.14.1...@esri/hub-common@9.15.0) (2022-02-12)


### Features

* add HubProjects module ([#714](https://github.com/Esri/hub.js/issues/714)) ([92e5b10](https://github.com/Esri/hub.js/commit/92e5b10b6343396ac732aeb4deb1a9cc11de5919))

## @esri/hub-common [9.14.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.14.0...@esri/hub-common@9.14.1) (2022-02-07)


### Bug Fixes

* **hub-common:** add missing content type icons ([8171b94](https://github.com/Esri/hub.js/commit/8171b944c77fe0b901d11cca3708201c651e9623))
* **hub-common:** add missing content type icons in getContentTypeIcon mapping ([eb6225f](https://github.com/Esri/hub.js/commit/eb6225f59c9c219035fb48fd5e35b053edd7f9ed))

# @esri/hub-common [9.14.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.13.2...@esri/hub-common@9.14.0) (2022-01-25)


### Bug Fixes

* export IArcGISContextState correctly ([2d392fd](https://github.com/Esri/hub.js/commit/2d392fd76685f6474ee4261d2123e0395157f225))
* rebase mess up ([22fc4d5](https://github.com/Esri/hub.js/commit/22fc4d5a0a71415955de3238fa9d517e5d90cb25))


### Features

* change context class names ([e03c939](https://github.com/Esri/hub.js/commit/e03c9395bd62566231b509b787d233b45472f0a0))

## @esri/hub-common [9.13.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.13.1...@esri/hub-common@9.13.2) (2022-01-22)


### Bug Fixes

* more optional params to ArcGISContext ([#707](https://github.com/Esri/hub.js/issues/707)) ([0f9c6a7](https://github.com/Esri/hub.js/commit/0f9c6a7d5fbaf438d7499affe29433d70e534bb0))

## @esri/hub-common [9.13.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.13.0...@esri/hub-common@9.13.1) (2022-01-21)


### Bug Fixes

* add state to ArcGISContext ([9adc787](https://github.com/Esri/hub.js/commit/9adc787db2cd6951cd1a4d467788759ef06ff830))
* add state to ArcGISContext ([#704](https://github.com/Esri/hub.js/issues/704)) ([079e97d](https://github.com/Esri/hub.js/commit/079e97dcdd9bc143bee7e6cb2b56f85156818e77))

# @esri/hub-common [9.13.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.12.0...@esri/hub-common@9.13.0) (2022-01-20)


### Features

* add ArcGISContext ([8edb213](https://github.com/Esri/hub.js/commit/8edb213bc02b9a921a9a25ab1a4a7c0c7dda6f83))

# @esri/hub-common [9.12.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.11.0...@esri/hub-common@9.12.0) (2022-01-13)


### Features

* **hub-common:** get content type icon and content type label in itemToContent ([c7942da](https://github.com/Esri/hub.js/commit/c7942da78d5ca0fa704ae65430a4c22f5fbfb677))

# @esri/hub-common [9.11.0](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.10.2...@esri/hub-common@9.11.0) (2022-01-08)


### Features

* **hub-common:** add URLify function that converts urls in a string to hyperlinks ([1a3035a](https://github.com/Esri/hub.js/commit/1a3035a5080a47efd7f027b5ccb68a308da0d96a))

## @esri/hub-common [9.10.2](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.10.1...@esri/hub-common@9.10.2) (2022-01-06)


### Bug Fixes

* **hub-common:** minor change to hopefully push 9.10.2, and update workflow ([66a1287](https://github.com/Esri/hub.js/commit/66a1287b91cee20fe20ab5a1c996ff3185582ee2))

## @esri/hub-common [9.10.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.10.0...@esri/hub-common@9.10.1) (2022-01-06)


### Bug Fixes

* **hub-common:** pass item owner name to shareItemToGroups and unshar… ([#697](https://github.com/Esri/hub.js/issues/697)) ([dd9bd1b](https://github.com/Esri/hub.js/commit/dd9bd1b7e8106f725ae1cde643fb6e42a7d4e47c))

## @esri/hub-common [9.10.1-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@9.10.0...@esri/hub-common@9.10.1-beta.1) (2022-01-04)

### Bug Fixes

- relative date test failed for January/December ([d3a9830](https://github.com/Esri/hub.js/commit/d3a9830e764ab6b9dc571aeddc8c200f73440f74))

# ALL PRIOR CHANGES ARE IN THE ROOT CHANGELOG FILE
