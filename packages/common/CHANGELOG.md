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
