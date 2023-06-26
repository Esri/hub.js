# @esri/hub-discussions [25.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@25.0.0...@esri/hub-discussions@25.1.0) (2023-06-26)


### Features

* **hub-discussions:** add acl authentication to channel util function canModifyChannel ([#1092](https://github.com/Esri/hub.js/issues/1092)) ([f4190a4](https://github.com/Esri/hub.js/commit/f4190a4167f6926b37b9aa24760d40533f6aa108))

# @esri/hub-discussions [25.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@24.4.0...@esri/hub-discussions@25.0.0) (2023-06-23)


### Features

* **hub-discussions:** remove channel util function isChannelInclusive ([#1091](https://github.com/Esri/hub.js/issues/1091)) ([5d36f9b](https://github.com/Esri/hub.js/commit/5d36f9b81e5bfefdbe8ec5867fe7b542388a658a))


### BREAKING CHANGES

* **hub-discussions:** remove channel util function isChannelInclusive

* refactor(hub-discussions): remove function updatePostSharing and associated interfaces

affects: @esri/hub-discussions
* **hub-discussions:** remove function updatePostSharing and associated interfaces

* test(hub-discussions): remove tests for updatePostSharing function

affects: @esri/hub-discussions

* fix(hub-discussions): bump hub-common peerDependency to ^13.0.0

affects: @esri/hub-discussions

# @esri/hub-discussions [24.4.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@24.3.0...@esri/hub-discussions@24.4.0) (2023-06-13)


### Features

* **hub-discussions:** expanded enum ([#1080](https://github.com/Esri/hub.js/issues/1080)) ([2a121b4](https://github.com/Esri/hub.js/commit/2a121b49e36f07f326918a5b67b1da2d73e7841f))

# @esri/hub-discussions [24.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@24.2.0...@esri/hub-discussions@24.3.0) (2023-06-08)


### Features

* **hub-discussions:** add optional guidelineUrl to IChannel and ICre… ([#1078](https://github.com/Esri/hub.js/issues/1078)) ([6f889a3](https://github.com/Esri/hub.js/commit/6f889a30546a6a3fe7c796a3550a6db5dc67ba81))

# @esri/hub-discussions [24.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@24.1.0...@esri/hub-discussions@24.2.0) (2023-06-07)


### Features

* **hub-discussions:** legacy permission checks mixed channels ([#1070](https://github.com/Esri/hub.js/issues/1070)) ([07ae63d](https://github.com/Esri/hub.js/commit/07ae63d1cd0e8f039c569d13c86aae89a8421fca))

# @esri/hub-discussions [24.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@24.0.1...@esri/hub-discussions@24.1.0) (2023-06-06)


### Features

* **hub-discussions:** expand isDiscussable ([#1079](https://github.com/Esri/hub.js/issues/1079)) ([73db7f1](https://github.com/Esri/hub.js/commit/73db7f1c9f7edd3c2bf402b95b87329886877173))

## @esri/hub-discussions [24.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@24.0.0...@esri/hub-discussions@24.0.1) (2023-06-02)


### Bug Fixes

* **hub-discussions:** move allowAnonymous to channel permissions interface and add access to channel ([#1075](https://github.com/Esri/hub.js/issues/1075)) ([82c59ad](https://github.com/Esri/hub.js/commit/82c59ad7083971aafca0c5f2360030815dd7bd8c))

# @esri/hub-discussions [24.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@23.0.0...@esri/hub-discussions@24.0.0) (2023-05-26)


### Features

* remove calls to register or update app ([#1069](https://github.com/Esri/hub.js/issues/1069)) ([1aa361f](https://github.com/Esri/hub.js/commit/1aa361ff75d1bb5017871de2470d3381bfe27c5d))


### BREAKING CHANGES

* Client code no longer makes calls to
register site as application or to update application redirect
uris. This is all expected to be handled server-side by the Hub Domain
service.
* remove deprecated destroySite()

* fix: update peerDeps'

# @esri/hub-discussions [23.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@22.2.0...@esri/hub-discussions@23.0.0) (2023-05-24)


### Features

* **hub-discussions:** updated IPost and IPostOptions to support anonymous ([#1066](https://github.com/Esri/hub.js/issues/1066)) ([ca61c57](https://github.com/Esri/hub.js/commit/ca61c573639e2d1b74ad08f1af440cb2b0b36c52))


### BREAKING CHANGES

* **hub-discussions:** Makes editor and creator optional on IPost interface

# @esri/hub-discussions [22.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@22.1.3...@esri/hub-discussions@22.2.0) (2023-05-16)


### Features

* **hub-discussions:** update canModifyPostStatus to use channelAcl i… ([#1060](https://github.com/Esri/hub.js/issues/1060)) ([b003bb4](https://github.com/Esri/hub.js/commit/b003bb4e8f8d6e3c9d81f9536d2dff8ea438c3ae))

## @esri/hub-discussions [22.1.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@22.1.2...@esri/hub-discussions@22.1.3) (2023-04-27)


### Bug Fixes

* parseMentionedUsers supports usernames containing @ . and - characters ([#1042](https://github.com/Esri/hub.js/issues/1042)) ([61a36ad](https://github.com/Esri/hub.js/commit/61a36ade0cd30b62bbec5caa756ec1eecc81c49d))

## @esri/hub-discussions [22.1.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@22.1.1...@esri/hub-discussions@22.1.2) (2023-04-19)


### Bug Fixes

* auth issue in searchPosts ([#1035](https://github.com/Esri/hub.js/issues/1035)) ([a7465d6](https://github.com/Esri/hub.js/commit/a7465d601f316950a2069a4684b034908161e977))

## @esri/hub-discussions [22.1.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@22.1.0...@esri/hub-discussions@22.1.1) (2023-04-19)


### Bug Fixes

* serialize geometry parameter for searchPosts call ([#1034](https://github.com/Esri/hub.js/issues/1034)) ([4912bac](https://github.com/Esri/hub.js/commit/4912bacd85042cece2a8bb09150cbc475f4df7ff))

# @esri/hub-discussions [22.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@22.0.0...@esri/hub-discussions@22.1.0) (2023-04-18)


### Features

* add additional reactions to PostReaction enum ([#1030](https://github.com/Esri/hub.js/issues/1030)) ([426c305](https://github.com/Esri/hub.js/commit/426c3053fc20573b2df9bc37305b0170fded27e9))

# @esri/hub-discussions [22.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@21.0.1...@esri/hub-discussions@22.0.0) (2023-04-14)


### Features

* **hub-discussions:** remove settings from ChannelRelation ([a780eb3](https://github.com/Esri/hub.js/commit/a780eb3f0829d53b7ee507b89d490d30c595b3fd))


### BREAKING CHANGES

* **hub-discussions:** settings is no longer an available ChannelRelation

## @esri/hub-discussions [21.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@21.0.0...@esri/hub-discussions@21.0.1) (2023-04-03)


### Bug Fixes

* **hub-discussions:** add optional properties to IUpdatePost ([3bdbccb](https://github.com/Esri/hub.js/commit/3bdbccbae8d9fd0beacd58ba977ab691797d49a0))

# @esri/hub-discussions [21.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@20.0.1...@esri/hub-discussions@21.0.0) (2023-03-23)


### Features

* **hub-discussions:** consolidate post reactions to a single property - reactions ([4ff1356](https://github.com/Esri/hub.js/commit/4ff13566ac97d24051a04f1c7dc35c54feea18d8))


### BREAKING CHANGES

* **hub-discussions:** Remove IPost.userReactions. Change IPost.reactions to IReaction[]. Remove type PostReactionSummary

## @esri/hub-discussions [20.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@20.0.0...@esri/hub-discussions@20.0.1) (2023-03-21)


### Bug Fixes

* **hub-discussions:** remove channelAclDefinition as a channel and post create option ([ec36498](https://github.com/Esri/hub.js/commit/ec3649874938ed4798c0fc8a0aa64cc7744466f6))

# @esri/hub-discussions [20.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.5.1...@esri/hub-discussions@20.0.0) (2023-03-13)


### Features

* **hub-discussions:** remove support for acl permission object ([bd1ef95](https://github.com/Esri/hub.js/commit/bd1ef95402689673c2ee79b25d77a67e64cea2ea))


### BREAKING CHANGES

* **hub-discussions:** support for acl is removed from all channel functions (replaced with channelAcl)

## @esri/hub-discussions [19.5.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.5.0...@esri/hub-discussions@19.5.1) (2023-02-08)


### Bug Fixes

* **hub-sites:** fix peerDependencies should not be fixed to a specific version ([b236ce0](https://github.com/Esri/hub.js/commit/b236ce051302b8aa5eba4b07c3d0b5100e0c4a6a))

# @esri/hub-discussions [19.5.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.4.3...@esri/hub-discussions@19.5.0) (2023-02-06)





### Dependencies

* **@esri/hub-common:** upgraded to 12.4.0

## @esri/hub-discussions [19.4.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.4.2...@esri/hub-discussions@19.4.3) (2023-01-25)





### Dependencies

* **@esri/hub-common:** upgraded to 12.3.2

## @esri/hub-discussions [19.4.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.4.1...@esri/hub-discussions@19.4.2) (2023-01-19)


### Bug Fixes

* resolve node import issues... take 3 ([0ee1260](https://github.com/Esri/hub.js/commit/0ee1260fbfc8e4e9ef3ad281db1132cefd2fdf05))





### Dependencies

* **@esri/hub-common:** upgraded to 12.3.1

# @esri/hub-discussions [19.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.2.1...@esri/hub-discussions@19.3.0) (2023-01-18)

### Features

- **hub-discussions:** add channelAcl as a possible channel relation ([b96e63c](https://github.com/Esri/hub.js/commit/b96e63cb465311b46feea2d78478c2782ab28a89))

## @esri/hub-discussions [19.2.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.2.0...@esri/hub-discussions@19.2.1) (2023-01-18)

### Dependencies

- **@esri/hub-common:** upgraded to 12.2.1

# @esri/hub-discussions [19.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.1.0...@esri/hub-discussions@19.2.0) (2023-01-13)

### Dependencies

- **@esri/hub-common:** upgraded to 12.2.0

# @esri/hub-discussions [19.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@19.0.0...@esri/hub-discussions@19.1.0) (2023-01-12)

### Dependencies

- **@esri/hub-common:** upgraded to 12.1.0

# @esri/hub-discussions [19.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@18.2.1...@esri/hub-discussions@19.0.0) (2023-01-05)

### Features

- Permissions and Capabilities subsystems ([#952](https://github.com/Esri/hub.js/issues/952)) ([d52c124](https://github.com/Esri/hub.js/commit/d52c1240027113ba75fc0dd48619472128436a9b)), closes [#933](https://github.com/Esri/hub.js/issues/933)

### BREAKING CHANGES

- removes PermissionManager; permission fns are exposed
  on HubItemEntity
- canEdit canDelete are now sync getters

Co-authored-by: semantic-release-bot <semantic-release-bot@martynus.net>

### Dependencies

- **@esri/hub-common:** upgraded to 12.0.0

## @esri/hub-discussions [18.2.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@18.2.0...@esri/hub-discussions@18.2.1) (2023-01-04)

### Dependencies

- **@esri/hub-common:** upgraded to 12.0.0-alpha.1

## @esri/hub-discussions [16.0.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@16.0.1...@esri/hub-discussions@16.0.2) (2022-11-18)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.2

## @esri/hub-discussions [16.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@16.0.0...@esri/hub-discussions@16.0.1) (2022-11-08)

### Bug Fixes

- **hub-discussions:** add to export ([f7ae8d8](https://github.com/Esri/hub.js/commit/f7ae8d8e750ae8c606b1156d9b988787943ddc96))
- **hub-discussions:** fix test imports ([992cd69](https://github.com/Esri/hub.js/commit/992cd6901bac1e7362a0f9292a542c59148e8720))
- **hub-discussions:** repackage types into a single file ([b5b9232](https://github.com/Esri/hub.js/commit/b5b9232b4f89a0d086b300a9067040927a62c77d))

# @esri/hub-discussions [16.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@15.2.1...@esri/hub-discussions@16.0.0) (2022-11-08)

### Bug Fixes

- **hub-discussions:** fix circular import ([5b8f0e7](https://github.com/Esri/hub.js/commit/5b8f0e7749a5b38fae6a9994e15addf2d96739ea))
- **hub-discussions:** refactor discussion interfaces ([f93fbba](https://github.com/Esri/hub.js/commit/f93fbba2bd9282042cde2082be9cf01b50ebd034))

### BREAKING CHANGES

- **hub-discussions:** interface changes for channel, post, and reaction

## @esri/hub-discussions [15.2.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@15.2.0...@esri/hub-discussions@15.2.1) (2022-11-04)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.1

# @esri/hub-discussions [15.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@15.1.1...@esri/hub-discussions@15.2.0) (2022-11-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.0

## @esri/hub-discussions [15.1.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@15.1.0...@esri/hub-discussions@15.1.1) (2022-11-03)

### Bug Fixes

- **hub-discussions:** properly export types and interfaces ([a228776](https://github.com/Esri/hub.js/commit/a22877661e9b03286806e35baa3bdb7635016d3b))

# @esri/hub-discussions [15.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@15.0.0...@esri/hub-discussions@15.1.0) (2022-11-01)

### Dependencies

- **@esri/hub-common:** upgraded to 11.22.0

# @esri/hub-discussions [15.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.19.0...@esri/hub-discussions@15.0.0) (2022-10-31)

### Features

- **hub-discussions:** refactor, add, rename interfaces; update can post method ([6c0d54f](https://github.com/Esri/hub.js/commit/6c0d54f546ed397d109e9d5ffb631787276eb813))

### BREAKING CHANGES

- **hub-discussions:** Interface names have changed and been refactored

# @esri/hub-discussions [14.19.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.18.1...@esri/hub-discussions@14.19.0) (2022-10-27)

### Features

- items can be designated as discussable ([#917](https://github.com/Esri/hub.js/issues/917)) ([eb1a6b0](https://github.com/Esri/hub.js/commit/eb1a6b09284515a84abf4e24f62a2b9722c84bc5))

## @esri/hub-discussions [14.18.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.18.0...@esri/hub-discussions@14.18.1) (2022-10-25)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.3

# @esri/hub-discussions [14.18.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.17.2...@esri/hub-discussions@14.18.0) (2022-10-21)

### Features

- **hub-discussions:** create methods for notifications opt out and activity deletion ([512061a](https://github.com/Esri/hub.js/commit/512061a3a2c3cd653638420ff40aab5ecc2e4b23))

## @esri/hub-discussions [14.17.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.17.1...@esri/hub-discussions@14.17.2) (2022-10-19)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.2

## @esri/hub-discussions [14.17.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.17.0...@esri/hub-discussions@14.17.1) (2022-10-14)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.1

# @esri/hub-discussions [14.17.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.16.1...@esri/hub-discussions@14.17.0) (2022-10-14)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.0

## @esri/hub-discussions [14.16.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.16.0...@esri/hub-discussions@14.16.1) (2022-10-11)

### Dependencies

- **@esri/hub-common:** upgraded to 11.20.1

# @esri/hub-discussions [14.16.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.15.0...@esri/hub-discussions@14.16.0) (2022-10-10)

### Dependencies

- **@esri/hub-common:** upgraded to 11.20.0

# @esri/hub-discussions [14.15.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.14.3...@esri/hub-discussions@14.15.0) (2022-10-10)

### Dependencies

- **@esri/hub-common:** upgraded to 11.19.0

## @esri/hub-discussions [14.14.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.14.2...@esri/hub-discussions@14.14.3) (2022-10-04)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.3

## @esri/hub-discussions [14.14.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.14.1...@esri/hub-discussions@14.14.2) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.2

## @esri/hub-discussions [14.14.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.14.0...@esri/hub-discussions@14.14.1) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.1

# @esri/hub-discussions [14.14.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.13.0...@esri/hub-discussions@14.14.0) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.0

# @esri/hub-discussions [14.13.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.12.1...@esri/hub-discussions@14.13.0) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.17.0

## @esri/hub-discussions [14.12.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.12.0...@esri/hub-discussions@14.12.1) (2022-09-29)

### Dependencies

- **@esri/hub-common:** upgraded to 11.16.1

# @esri/hub-discussions [14.12.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.11.0...@esri/hub-discussions@14.12.0) (2022-09-29)

### Dependencies

- **@esri/hub-common:** upgraded to 11.16.0

# @esri/hub-discussions [14.11.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.10.2...@esri/hub-discussions@14.11.0) (2022-09-29)

### Dependencies

- **@esri/hub-common:** upgraded to 11.15.0

## @esri/hub-discussions [14.10.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.10.1...@esri/hub-discussions@14.10.2) (2022-09-28)

### Dependencies

- **@esri/hub-common:** upgraded to 11.14.2

## @esri/hub-discussions [14.10.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.10.0...@esri/hub-discussions@14.10.1) (2022-09-27)

### Dependencies

- **@esri/hub-common:** upgraded to 11.14.1

# @esri/hub-discussions [14.10.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.9.0...@esri/hub-discussions@14.10.0) (2022-09-26)

### Dependencies

- **@esri/hub-common:** upgraded to 11.14.0

# @esri/hub-discussions [14.9.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.8.0...@esri/hub-discussions@14.9.0) (2022-09-26)

### Dependencies

- **@esri/hub-common:** upgraded to 11.13.0

# @esri/hub-discussions [14.8.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.7.0...@esri/hub-discussions@14.8.0) (2022-09-26)

### Features

- **hub-discussions:** check groups for cannotDiscuss ([5b262ef](https://github.com/Esri/hub.js/commit/5b262ef91e8eaa66b798c2a6c5a28fbb2368754c))

# @esri/hub-discussions [14.7.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.6.0...@esri/hub-discussions@14.7.0) (2022-09-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.12.0

# @esri/hub-discussions [14.6.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.5.0...@esri/hub-discussions@14.6.0) (2022-09-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.11.0

# @esri/hub-discussions [14.5.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.4.0...@esri/hub-discussions@14.5.0) (2022-09-22)

### Dependencies

- **@esri/hub-common:** upgraded to 11.10.0

# @esri/hub-discussions [14.4.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.3.0...@esri/hub-discussions@14.4.0) (2022-09-22)

### Dependencies

- **@esri/hub-common:** upgraded to 11.9.0

# @esri/hub-discussions [14.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.2.0...@esri/hub-discussions@14.3.0) (2022-09-21)

### Dependencies

- **@esri/hub-common:** upgraded to 11.8.0

# @esri/hub-discussions [14.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.1.0...@esri/hub-discussions@14.2.0) (2022-09-20)

### Dependencies

- **@esri/hub-common:** upgraded to 11.7.0

# @esri/hub-discussions [14.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@14.0.0...@esri/hub-discussions@14.1.0) (2022-09-19)

### Dependencies

- **@esri/hub-common:** upgraded to 11.6.0

# @esri/hub-discussions [14.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.6.0...@esri/hub-discussions@14.0.0) (2022-09-16)

### Bug Fixes

- update discussion auth methods ([b4beb93](https://github.com/Esri/hub.js/commit/b4beb938c6245ebb33f9225a627b4339ecafa499))

### BREAKING CHANGES

- changed signature of canModifyPost

# @esri/hub-discussions [13.6.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.5.0...@esri/hub-discussions@13.6.0) (2022-09-14)

### Features

- pass headers through createPost createReply and updatePost ([#880](https://github.com/Esri/hub.js/issues/880)) ([c3b5377](https://github.com/Esri/hub.js/commit/c3b53776a611f2202376f6591363dda78acc0f7e))

# @esri/hub-discussions [13.5.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.4.1...@esri/hub-discussions@13.5.0) (2022-09-14)

### Features

- add isSafeRedirectUrl ([#878](https://github.com/Esri/hub.js/issues/878)) ([8c6abf6](https://github.com/Esri/hub.js/commit/8c6abf6027be2c051c7b715806c8f2590f49fbd5))

### Dependencies

- **@esri/hub-common:** upgraded to 11.5.0

## @esri/hub-discussions [13.4.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.4.0...@esri/hub-discussions@13.4.1) (2022-09-12)

### Dependencies

- **@esri/hub-common:** upgraded to 11.4.1

# @esri/hub-discussions [13.4.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.3.0...@esri/hub-discussions@13.4.0) (2022-09-07)

### Dependencies

- **@esri/hub-common:** upgraded to 11.4.0

# @esri/hub-discussions [13.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.2.0...@esri/hub-discussions@13.3.0) (2022-09-06)

### Features

- **hub-discussions:** add parseMentionedUsers util ([#874](https://github.com/Esri/hub.js/issues/874)) ([cf7a426](https://github.com/Esri/hub.js/commit/cf7a4263f12e92da9e7d67845341ea5de08f80db))

### Dependencies

- **@esri/hub-common:** upgraded to 11.3.0

# @esri/hub-discussions [13.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.1.0...@esri/hub-discussions@13.2.0) (2022-09-02)

### Dependencies

- **@esri/hub-common:** upgraded to 11.2.0

# @esri/hub-discussions [13.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0...@esri/hub-discussions@13.1.0) (2022-08-31)

### Dependencies

- **@esri/hub-common:** upgraded to 11.1.0

# @esri/hub-discussions [13.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.2.0...@esri/hub-discussions@13.0.0) (2022-08-24)

- feat!: Merge beta -> Master (#868) ([69be0aa](https://github.com/Esri/hub.js/commit/69be0aa61366acf3d281b720b16423735be0cff0)), closes [#868](https://github.com/Esri/hub.js/issues/868) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865)
- feat!: add HubProject class; remove Managers (#866) ([bef1200](https://github.com/Esri/hub.js/commit/bef1200bce65c527eda3bac1b2548e9f72fc115f)), closes [#866](https://github.com/Esri/hub.js/issues/866) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#853](https://github.com/Esri/hub.js/issues/853) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#861](https://github.com/Esri/hub.js/issues/861) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#862](https://github.com/Esri/hub.js/issues/862) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#863](https://github.com/Esri/hub.js/issues/863) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865) [#865](https://github.com/Esri/hub.js/issues/865)

### Reverts

- Revert "feat!: add HubProject class; remove Managers (#866)" (#867) ([423c71b](https://github.com/Esri/hub.js/commit/423c71b508e88f14aa13291e63f5dd0b91e149b3)), closes [#866](https://github.com/Esri/hub.js/issues/866) [#867](https://github.com/Esri/hub.js/issues/867)

### BREAKING CHANGES

- Hub class is removed for the time being.

- fix: update model test to ensure timestamps are in correct range

- refactor: rename interface

- chore(release): 11.0.0-beta.1 [skip ci]

# @esri/hub-events [11.0.0-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-events@10.1.0...@esri/hub-events@11.0.0-beta.1) (2022-08-18)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.1

- chore(release): 11.0.0-beta.1 [skip ci]

# [11.0.0-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.1.0...@esri/hub-common@11.0.0-beta.1) (2022-08-18)

### Features

- This removes the Manager class exports

- feat: remove managers from tests

- refactor: remove commented code

- chore(release): 11.0.0-beta.3 [skip ci]

# @esri/hub-events [11.0.0-beta.3](https://github.com/Esri/hub.js/compare/@esri/hub-events@11.0.0-beta.2...@esri/hub-events@11.0.0-beta.3) (2022-08-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.3

- chore(release): 11.0.0-beta.3 [skip ci]

# [11.0.0-beta.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@11.0.0-beta.2...@esri/hub-common@11.0.0-beta.3) (2022-08-23)

- HubSiteManager class removed

- refactor: remove entity based search functions
- remove entity based search fns

- punch GHA

- chore(release): 13.0.0-beta.5 [skip ci]

# @esri/hub-discussions [13.0.0-beta.5](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0-beta.4...@esri/hub-discussions@13.0.0-beta.5) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.5

- chore(release): 11.0.0-beta.5 [skip ci]

# [11.0.0-beta.5](https://github.com/Esri/hub.js/compare/@esri/hub-common@11.0.0-beta.4...@esri/hub-common@11.0.0-beta.5) (2022-08-24)

- Remove Manager classes and entity search

Co-authored-by: semantic-release-bot <semantic-release-bot@martynus.net>

- Hub class is removed for the time being.

- fix: update model test to ensure timestamps are in correct range

- refactor: rename interface

- chore(release): 11.0.0-beta.1 [skip ci]

# @esri/hub-events [11.0.0-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-events@10.1.0...@esri/hub-events@11.0.0-beta.1) (2022-08-18)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.1

- chore(release): 11.0.0-beta.1 [skip ci]

# [11.0.0-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-common@10.1.0...@esri/hub-common@11.0.0-beta.1) (2022-08-18)

### Features

- This removes the Manager class exports

- feat: remove managers from tests

- refactor: remove commented code

- chore(release): 11.0.0-beta.3 [skip ci]

# @esri/hub-events [11.0.0-beta.3](https://github.com/Esri/hub.js/compare/@esri/hub-events@11.0.0-beta.2...@esri/hub-events@11.0.0-beta.3) (2022-08-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.3

- chore(release): 11.0.0-beta.3 [skip ci]

# [11.0.0-beta.3](https://github.com/Esri/hub.js/compare/@esri/hub-common@11.0.0-beta.2...@esri/hub-common@11.0.0-beta.3) (2022-08-23)

- HubSiteManager class removed

- refactor: remove entity based search functions
- remove entity based search fns

- punch GHA

- chore(release): 13.0.0-beta.5 [skip ci]

# @esri/hub-discussions [13.0.0-beta.5](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0-beta.4...@esri/hub-discussions@13.0.0-beta.5) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.5

- chore(release): 11.0.0-beta.5 [skip ci]

# [11.0.0-beta.5](https://github.com/Esri/hub.js/compare/@esri/hub-common@11.0.0-beta.4...@esri/hub-common@11.0.0-beta.5) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0

# @esri/hub-discussions [13.0.0-beta.5](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0-beta.4...@esri/hub-discussions@13.0.0-beta.5) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.5

# @esri/hub-discussions [13.0.0-beta.4](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0-beta.3...@esri/hub-discussions@13.0.0-beta.4) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.4

# @esri/hub-discussions [13.0.0-beta.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0-beta.2...@esri/hub-discussions@13.0.0-beta.3) (2022-08-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.3

# @esri/hub-discussions [13.0.0-beta.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@13.0.0-beta.1...@esri/hub-discussions@13.0.0-beta.2) (2022-08-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.2

# @esri/hub-discussions [13.0.0-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.2.0...@esri/hub-discussions@13.0.0-beta.1) (2022-08-18)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.1

# @esri/hub-discussions [12.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.1.1...@esri/hub-discussions@12.2.0) (2022-08-15)

### Dependencies

- **@esri/hub-common:** upgraded to 10.1.0

## @esri/hub-discussions [12.1.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.1.0...@esri/hub-discussions@12.1.1) (2022-08-15)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.2

# @esri/hub-discussions [12.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.1...@esri/hub-discussions@12.1.0) (2022-08-08)

### Features

- **hub-discussions:** adding acl support for channels ([#858](https://github.com/Esri/hub.js/issues/858)) ([9a3691c](https://github.com/Esri/hub.js/commit/9a3691c5a249c003e3f3fbbcf9cd787e0558758e))

## @esri/hub-discussions [12.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0...@esri/hub-discussions@12.0.1) (2022-08-04)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.1

# @esri/hub-discussions [12.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.36.2...@esri/hub-discussions@12.0.0) (2022-08-03)

### chore

- **hub-common:** no longer publish es5 build ([995ce02](https://github.com/Esri/hub.js/commit/995ce02373e8390250e4490b738babb71cb7c303))
- **hub-common:** no longer run and publish UMD build ([2f0d7a2](https://github.com/Esri/hub.js/commit/2f0d7a25332e0864e03f814a34847abb8ee1bc4b))

### BREAKING CHANGES

- **hub-common:** no longer publish es5 build
- **hub-common:** no longer publish a CDN release

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0

# @esri/hub-discussions [12.0.0-next.7](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0-next.6...@esri/hub-discussions@12.0.0-next.7) (2022-08-03)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.7

# @esri/hub-discussions [12.0.0-next.6](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0-next.5...@esri/hub-discussions@12.0.0-next.6) (2022-08-02)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.6

# @esri/hub-discussions [12.0.0-next.5](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0-next.4...@esri/hub-discussions@12.0.0-next.5) (2022-08-01)

### chore

- **hub-common:** no longer publish es5 build ([995ce02](https://github.com/Esri/hub.js/commit/995ce02373e8390250e4490b738babb71cb7c303))

### BREAKING CHANGES

- **hub-common:** no longer publish es5 build

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.5

# @esri/hub-discussions [12.0.0-next.4](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0-next.3...@esri/hub-discussions@12.0.0-next.4) (2022-08-01)

### chore

- **hub-common:** no longer run and publish UMD build ([2f0d7a2](https://github.com/Esri/hub.js/commit/2f0d7a25332e0864e03f814a34847abb8ee1bc4b))

### BREAKING CHANGES

- **hub-common:** no longer publish a CDN release

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.4

# @esri/hub-discussions [12.0.0-next.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0-next.2...@esri/hub-discussions@12.0.0-next.3) (2022-07-28)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.3

# @esri/hub-discussions [12.0.0-next.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@12.0.0-next.1...@esri/hub-discussions@12.0.0-next.2) (2022-07-22)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.2

# @esri/hub-discussions [12.0.0-next.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.36.0...@esri/hub-discussions@12.0.0-next.1) (2022-07-21)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.1

## @esri/hub-discussions [11.36.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.36.1...@esri/hub-discussions@11.36.2) (2022-08-02)

### Dependencies

- **@esri/hub-common:** upgraded to 9.49.2

## @esri/hub-discussions [11.36.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.36.0...@esri/hub-discussions@11.36.1) (2022-07-26)

### Dependencies

- **@esri/hub-common:** upgraded to 9.49.1

# @esri/hub-discussions [11.36.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.35.0...@esri/hub-discussions@11.36.0) (2022-07-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.49.0

# @esri/hub-discussions [11.35.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.34.0...@esri/hub-discussions@11.35.0) (2022-07-20)

### Dependencies

- **@esri/hub-common:** upgraded to 9.48.0

# @esri/hub-discussions [11.34.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.33.1...@esri/hub-discussions@11.34.0) (2022-07-19)

### Dependencies

- **@esri/hub-common:** upgraded to 9.47.0

## @esri/hub-discussions [11.33.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.33.0...@esri/hub-discussions@11.33.1) (2022-07-15)

### Dependencies

- **@esri/hub-common:** upgraded to 9.46.1

# @esri/hub-discussions [11.33.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.6...@esri/hub-discussions@11.33.0) (2022-07-14)

### Dependencies

- **@esri/hub-common:** upgraded to 9.46.0

## @esri/hub-discussions [11.32.6](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.5...@esri/hub-discussions@11.32.6) (2022-07-07)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.6

## @esri/hub-discussions [11.32.5](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.4...@esri/hub-discussions@11.32.5) (2022-07-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.5

## @esri/hub-discussions [11.32.4](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.3...@esri/hub-discussions@11.32.4) (2022-07-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.4

## @esri/hub-discussions [11.32.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.2...@esri/hub-discussions@11.32.3) (2022-06-30)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.3

## @esri/hub-discussions [11.32.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.1...@esri/hub-discussions@11.32.2) (2022-06-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.2

## @esri/hub-discussions [11.32.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.32.0...@esri/hub-discussions@11.32.1) (2022-06-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.1

# @esri/hub-discussions [11.32.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.31.1...@esri/hub-discussions@11.32.0) (2022-06-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.0

## @esri/hub-discussions [11.31.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.31.0...@esri/hub-discussions@11.31.1) (2022-06-27)

### Dependencies

- **@esri/hub-common:** upgraded to 9.44.1

# @esri/hub-discussions [11.31.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.30.3...@esri/hub-discussions@11.31.0) (2022-06-24)

### Dependencies

- **@esri/hub-common:** upgraded to 9.44.0

## @esri/hub-discussions [11.30.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.30.2...@esri/hub-discussions@11.30.3) (2022-06-23)

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.3

## @esri/hub-discussions [11.30.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.30.1...@esri/hub-discussions@11.30.2) (2022-06-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.2

## @esri/hub-discussions [11.30.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.30.0...@esri/hub-discussions@11.30.1) (2022-06-15)

### Bug Fixes

- reset version numbers so hopefully it can release ([8da9264](https://github.com/Esri/hub.js/commit/8da9264a15040ae06964eddcfda639009a927be0))

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.1

# @esri/hub-discussions [11.31.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.30.0...@esri/hub-discussions@11.31.0) (2022-06-15)

### Bug Fixes

- reset version numbers so hopefully it can release ([8da9264](https://github.com/Esri/hub.js/commit/8da9264a15040ae06964eddcfda639009a927be0))

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.0

# @esri/hub-discussions [11.30.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.29.0...@esri/hub-discussions@11.30.0) (2022-06-15)

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.0

# @esri/hub-discussions [11.29.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.28.1...@esri/hub-discussions@11.29.0) (2022-06-14)

### Dependencies

- **@esri/hub-common:** upgraded to 9.42.0

## @esri/hub-discussions [11.28.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.28.0...@esri/hub-discussions@11.28.1) (2022-06-13)

### Dependencies

- **@esri/hub-common:** upgraded to 9.41.1

# @esri/hub-discussions [11.28.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.27.0...@esri/hub-discussions@11.28.0) (2022-06-10)

### Dependencies

- **@esri/hub-common:** upgraded to 9.41.0

# @esri/hub-discussions [11.27.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.26.0...@esri/hub-discussions@11.27.0) (2022-06-10)

### Dependencies

- **@esri/hub-common:** upgraded to 9.40.0

# @esri/hub-discussions [11.26.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.25.0...@esri/hub-discussions@11.26.0) (2022-06-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.39.0

# @esri/hub-discussions [11.25.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.24.0...@esri/hub-discussions@11.25.0) (2022-06-02)

### Dependencies

- **@esri/hub-common:** upgraded to 9.38.0

# @esri/hub-discussions [11.24.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.23.0...@esri/hub-discussions@11.24.0) (2022-05-26)

### Dependencies

- **@esri/hub-common:** upgraded to 9.37.0

# @esri/hub-discussions [11.23.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.22.0...@esri/hub-discussions@11.23.0) (2022-05-24)

### Dependencies

- **@esri/hub-common:** upgraded to 9.36.0

# @esri/hub-discussions [11.22.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.21.0...@esri/hub-discussions@11.22.0) (2022-05-23)

### Dependencies

- **@esri/hub-common:** upgraded to 9.35.0

# @esri/hub-discussions [11.21.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.20.0...@esri/hub-discussions@11.21.0) (2022-05-20)

### Dependencies

- **@esri/hub-common:** upgraded to 9.34.0

# @esri/hub-discussions [11.20.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.19.1...@esri/hub-discussions@11.20.0) (2022-05-19)

### Dependencies

- **@esri/hub-common:** upgraded to 9.33.0

## @esri/hub-discussions [11.19.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.19.0...@esri/hub-discussions@11.19.1) (2022-05-18)

### Dependencies

- **@esri/hub-common:** upgraded to 9.32.1

# @esri/hub-discussions [11.19.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.18.3...@esri/hub-discussions@11.19.0) (2022-05-17)

### Dependencies

- **@esri/hub-common:** upgraded to 9.32.0

## @esri/hub-discussions [11.18.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.18.2...@esri/hub-discussions@11.18.3) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.3

## @esri/hub-discussions [11.18.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.18.1...@esri/hub-discussions@11.18.2) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.2

## @esri/hub-discussions [11.18.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.18.0...@esri/hub-discussions@11.18.1) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.1

# @esri/hub-discussions [11.18.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.17.1...@esri/hub-discussions@11.18.0) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.0

## @esri/hub-discussions [11.17.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.17.0...@esri/hub-discussions@11.17.1) (2022-05-11)

### Dependencies

- **@esri/hub-common:** upgraded to 9.30.1

# @esri/hub-discussions [11.17.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.16.0...@esri/hub-discussions@11.17.0) (2022-05-09)

### Dependencies

- **@esri/hub-common:** upgraded to 9.30.0

# @esri/hub-discussions [11.16.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.15.0...@esri/hub-discussions@11.16.0) (2022-04-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.29.0

# @esri/hub-discussions [11.15.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.14.0...@esri/hub-discussions@11.15.0) (2022-04-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.28.0

# @esri/hub-discussions [11.14.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.13.1...@esri/hub-discussions@11.14.0) (2022-04-11)

### Dependencies

- **@esri/hub-common:** upgraded to 9.27.0

## @esri/hub-discussions [11.13.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.13.0...@esri/hub-discussions@11.13.1) (2022-04-08)

### Dependencies

- **@esri/hub-common:** upgraded to 9.26.2

# @esri/hub-discussions [11.13.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.12.1...@esri/hub-discussions@11.13.0) (2022-04-07)

### Features

- **hub-discussions:** extends post geometry support in hub-discussions ([86a3272](https://github.com/Esri/hub.js/commit/86a3272c7a70a975d7fddc6cf2c4e26f80b7db7d))

## @esri/hub-discussions [11.12.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.12.0...@esri/hub-discussions@11.12.1) (2022-04-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.26.1

# @esri/hub-discussions [11.12.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.7...@esri/hub-discussions@11.12.0) (2022-04-05)

### Dependencies

- **@esri/hub-common:** upgraded to 9.26.0

## @esri/hub-discussions [11.11.7](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.6...@esri/hub-discussions@11.11.7) (2022-04-04)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.7

## @esri/hub-discussions [11.11.6](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.5...@esri/hub-discussions@11.11.6) (2022-04-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.6

## @esri/hub-discussions [11.11.5](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.4...@esri/hub-discussions@11.11.5) (2022-03-31)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.5

## @esri/hub-discussions [11.11.4](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.3...@esri/hub-discussions@11.11.4) (2022-03-31)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.4

## @esri/hub-discussions [11.11.3](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.2...@esri/hub-discussions@11.11.3) (2022-03-30)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.3

## @esri/hub-discussions [11.11.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.1...@esri/hub-discussions@11.11.2) (2022-03-25)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.2

## @esri/hub-discussions [11.11.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.11.0...@esri/hub-discussions@11.11.1) (2022-03-24)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.1

# @esri/hub-discussions [11.11.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.10.2...@esri/hub-discussions@11.11.0) (2022-03-23)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.0

## @esri/hub-discussions [11.10.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.10.1...@esri/hub-discussions@11.10.2) (2022-03-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.24.2

## @esri/hub-discussions [11.10.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.10.0...@esri/hub-discussions@11.10.1) (2022-03-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.24.1

# @esri/hub-discussions [11.10.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.9.1...@esri/hub-discussions@11.10.0) (2022-03-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.24.0

## @esri/hub-discussions [11.9.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.9.0...@esri/hub-discussions@11.9.1) (2022-03-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.3

# @esri/hub-discussions [11.9.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.8.2...@esri/hub-discussions@11.9.0) (2022-03-21)

### Features

- **hub-discussions:** allow channel owner to modify channel ([#748](https://github.com/Esri/hub.js/issues/748)) ([f402fbd](https://github.com/Esri/hub.js/commit/f402fbdc8908663a6bd7dcf2db6e4f29d7023627))

## @esri/hub-discussions [11.8.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.8.1...@esri/hub-discussions@11.8.2) (2022-03-18)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.2

## @esri/hub-discussions [11.8.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.8.0...@esri/hub-discussions@11.8.1) (2022-03-17)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.1

# @esri/hub-discussions [11.8.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.7.0...@esri/hub-discussions@11.8.0) (2022-03-16)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.0

# @esri/hub-discussions [11.7.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.6.2...@esri/hub-discussions@11.7.0) (2022-03-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.22.0

## @esri/hub-discussions [11.6.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.6.1...@esri/hub-discussions@11.6.2) (2022-02-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.21.2

## @esri/hub-discussions [11.6.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.6.0...@esri/hub-discussions@11.6.1) (2022-02-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.21.1

# @esri/hub-discussions [11.6.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.5.0...@esri/hub-discussions@11.6.0) (2022-02-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.21.0

# @esri/hub-discussions [11.5.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.4.0...@esri/hub-discussions@11.5.0) (2022-02-25)

### Dependencies

- **@esri/hub-common:** upgraded to 9.20.0

# @esri/hub-discussions [11.4.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.3.0...@esri/hub-discussions@11.4.0) (2022-02-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.19.0

# @esri/hub-discussions [11.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.2.1...@esri/hub-discussions@11.3.0) (2022-02-18)

### Dependencies

- **@esri/hub-common:** upgraded to 9.18.0

## @esri/hub-discussions [11.2.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.2.0...@esri/hub-discussions@11.2.1) (2022-02-17)

### Dependencies

- **@esri/hub-common:** upgraded to 9.17.1

# @esri/hub-discussions [11.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.1.0...@esri/hub-discussions@11.2.0) (2022-02-16)

### Dependencies

- **@esri/hub-common:** upgraded to 9.17.0

# @esri/hub-discussions [11.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@11.0.0...@esri/hub-discussions@11.1.0) (2022-02-16)

### Dependencies

- **@esri/hub-common:** upgraded to 9.16.0

# @esri/hub-discussions [11.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@10.1.0...@esri/hub-discussions@11.0.0) (2022-02-15)

### Features

- **hub-discussions:** add IWithEditor interface ([#724](https://github.com/Esri/hub.js/issues/724)) ([7f8d194](https://github.com/Esri/hub.js/commit/7f8d194426d7bd18dcadd0b7d518483637c73cbd))

### BREAKING CHANGES

- **hub-discussions:** move editor from IWithAuthor to IWithEditor

feat(hub-discussions): extending IWithAuthor on IUpdateChannel

# @esri/hub-discussions [10.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@10.0.0...@esri/hub-discussions@10.1.0) (2022-02-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.15.0

# @esri/hub-discussions [10.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.16.0...@esri/hub-discussions@10.0.0) (2022-02-11)

### Features

- **hub-discussions:** add CommonSort interface, add generics to IWit… ([#721](https://github.com/Esri/hub.js/issues/721)) ([b576574](https://github.com/Esri/hub.js/commit/b576574ef2683bc7d8a0b5bfc99dcb26e4e7f48a))

### BREAKING CHANGES

- **hub-discussions:** IWithSorting interface leverages generics now

feat(hub-discussions): add filterBy to ISearchChannels interface

feat(hub-discussions): add IWithFiltering interface

build(hub-discussions): kick ci

feat(hub-discussions): deprecate discussion types

- **hub-discussions:** deprecate DiscussionType.DATASET and DiscussionType.ITEM enum values

feat(hub-discussions): deprecate discussion methods

- **hub-discussions:** deprecate isGroupDiscussable and isItemDiscussable methods

# @esri/hub-discussions [9.16.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.15.1...@esri/hub-discussions@9.16.0) (2022-02-07)

### Features

- export PostSort and ChannelSort ([4d9a18c](https://github.com/Esri/hub.js/commit/4d9a18cfa4f0cf7f294b55cd7317311546d90587))

## @esri/hub-discussions [9.15.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.15.0...@esri/hub-discussions@9.15.1) (2022-02-07)

### Dependencies

- **@esri/hub-common:** upgraded to 9.14.1

# @esri/hub-discussions [9.15.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.14.0...@esri/hub-discussions@9.15.0) (2022-02-07)

### Features

- add ChannelFilter type to discussions ([7886bca](https://github.com/Esri/hub.js/commit/7886bca04bd999be24cb08512a1cf29b858b5be9))
- add discussions sorting enums ([a7a4cca](https://github.com/Esri/hub.js/commit/a7a4cca669262ca27fd604175dd2a2224ee6015f))

# @esri/hub-discussions [9.14.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.13.2...@esri/hub-discussions@9.14.0) (2022-01-25)

### Dependencies

- **@esri/hub-common:** upgraded to 9.14.0

## @esri/hub-discussions [9.13.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.13.1...@esri/hub-discussions@9.13.2) (2022-01-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.13.2

## @esri/hub-discussions [9.13.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.13.0...@esri/hub-discussions@9.13.1) (2022-01-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.13.1

# @esri/hub-discussions [9.13.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.12.0...@esri/hub-discussions@9.13.0) (2022-01-20)

### Dependencies

- **@esri/hub-common:** upgraded to 9.13.0

# @esri/hub-discussions [9.12.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.11.0...@esri/hub-discussions@9.12.0) (2022-01-13)

### Dependencies

- **@esri/hub-common:** upgraded to 9.12.0

# @esri/hub-discussions [9.11.0](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.10.2...@esri/hub-discussions@9.11.0) (2022-01-08)

### Dependencies

- **@esri/hub-common:** upgraded to 9.11.0

## @esri/hub-discussions [9.10.2](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.10.1...@esri/hub-discussions@9.10.2) (2022-01-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.10.2

## @esri/hub-discussions [9.10.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.10.0...@esri/hub-discussions@9.10.1) (2022-01-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.10.1

## @esri/hub-discussions [9.10.1-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-discussions@9.10.0...@esri/hub-discussions@9.10.1-beta.1) (2022-01-04)

### Dependencies

- **@esri/hub-common:** upgraded to 9.10.1-beta.1

# ALL PRIOR CHANGES ARE IN THE ROOT CHANGELOG FILE
