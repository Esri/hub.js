## @esri/hub-sites [16.0.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@16.0.1...@esri/hub-sites@16.0.2) (2025-02-25)


### Bug Fixes

* revert "refactor: minimize use of rest-types package" ([#1813](https://github.com/Esri/hub.js/issues/1813)) ([11e151b](https://github.com/Esri/hub.js/commit/11e151b3d13b1a04e73cb85330a606c2dcb749d7))

## @esri/hub-sites [16.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@16.0.0...@esri/hub-sites@16.0.1) (2025-01-22)


### Bug Fixes

* export _get-sharing-eligible-models ([#1777](https://github.com/Esri/hub.js/issues/1777)) ([18a3026](https://github.com/Esri/hub.js/commit/18a3026c8ce834d086158dabe51b0da3de02ca9c))

# @esri/hub-sites [16.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@15.0.2...@esri/hub-sites@16.0.0) (2024-11-01)





### Dependencies

* **@esri/hub-common:** upgraded to 15.0.0
* **@esri/hub-initiatives:** upgraded to 15.0.0
* **@esri/hub-teams:** upgraded to 15.0.0

## @esri/hub-sites [15.0.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@15.0.1...@esri/hub-sites@15.0.2) (2024-09-09)


### Bug Fixes

* re-order requests ([#1644](https://github.com/Esri/hub.js/issues/1644)) ([90603ca](https://github.com/Esri/hub.js/commit/90603ca6842890bd9fb1dbe71d283a2c8cfd9699))

## @esri/hub-sites [15.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@15.0.0...@esri/hub-sites@15.0.1) (2024-08-26)


### Bug Fixes

* **hub-sites:** getMembers call uses filter instead of q in query ([#1633](https://github.com/Esri/hub.js/issues/1633)) ([39a6c44](https://github.com/Esri/hub.js/commit/39a6c4492d1237f32be9e1420a44c708ef58bcdd))

# @esri/hub-sites [15.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.3.0...@esri/hub-sites@15.0.0) (2024-06-27)


### Features

* **hub-sites:** initiatives are no longer created during site creation ([#1564](https://github.com/Esri/hub.js/issues/1564)) ([1f54908](https://github.com/Esri/hub.js/commit/1f549085cce485e12d970eb870cc967d55dc4a2d))


### BREAKING CHANGES

* **hub-sites:** removes logic to automatically create an initiative during the site creation process

# @esri/hub-sites [14.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.2.4...@esri/hub-sites@14.3.0) (2024-05-15)


### Features

* remove props from site and page draft whitelists ([#1516](https://github.com/Esri/hub.js/issues/1516)) ([3b31602](https://github.com/Esri/hub.js/commit/3b316029e1b49c99c4163a84f5a9461a4bb22407))

## @esri/hub-sites [14.2.4](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.2.3...@esri/hub-sites@14.2.4) (2024-03-26)


### Bug Fixes

* support old web mapping application sites in workspaces ([#1442](https://github.com/Esri/hub.js/issues/1442)) ([ede26c4](https://github.com/Esri/hub.js/commit/ede26c45b67391eb67f0d4bb511c627a82a6ba74))

## @esri/hub-sites [14.2.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.2.2...@esri/hub-sites@14.2.3) (2024-03-06)


### Bug Fixes

* ensure sites have telemetry ([#1430](https://github.com/Esri/hub.js/issues/1430)) ([abc5205](https://github.com/Esri/hub.js/commit/abc5205bd8779d4544ceda042a8a097369b52364))

## @esri/hub-sites [14.2.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.2.1...@esri/hub-sites@14.2.2) (2024-01-11)


### Bug Fixes

* migrate malformed basemap hash resulting from hub.py bug ([#1381](https://github.com/Esri/hub.js/issues/1381)) ([b68da32](https://github.com/Esri/hub.js/commit/b68da32b9206e45ab3568c026f49d5659af8f05b))

## @esri/hub-sites [14.2.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.2.0...@esri/hub-sites@14.2.1) (2023-10-31)


### Bug Fixes

* add data.telemetry to site draft include list; redo telemetry config migration ([#1306](https://github.com/Esri/hub.js/issues/1306)) ([a00818b](https://github.com/Esri/hub.js/commit/a00818b75338f3bacfde0da6a6181222d870367b))

# @esri/hub-sites [14.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.1.0...@esri/hub-sites@14.2.0) (2023-10-13)


### Features

* telemetry config ([#1272](https://github.com/Esri/hub.js/issues/1272)) ([7a0a40c](https://github.com/Esri/hub.js/commit/7a0a40cfd9bd2ca5ef4537e65812c3d05eae2dd8))

# @esri/hub-sites [14.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.0.1...@esri/hub-sites@14.1.0) (2023-10-08)


### Features

* **hub-common:** adds followers group discussion settings on site wo… ([#1251](https://github.com/Esri/hub.js/issues/1251)) ([e0beb59](https://github.com/Esri/hub.js/commit/e0beb59f91b43795f96a694e55238a6cec83de74))

## @esri/hub-sites [14.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@14.0.0...@esri/hub-sites@14.0.1) (2023-08-28)


### Bug Fixes

* rollback stat migration ([#1193](https://github.com/Esri/hub.js/issues/1193)) ([8465e15](https://github.com/Esri/hub.js/commit/8465e155903053b0f4078b2ecf24c42aff149cf9))

# @esri/hub-sites [14.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@13.1.0...@esri/hub-sites@14.0.0) (2023-08-23)





### Dependencies

* **@esri/hub-common:** upgraded to 14.0.0
* **@esri/hub-initiatives:** upgraded to 14.0.0
* **@esri/hub-teams:** upgraded to 14.0.0

# @esri/hub-sites [13.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@13.0.1...@esri/hub-sites@13.1.0) (2023-08-22)


### Features

* migrate summary stat function ([#1165](https://github.com/Esri/hub.js/issues/1165)) ([53e34de](https://github.com/Esri/hub.js/commit/53e34de0b903380538e3cee0e5f152121c30286e))

## @esri/hub-sites [13.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@13.0.0...@esri/hub-sites@13.0.1) (2023-06-08)


### Bug Fixes

* address issue creating sites on portal ([#1085](https://github.com/Esri/hub.js/issues/1085)) ([7243db8](https://github.com/Esri/hub.js/commit/7243db889c33d318e03471045539dd2988cd910a))

# @esri/hub-sites [13.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.6.0...@esri/hub-sites@13.0.0) (2023-05-26)


### Features

* remove calls to register or update app ([#1069](https://github.com/Esri/hub.js/issues/1069)) ([1aa361f](https://github.com/Esri/hub.js/commit/1aa361ff75d1bb5017871de2470d3381bfe27c5d))


### BREAKING CHANGES

* Client code no longer makes calls to
register site as application or to update application redirect
uris. This is all expected to be handled server-side by the Hub Domain
service.
* remove deprecated destroySite()

* fix: update peerDeps'





### Dependencies

* **@esri/hub-initiatives:** upgraded to 13.0.0
* **@esri/hub-teams:** upgraded to 13.0.0

# @esri/hub-sites [12.6.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.5.0...@esri/hub-sites@12.6.0) (2023-04-03)


### Features

* keep capabilities in model while ensuring default capabilities ([#1006](https://github.com/Esri/hub.js/issues/1006)) ([d0e2ebd](https://github.com/Esri/hub.js/commit/d0e2ebd3ce83f93d0f2795499b7b393423ed50aa))

# @esri/hub-sites [12.5.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.4.1...@esri/hub-sites@12.5.0) (2023-03-07)


### Bug Fixes

* update tests ([dc039cd](https://github.com/Esri/hub.js/commit/dc039cd669183a435a7ad5e63758b9f622625c48))


### Features

* add feed migration ([8e3d3cf](https://github.com/Esri/hub.js/commit/8e3d3cf190c1ba3b209e0840d1f82be6932d7caf))
* draft schema migration update ([8bf0e26](https://github.com/Esri/hub.js/commit/8bf0e264388d8bd0ddbd8d13b21ab2fe031e2d4e))

## @esri/hub-sites [12.4.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.4.0...@esri/hub-sites@12.4.1) (2023-02-08)


### Bug Fixes

* **hub-sites:** fix peerDependencies should not be fixed to a specific version ([b236ce0](https://github.com/Esri/hub.js/commit/b236ce051302b8aa5eba4b07c3d0b5100e0c4a6a))

# @esri/hub-sites [12.4.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.3.2...@esri/hub-sites@12.4.0) (2023-02-06)





### Dependencies

* **@esri/hub-common:** upgraded to 12.4.0
* **@esri/hub-initiatives:** upgraded to 12.4.0
* **@esri/hub-teams:** upgraded to 12.4.0

## @esri/hub-sites [12.3.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.3.1...@esri/hub-sites@12.3.2) (2023-01-25)





### Dependencies

* **@esri/hub-common:** upgraded to 12.3.2
* **@esri/hub-initiatives:** upgraded to 12.3.2
* **@esri/hub-teams:** upgraded to 12.3.2

## @esri/hub-sites [12.3.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.3.0...@esri/hub-sites@12.3.1) (2023-01-19)





### Dependencies

* **@esri/hub-common:** upgraded to 12.3.1
* **@esri/hub-initiatives:** upgraded to 12.3.1
* **@esri/hub-teams:** upgraded to 12.3.1

# @esri/hub-sites [12.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.2.1...@esri/hub-sites@12.3.0) (2023-01-18)





### Dependencies

* **@esri/hub-common:** upgraded to 12.3.0
* **@esri/hub-initiatives:** upgraded to 12.3.0
* **@esri/hub-teams:** upgraded to 12.3.0

## @esri/hub-sites [12.2.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.2.0...@esri/hub-sites@12.2.1) (2023-01-18)





### Dependencies

* **@esri/hub-common:** upgraded to 12.2.1
* **@esri/hub-initiatives:** upgraded to 12.2.1
* **@esri/hub-teams:** upgraded to 12.2.1

# @esri/hub-sites [12.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.1.0...@esri/hub-sites@12.2.0) (2023-01-13)





### Dependencies

* **@esri/hub-common:** upgraded to 12.2.0
* **@esri/hub-initiatives:** upgraded to 12.2.0
* **@esri/hub-teams:** upgraded to 12.2.0

# @esri/hub-sites [12.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@12.0.0...@esri/hub-sites@12.1.0) (2023-01-12)





### Dependencies

* **@esri/hub-common:** upgraded to 12.1.0
* **@esri/hub-initiatives:** upgraded to 12.1.0
* **@esri/hub-teams:** upgraded to 12.1.0

# @esri/hub-sites [12.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.26.4...@esri/hub-sites@12.0.0) (2023-01-05)


### Features

* Permissions and Capabilities subsystems ([#952](https://github.com/Esri/hub.js/issues/952)) ([d52c124](https://github.com/Esri/hub.js/commit/d52c1240027113ba75fc0dd48619472128436a9b)), closes [#933](https://github.com/Esri/hub.js/issues/933)


### BREAKING CHANGES

* removes PermissionManager; permission fns are exposed
on HubItemEntity
* canEdit canDelete are now sync getters

Co-authored-by: semantic-release-bot <semantic-release-bot@martynus.net>





### Dependencies

* **@esri/hub-common:** upgraded to 12.0.0
* **@esri/hub-initiatives:** upgraded to 12.0.0
* **@esri/hub-teams:** upgraded to 12.0.0

## @esri/hub-sites [11.26.4](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.26.3...@esri/hub-sites@11.26.4) (2023-01-04)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.5
- **@esri/hub-initiatives:** upgraded to 11.23.5
- **@esri/hub-teams:** upgraded to 11.23.5

## @esri/hub-sites [11.26.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.26.2...@esri/hub-sites@11.26.3) (2022-12-20)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.4
- **@esri/hub-initiatives:** upgraded to 11.23.4
- **@esri/hub-teams:** upgraded to 11.23.4

## @esri/hub-sites [11.26.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.26.1...@esri/hub-sites@11.26.2) (2022-12-02)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.3
- **@esri/hub-initiatives:** upgraded to 11.23.3
- **@esri/hub-teams:** upgraded to 11.23.3

## @esri/hub-sites [11.26.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.26.0...@esri/hub-sites@11.26.1) (2022-11-18)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.2
- **@esri/hub-initiatives:** upgraded to 11.23.2
- **@esri/hub-teams:** upgraded to 11.23.2

# @esri/hub-sites [11.26.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.25.1...@esri/hub-sites@11.26.0) (2022-11-15)

### Features

- add telemetry to draft include list ([97cb882](https://github.com/Esri/hub.js/commit/97cb882f97ed15fc9563b947bfc4e7125cd5166b))

## @esri/hub-sites [11.25.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.25.0...@esri/hub-sites@11.25.1) (2022-11-04)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.1
- **@esri/hub-initiatives:** upgraded to 11.23.1
- **@esri/hub-teams:** upgraded to 11.23.1

# @esri/hub-sites [11.25.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.24.0...@esri/hub-sites@11.25.0) (2022-11-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.23.0
- **@esri/hub-initiatives:** upgraded to 11.23.0
- **@esri/hub-teams:** upgraded to 11.23.0

# @esri/hub-sites [11.24.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.23.0...@esri/hub-sites@11.24.0) (2022-11-01)

### Dependencies

- **@esri/hub-common:** upgraded to 11.22.0
- **@esri/hub-initiatives:** upgraded to 11.22.0
- **@esri/hub-teams:** upgraded to 11.22.0

# @esri/hub-sites [11.23.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.22.3...@esri/hub-sites@11.23.0) (2022-10-26)

### Features

- adds page headContent to draft allow list ([8dbff70](https://github.com/Esri/hub.js/commit/8dbff706a23cb546738d86d18e406496c078672c))

## @esri/hub-sites [11.22.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.22.2...@esri/hub-sites@11.22.3) (2022-10-25)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.3
- **@esri/hub-initiatives:** upgraded to 11.21.3
- **@esri/hub-teams:** upgraded to 11.21.3

## @esri/hub-sites [11.22.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.22.1...@esri/hub-sites@11.22.2) (2022-10-19)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.2
- **@esri/hub-initiatives:** upgraded to 11.21.2
- **@esri/hub-teams:** upgraded to 11.21.2

## @esri/hub-sites [11.22.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.22.0...@esri/hub-sites@11.22.1) (2022-10-14)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.1
- **@esri/hub-initiatives:** upgraded to 11.21.1
- **@esri/hub-teams:** upgraded to 11.21.1

# @esri/hub-sites [11.22.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.21.0...@esri/hub-sites@11.22.0) (2022-10-14)

### Dependencies

- **@esri/hub-common:** upgraded to 11.21.0
- **@esri/hub-initiatives:** upgraded to 11.21.0
- **@esri/hub-teams:** upgraded to 11.21.0

# @esri/hub-sites [11.21.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.20.1...@esri/hub-sites@11.21.0) (2022-10-11)

### Features

- adds headContent to draft allow list ([d4edc94](https://github.com/Esri/hub.js/commit/d4edc940997b3dfb85765ef455dc31627dd3d8c5))

## @esri/hub-sites [11.20.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.20.0...@esri/hub-sites@11.20.1) (2022-10-11)

### Dependencies

- **@esri/hub-common:** upgraded to 11.20.1
- **@esri/hub-initiatives:** upgraded to 11.20.1
- **@esri/hub-teams:** upgraded to 11.20.1

# @esri/hub-sites [11.20.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.19.0...@esri/hub-sites@11.20.0) (2022-10-10)

### Dependencies

- **@esri/hub-common:** upgraded to 11.20.0
- **@esri/hub-initiatives:** upgraded to 11.20.0
- **@esri/hub-teams:** upgraded to 11.20.0

# @esri/hub-sites [11.19.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.18.3...@esri/hub-sites@11.19.0) (2022-10-10)

### Dependencies

- **@esri/hub-common:** upgraded to 11.19.0
- **@esri/hub-initiatives:** upgraded to 11.19.0
- **@esri/hub-teams:** upgraded to 11.19.0

## @esri/hub-sites [11.18.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.18.2...@esri/hub-sites@11.18.3) (2022-10-04)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.3
- **@esri/hub-initiatives:** upgraded to 11.18.3
- **@esri/hub-teams:** upgraded to 11.18.3

## @esri/hub-sites [11.18.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.18.1...@esri/hub-sites@11.18.2) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.2
- **@esri/hub-initiatives:** upgraded to 11.18.2
- **@esri/hub-teams:** upgraded to 11.18.2

## @esri/hub-sites [11.18.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.18.0...@esri/hub-sites@11.18.1) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.1
- **@esri/hub-initiatives:** upgraded to 11.18.1
- **@esri/hub-teams:** upgraded to 11.18.1

# @esri/hub-sites [11.18.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.17.0...@esri/hub-sites@11.18.0) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.18.0
- **@esri/hub-initiatives:** upgraded to 11.18.0
- **@esri/hub-teams:** upgraded to 11.18.0

# @esri/hub-sites [11.17.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.16.1...@esri/hub-sites@11.17.0) (2022-10-03)

### Dependencies

- **@esri/hub-common:** upgraded to 11.17.0
- **@esri/hub-initiatives:** upgraded to 11.17.0
- **@esri/hub-teams:** upgraded to 11.17.0

## @esri/hub-sites [11.16.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.16.0...@esri/hub-sites@11.16.1) (2022-09-29)

### Dependencies

- **@esri/hub-common:** upgraded to 11.16.1
- **@esri/hub-initiatives:** upgraded to 11.16.1
- **@esri/hub-teams:** upgraded to 11.16.1

# @esri/hub-sites [11.16.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.15.0...@esri/hub-sites@11.16.0) (2022-09-29)

### Dependencies

- **@esri/hub-common:** upgraded to 11.16.0
- **@esri/hub-initiatives:** upgraded to 11.16.0
- **@esri/hub-teams:** upgraded to 11.16.0

# @esri/hub-sites [11.15.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.14.2...@esri/hub-sites@11.15.0) (2022-09-29)

### Dependencies

- **@esri/hub-common:** upgraded to 11.15.0
- **@esri/hub-initiatives:** upgraded to 11.15.0
- **@esri/hub-teams:** upgraded to 11.15.0

## @esri/hub-sites [11.14.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.14.1...@esri/hub-sites@11.14.2) (2022-09-28)

### Dependencies

- **@esri/hub-common:** upgraded to 11.14.2
- **@esri/hub-initiatives:** upgraded to 11.14.2
- **@esri/hub-teams:** upgraded to 11.14.2

## @esri/hub-sites [11.14.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.14.0...@esri/hub-sites@11.14.1) (2022-09-27)

### Bug Fixes

- bump arcgis-rest-portal to pull in request fix for extents ([#895](https://github.com/Esri/hub.js/issues/895)) ([3494865](https://github.com/Esri/hub.js/commit/349486574fb15e47f025c3573578a3ec2719005c))

### Dependencies

- **@esri/hub-common:** upgraded to 11.14.1
- **@esri/hub-initiatives:** upgraded to 11.14.1
- **@esri/hub-teams:** upgraded to 11.14.1

# @esri/hub-sites [11.14.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.13.0...@esri/hub-sites@11.14.0) (2022-09-26)

### Dependencies

- **@esri/hub-common:** upgraded to 11.14.0
- **@esri/hub-initiatives:** upgraded to 11.14.0
- **@esri/hub-teams:** upgraded to 11.14.0

# @esri/hub-sites [11.13.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.12.0...@esri/hub-sites@11.13.0) (2022-09-26)

### Dependencies

- **@esri/hub-common:** upgraded to 11.13.0
- **@esri/hub-initiatives:** upgraded to 11.13.0
- **@esri/hub-teams:** upgraded to 11.13.0

# @esri/hub-sites [11.12.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.11.0...@esri/hub-sites@11.12.0) (2022-09-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.12.0
- **@esri/hub-initiatives:** upgraded to 11.12.0
- **@esri/hub-teams:** upgraded to 11.12.0

# @esri/hub-sites [11.11.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.10.0...@esri/hub-sites@11.11.0) (2022-09-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.11.0
- **@esri/hub-initiatives:** upgraded to 11.11.0
- **@esri/hub-teams:** upgraded to 11.11.0

# @esri/hub-sites [11.10.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.9.0...@esri/hub-sites@11.10.0) (2022-09-22)

### Dependencies

- **@esri/hub-common:** upgraded to 11.10.0
- **@esri/hub-initiatives:** upgraded to 11.10.0
- **@esri/hub-teams:** upgraded to 11.10.0

# @esri/hub-sites [11.9.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.8.0...@esri/hub-sites@11.9.0) (2022-09-22)

### Dependencies

- **@esri/hub-common:** upgraded to 11.9.0
- **@esri/hub-initiatives:** upgraded to 11.9.0
- **@esri/hub-teams:** upgraded to 11.9.0

# @esri/hub-sites [11.8.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.7.0...@esri/hub-sites@11.8.0) (2022-09-21)

### Dependencies

- **@esri/hub-common:** upgraded to 11.8.0
- **@esri/hub-initiatives:** upgraded to 11.8.0
- **@esri/hub-teams:** upgraded to 11.8.0

# @esri/hub-sites [11.7.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.6.0...@esri/hub-sites@11.7.0) (2022-09-20)

### Dependencies

- **@esri/hub-common:** upgraded to 11.7.0
- **@esri/hub-initiatives:** upgraded to 11.7.0
- **@esri/hub-teams:** upgraded to 11.7.0

# @esri/hub-sites [11.6.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.5.0...@esri/hub-sites@11.6.0) (2022-09-19)

### Dependencies

- **@esri/hub-common:** upgraded to 11.6.0
- **@esri/hub-initiatives:** upgraded to 11.6.0
- **@esri/hub-teams:** upgraded to 11.6.0

# @esri/hub-sites [11.5.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.4.1...@esri/hub-sites@11.5.0) (2022-09-14)

### Dependencies

- **@esri/hub-common:** upgraded to 11.5.0
- **@esri/hub-initiatives:** upgraded to 11.5.0
- **@esri/hub-teams:** upgraded to 11.5.0

## @esri/hub-sites [11.4.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.4.0...@esri/hub-sites@11.4.1) (2022-09-12)

### Dependencies

- **@esri/hub-common:** upgraded to 11.4.1
- **@esri/hub-initiatives:** upgraded to 11.4.1
- **@esri/hub-teams:** upgraded to 11.4.1

# @esri/hub-sites [11.4.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.3.0...@esri/hub-sites@11.4.0) (2022-09-07)

### Dependencies

- **@esri/hub-common:** upgraded to 11.4.0
- **@esri/hub-initiatives:** upgraded to 11.4.0
- **@esri/hub-teams:** upgraded to 11.4.0

# @esri/hub-sites [11.3.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.2.0...@esri/hub-sites@11.3.0) (2022-09-06)

### Dependencies

- **@esri/hub-common:** upgraded to 11.3.0
- **@esri/hub-initiatives:** upgraded to 11.3.0
- **@esri/hub-teams:** upgraded to 11.3.0

# @esri/hub-sites [11.2.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.1.0...@esri/hub-sites@11.2.0) (2022-09-02)

### Dependencies

- **@esri/hub-common:** upgraded to 11.2.0
- **@esri/hub-initiatives:** upgraded to 11.2.0
- **@esri/hub-teams:** upgraded to 11.2.0

# @esri/hub-sites [11.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.0.0...@esri/hub-sites@11.1.0) (2022-08-31)

### Dependencies

- **@esri/hub-common:** upgraded to 11.1.0
- **@esri/hub-initiatives:** upgraded to 11.1.0
- **@esri/hub-teams:** upgraded to 11.1.0

# @esri/hub-sites [11.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.1.0...@esri/hub-sites@11.0.0) (2022-08-24)

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
- **@esri/hub-initiatives:** upgraded to 11.0.0
- **@esri/hub-teams:** upgraded to 11.0.0

# @esri/hub-sites [11.0.0-beta.5](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.0.0-beta.4...@esri/hub-sites@11.0.0-beta.5) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.5
- **@esri/hub-initiatives:** upgraded to 11.0.0-beta.5
- **@esri/hub-teams:** upgraded to 11.0.0-beta.5

# @esri/hub-sites [11.0.0-beta.4](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.0.0-beta.3...@esri/hub-sites@11.0.0-beta.4) (2022-08-24)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.4
- **@esri/hub-initiatives:** upgraded to 11.0.0-beta.4
- **@esri/hub-teams:** upgraded to 11.0.0-beta.4

# @esri/hub-sites [11.0.0-beta.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.0.0-beta.2...@esri/hub-sites@11.0.0-beta.3) (2022-08-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.3
- **@esri/hub-initiatives:** upgraded to 11.0.0-beta.3
- **@esri/hub-teams:** upgraded to 11.0.0-beta.3

# @esri/hub-sites [11.0.0-beta.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@11.0.0-beta.1...@esri/hub-sites@11.0.0-beta.2) (2022-08-23)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.2
- **@esri/hub-initiatives:** upgraded to 11.0.0-beta.2
- **@esri/hub-teams:** upgraded to 11.0.0-beta.2

# @esri/hub-sites [11.0.0-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.1.0...@esri/hub-sites@11.0.0-beta.1) (2022-08-18)

### Dependencies

- **@esri/hub-common:** upgraded to 11.0.0-beta.1
- **@esri/hub-initiatives:** upgraded to 11.0.0-beta.1
- **@esri/hub-teams:** upgraded to 11.0.0-beta.1

# @esri/hub-sites [10.1.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.3...@esri/hub-sites@10.1.0) (2022-08-15)

### Dependencies

- **@esri/hub-common:** upgraded to 10.1.0
- **@esri/hub-initiatives:** upgraded to 10.1.0
- **@esri/hub-teams:** upgraded to 10.1.0

## @esri/hub-sites [10.0.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.2...@esri/hub-sites@10.0.3) (2022-08-15)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.2
- **@esri/hub-initiatives:** upgraded to 10.0.2
- **@esri/hub-teams:** upgraded to 10.0.3

## @esri/hub-sites [10.0.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.1...@esri/hub-sites@10.0.2) (2022-08-04)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.1
- **@esri/hub-initiatives:** upgraded to 10.0.1
- **@esri/hub-teams:** upgraded to 10.0.2

## @esri/hub-sites [10.0.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0...@esri/hub-sites@10.0.1) (2022-08-04)

### Dependencies

- **@esri/hub-teams:** upgraded to 10.0.1

# @esri/hub-sites [10.0.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.50.3...@esri/hub-sites@10.0.0) (2022-08-03)

### Bug Fixes

- **hub-sites:** re-add \_shareItemsToSiteGroups in order to support older versions of solutions.js ([b8d91ef](https://github.com/Esri/hub.js/commit/b8d91ef0b716fc49aeb559180d6e514a27e40cdc))

### chore

- **hub-common:** no longer publish es5 build ([995ce02](https://github.com/Esri/hub.js/commit/995ce02373e8390250e4490b738babb71cb7c303))
- **hub-common:** no longer run and publish UMD build ([2f0d7a2](https://github.com/Esri/hub.js/commit/2f0d7a25332e0864e03f814a34847abb8ee1bc4b))

### Code Refactoring

- **hub-sites:** remove \_shareItemsToSiteGroups() ([b806773](https://github.com/Esri/hub.js/commit/b806773b044b413f0173271739f8f9047b203237))
- **hub-sites:** remove hub-sites re-exports from hub-common ([b3e2503](https://github.com/Esri/hub.js/commit/b3e25034e63c00efd9347953208c708342869cce))

### BREAKING CHANGES

- **hub-common:** no longer publish es5 build
- **hub-common:** no longer publish a CDN release
- **hub-sites:** remove \_shareItemsToSiteGroups()
- **hub-sites:** remove getTheme(), \_addSiteDomains, registerSiteAsApplication, registerBrowserApp from hub-sites

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0
- **@esri/hub-initiatives:** upgraded to 10.0.0
- **@esri/hub-teams:** upgraded to 10.0.0

# @esri/hub-sites [10.0.0-next.8](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.7...@esri/hub-sites@10.0.0-next.8) (2022-08-03)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.7
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.7
- **@esri/hub-teams:** upgraded to 10.0.0-next.7

# @esri/hub-sites [10.0.0-next.7](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.6...@esri/hub-sites@10.0.0-next.7) (2022-08-03)

### Bug Fixes

- **hub-sites:** re-add \_shareItemsToSiteGroups in order to support older versions of solutions.js ([b8d91ef](https://github.com/Esri/hub.js/commit/b8d91ef0b716fc49aeb559180d6e514a27e40cdc))

# @esri/hub-sites [10.0.0-next.6](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.5...@esri/hub-sites@10.0.0-next.6) (2022-08-02)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.6
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.6
- **@esri/hub-teams:** upgraded to 10.0.0-next.6

# @esri/hub-sites [10.0.0-next.5](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.4...@esri/hub-sites@10.0.0-next.5) (2022-08-01)

### chore

- **hub-common:** no longer publish es5 build ([995ce02](https://github.com/Esri/hub.js/commit/995ce02373e8390250e4490b738babb71cb7c303))

### BREAKING CHANGES

- **hub-common:** no longer publish es5 build

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.5
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.5
- **@esri/hub-teams:** upgraded to 10.0.0-next.5

# @esri/hub-sites [10.0.0-next.4](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.3...@esri/hub-sites@10.0.0-next.4) (2022-08-01)

### chore

- **hub-common:** no longer run and publish UMD build ([2f0d7a2](https://github.com/Esri/hub.js/commit/2f0d7a25332e0864e03f814a34847abb8ee1bc4b))

### BREAKING CHANGES

- **hub-common:** no longer publish a CDN release

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.4
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.4
- **@esri/hub-teams:** upgraded to 10.0.0-next.4

## @esri/hub-sites [9.50.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.50.2...@esri/hub-sites@9.50.3) (2022-08-02)

### Dependencies

- **@esri/hub-common:** upgraded to 9.49.2
- **@esri/hub-initiatives:** upgraded to 9.49.2
- **@esri/hub-teams:** upgraded to 9.49.3

## @esri/hub-sites [9.50.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.50.1...@esri/hub-sites@9.50.2) (2022-07-26)

# @esri/hub-sites [10.0.0-next.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.2...@esri/hub-sites@10.0.0-next.3) (2022-07-28)

### Code Refactoring

- **hub-sites:** remove \_shareItemsToSiteGroups() ([b806773](https://github.com/Esri/hub.js/commit/b806773b044b413f0173271739f8f9047b203237))
- **hub-sites:** remove hub-sites re-exports from hub-common ([b3e2503](https://github.com/Esri/hub.js/commit/b3e25034e63c00efd9347953208c708342869cce))

### BREAKING CHANGES

- **hub-sites:** remove \_shareItemsToSiteGroups()
- **hub-sites:** remove getTheme(), \_addSiteDomains, registerSiteAsApplication, registerBrowserApp from hub-sites

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.3
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.3
- **@esri/hub-teams:** upgraded to 10.0.0-next.3

# @esri/hub-sites [10.0.0-next.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@10.0.0-next.1...@esri/hub-sites@10.0.0-next.2) (2022-07-22)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.2
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.2
- **@esri/hub-teams:** upgraded to 10.0.0-next.2

## @esri/hub-sites [9.50.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.50.1...@esri/hub-sites@9.50.2) (2022-07-26)

### Dependencies

- **@esri/hub-common:** upgraded to 9.49.1
- **@esri/hub-initiatives:** upgraded to 9.49.1
- **@esri/hub-teams:** upgraded to 9.49.2

# @esri/hub-sites [10.0.0-next.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.50.0...@esri/hub-sites@10.0.0-next.1) (2022-07-21)

### Dependencies

- **@esri/hub-common:** upgraded to 10.0.0-next.1
- **@esri/hub-initiatives:** upgraded to 10.0.0-next.1
- **@esri/hub-teams:** upgraded to 10.0.0-next.1

## @esri/hub-sites [9.50.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.50.0...@esri/hub-sites@9.50.1) (2022-07-22)

### Dependencies

- **@esri/hub-teams:** upgraded to 9.49.1

# @esri/hub-sites [9.50.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.49.0...@esri/hub-sites@9.50.0) (2022-07-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.49.0
- **@esri/hub-initiatives:** upgraded to 9.49.0
- **@esri/hub-teams:** upgraded to 9.49.0

# @esri/hub-sites [9.49.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.48.0...@esri/hub-sites@9.49.0) (2022-07-20)

### Dependencies

- **@esri/hub-common:** upgraded to 9.48.0
- **@esri/hub-initiatives:** upgraded to 9.48.0
- **@esri/hub-teams:** upgraded to 9.48.0

# @esri/hub-sites [9.48.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.47.0...@esri/hub-sites@9.48.0) (2022-07-19)

### Dependencies

- **@esri/hub-common:** upgraded to 9.47.0
- **@esri/hub-initiatives:** upgraded to 9.47.0
- **@esri/hub-teams:** upgraded to 9.47.0

# @esri/hub-sites [9.47.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.46.1...@esri/hub-sites@9.47.0) (2022-07-18)

### Dependencies

- **@esri/hub-teams:** upgraded to 9.46.0

## @esri/hub-sites [9.46.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.46.0...@esri/hub-sites@9.46.1) (2022-07-15)

### Dependencies

- **@esri/hub-common:** upgraded to 9.46.1
- **@esri/hub-initiatives:** upgraded to 9.46.1
- **@esri/hub-teams:** upgraded to 9.45.1

# @esri/hub-sites [9.46.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.6...@esri/hub-sites@9.46.0) (2022-07-14)

### Dependencies

- **@esri/hub-common:** upgraded to 9.46.0
- **@esri/hub-initiatives:** upgraded to 9.46.0
- **@esri/hub-teams:** upgraded to 9.45.0

## @esri/hub-sites [9.45.6](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.5...@esri/hub-sites@9.45.6) (2022-07-07)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.6
- **@esri/hub-initiatives:** upgraded to 9.45.6
- **@esri/hub-teams:** upgraded to 9.44.6

## @esri/hub-sites [9.45.5](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.4...@esri/hub-sites@9.45.5) (2022-07-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.5
- **@esri/hub-initiatives:** upgraded to 9.45.5
- **@esri/hub-teams:** upgraded to 9.44.5

## @esri/hub-sites [9.45.4](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.3...@esri/hub-sites@9.45.4) (2022-07-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.4
- **@esri/hub-initiatives:** upgraded to 9.45.4
- **@esri/hub-teams:** upgraded to 9.44.4

## @esri/hub-sites [9.45.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.2...@esri/hub-sites@9.45.3) (2022-06-30)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.3
- **@esri/hub-initiatives:** upgraded to 9.45.3
- **@esri/hub-teams:** upgraded to 9.44.3

## @esri/hub-sites [9.45.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.1...@esri/hub-sites@9.45.2) (2022-06-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.2
- **@esri/hub-initiatives:** upgraded to 9.45.2
- **@esri/hub-teams:** upgraded to 9.44.2

## @esri/hub-sites [9.45.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.45.0...@esri/hub-sites@9.45.1) (2022-06-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.1
- **@esri/hub-initiatives:** upgraded to 9.45.1
- **@esri/hub-teams:** upgraded to 9.44.1

# @esri/hub-sites [9.45.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.44.1...@esri/hub-sites@9.45.0) (2022-06-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.45.0
- **@esri/hub-initiatives:** upgraded to 9.45.0
- **@esri/hub-teams:** upgraded to 9.44.0

## @esri/hub-sites [9.44.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.44.0...@esri/hub-sites@9.44.1) (2022-06-27)

### Dependencies

- **@esri/hub-common:** upgraded to 9.44.1
- **@esri/hub-initiatives:** upgraded to 9.44.1
- **@esri/hub-teams:** upgraded to 9.43.1

# @esri/hub-sites [9.44.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.43.3...@esri/hub-sites@9.44.0) (2022-06-24)

### Dependencies

- **@esri/hub-common:** upgraded to 9.44.0
- **@esri/hub-initiatives:** upgraded to 9.44.0
- **@esri/hub-teams:** upgraded to 9.43.0

## @esri/hub-sites [9.43.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.43.2...@esri/hub-sites@9.43.3) (2022-06-23)

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.3
- **@esri/hub-initiatives:** upgraded to 9.43.3
- **@esri/hub-teams:** upgraded to 9.42.3

## @esri/hub-sites [9.43.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.43.1...@esri/hub-sites@9.43.2) (2022-06-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.2
- **@esri/hub-initiatives:** upgraded to 9.43.2
- **@esri/hub-teams:** upgraded to 9.42.2

## @esri/hub-sites [9.43.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.43.0...@esri/hub-sites@9.43.1) (2022-06-15)

### Bug Fixes

- reset version numbers so hopefully it can release ([8da9264](https://github.com/Esri/hub.js/commit/8da9264a15040ae06964eddcfda639009a927be0))

### Dependencies

- **@esri/hub-common:** upgraded to 9.43.1
- **@esri/hub-initiatives:** upgraded to 9.43.1
- **@esri/hub-teams:** upgraded to 9.42.1

# @esri/hub-sites [9.43.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.42.1...@esri/hub-sites@9.43.0) (2022-06-14)

### Dependencies

- **@esri/hub-common:** upgraded to 9.42.0
- **@esri/hub-initiatives:** upgraded to 9.43.0
- **@esri/hub-teams:** upgraded to 9.42.0

## @esri/hub-sites [9.42.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.42.0...@esri/hub-sites@9.42.1) (2022-06-13)

### Dependencies

- **@esri/hub-common:** upgraded to 9.41.1
- **@esri/hub-initiatives:** upgraded to 9.42.1
- **@esri/hub-teams:** upgraded to 9.41.1

# @esri/hub-sites [9.42.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.41.0...@esri/hub-sites@9.42.0) (2022-06-10)

### Dependencies

- **@esri/hub-common:** upgraded to 9.41.0
- **@esri/hub-initiatives:** upgraded to 9.42.0
- **@esri/hub-teams:** upgraded to 9.41.0

# @esri/hub-sites [9.41.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.40.0...@esri/hub-sites@9.41.0) (2022-06-10)

### Dependencies

- **@esri/hub-common:** upgraded to 9.40.0
- **@esri/hub-initiatives:** upgraded to 9.41.0
- **@esri/hub-teams:** upgraded to 9.40.0

# @esri/hub-sites [9.40.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.39.0...@esri/hub-sites@9.40.0) (2022-06-08)

### Dependencies

- **@esri/hub-initiatives:** upgraded to 9.40.0

# @esri/hub-sites [9.39.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.38.0...@esri/hub-sites@9.39.0) (2022-06-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.39.0
- **@esri/hub-initiatives:** upgraded to 9.39.0
- **@esri/hub-teams:** upgraded to 9.39.0

# @esri/hub-sites [9.38.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.37.0...@esri/hub-sites@9.38.0) (2022-06-02)

### Dependencies

- **@esri/hub-common:** upgraded to 9.38.0
- **@esri/hub-initiatives:** upgraded to 9.38.0
- **@esri/hub-teams:** upgraded to 9.38.0

# @esri/hub-sites [9.37.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.36.0...@esri/hub-sites@9.37.0) (2022-05-26)

### Dependencies

- **@esri/hub-common:** upgraded to 9.37.0
- **@esri/hub-initiatives:** upgraded to 9.37.0
- **@esri/hub-teams:** upgraded to 9.37.0

# @esri/hub-sites [9.36.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.35.0...@esri/hub-sites@9.36.0) (2022-05-24)

### Dependencies

- **@esri/hub-common:** upgraded to 9.36.0
- **@esri/hub-initiatives:** upgraded to 9.36.0
- **@esri/hub-teams:** upgraded to 9.36.0

# @esri/hub-sites [9.35.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.34.0...@esri/hub-sites@9.35.0) (2022-05-23)

### Dependencies

- **@esri/hub-common:** upgraded to 9.35.0
- **@esri/hub-initiatives:** upgraded to 9.35.0
- **@esri/hub-teams:** upgraded to 9.35.0

# @esri/hub-sites [9.34.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.33.1...@esri/hub-sites@9.34.0) (2022-05-20)

### Dependencies

- **@esri/hub-common:** upgraded to 9.34.0
- **@esri/hub-initiatives:** upgraded to 9.34.0
- **@esri/hub-teams:** upgraded to 9.34.0

## @esri/hub-sites [9.33.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.33.0...@esri/hub-sites@9.33.1) (2022-05-20)

### Dependencies

- **@esri/hub-initiatives:** upgraded to 9.33.1

# @esri/hub-sites [9.33.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.32.2...@esri/hub-sites@9.33.0) (2022-05-19)

### Dependencies

- **@esri/hub-common:** upgraded to 9.33.0
- **@esri/hub-initiatives:** upgraded to 9.33.0
- **@esri/hub-teams:** upgraded to 9.33.0

## @esri/hub-sites [9.32.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.32.1...@esri/hub-sites@9.32.2) (2022-05-18)

### Dependencies

- **@esri/hub-common:** upgraded to 9.32.1
- **@esri/hub-initiatives:** upgraded to 9.32.2
- **@esri/hub-teams:** upgraded to 9.32.1

## @esri/hub-sites [9.32.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.32.0...@esri/hub-sites@9.32.1) (2022-05-17)

### Dependencies

- **@esri/hub-initiatives:** upgraded to 9.32.1

# @esri/hub-sites [9.32.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.31.3...@esri/hub-sites@9.32.0) (2022-05-17)

### Dependencies

- **@esri/hub-common:** upgraded to 9.32.0
- **@esri/hub-initiatives:** upgraded to 9.32.0
- **@esri/hub-teams:** upgraded to 9.32.0

## @esri/hub-sites [9.31.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.31.2...@esri/hub-sites@9.31.3) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.3
- **@esri/hub-initiatives:** upgraded to 9.31.3
- **@esri/hub-teams:** upgraded to 9.31.3

## @esri/hub-sites [9.31.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.31.1...@esri/hub-sites@9.31.2) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.2
- **@esri/hub-initiatives:** upgraded to 9.31.2
- **@esri/hub-teams:** upgraded to 9.31.2

## @esri/hub-sites [9.31.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.31.0...@esri/hub-sites@9.31.1) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.1
- **@esri/hub-initiatives:** upgraded to 9.31.1
- **@esri/hub-teams:** upgraded to 9.31.1

# @esri/hub-sites [9.31.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.30.1...@esri/hub-sites@9.31.0) (2022-05-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.31.0
- **@esri/hub-initiatives:** upgraded to 9.31.0
- **@esri/hub-teams:** upgraded to 9.31.0

## @esri/hub-sites [9.30.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.30.0...@esri/hub-sites@9.30.1) (2022-05-11)

### Dependencies

- **@esri/hub-common:** upgraded to 9.30.1
- **@esri/hub-initiatives:** upgraded to 9.30.1
- **@esri/hub-teams:** upgraded to 9.30.1

# @esri/hub-sites [9.30.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.29.0...@esri/hub-sites@9.30.0) (2022-05-09)

### Dependencies

- **@esri/hub-common:** upgraded to 9.30.0
- **@esri/hub-initiatives:** upgraded to 9.30.0
- **@esri/hub-teams:** upgraded to 9.30.0

# @esri/hub-sites [9.29.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.28.0...@esri/hub-sites@9.29.0) (2022-04-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.29.0
- **@esri/hub-initiatives:** upgraded to 9.29.0
- **@esri/hub-teams:** upgraded to 9.29.0

# @esri/hub-sites [9.28.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.27.0...@esri/hub-sites@9.28.0) (2022-04-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.28.0
- **@esri/hub-initiatives:** upgraded to 9.28.0
- **@esri/hub-teams:** upgraded to 9.28.0

# @esri/hub-sites [9.27.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.26.3...@esri/hub-sites@9.27.0) (2022-04-11)

### Dependencies

- **@esri/hub-common:** upgraded to 9.27.0
- **@esri/hub-initiatives:** upgraded to 9.27.0
- **@esri/hub-teams:** upgraded to 9.27.0

## @esri/hub-sites [9.26.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.26.2...@esri/hub-sites@9.26.3) (2022-04-08)

### Dependencies

- **@esri/hub-common:** upgraded to 9.26.2
- **@esri/hub-initiatives:** upgraded to 9.26.2
- **@esri/hub-teams:** upgraded to 9.26.2

## @esri/hub-sites [9.26.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.26.1...@esri/hub-sites@9.26.2) (2022-04-07)

### Bug Fixes

- **hub-sites:** ignore draft resources when clone a site or page ([33116fc](https://github.com/Esri/hub.js/commit/33116fc6b09eb129b97c50dc3c69e8c596bed996))

## @esri/hub-sites [9.26.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.26.0...@esri/hub-sites@9.26.1) (2022-04-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.26.1
- **@esri/hub-initiatives:** upgraded to 9.26.1
- **@esri/hub-teams:** upgraded to 9.26.1

# @esri/hub-sites [9.26.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.7...@esri/hub-sites@9.26.0) (2022-04-05)

### Dependencies

- **@esri/hub-common:** upgraded to 9.26.0
- **@esri/hub-initiatives:** upgraded to 9.26.0
- **@esri/hub-teams:** upgraded to 9.26.0

## @esri/hub-sites [9.25.7](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.6...@esri/hub-sites@9.25.7) (2022-04-04)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.7
- **@esri/hub-initiatives:** upgraded to 9.25.7
- **@esri/hub-teams:** upgraded to 9.25.7

## @esri/hub-sites [9.25.6](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.5...@esri/hub-sites@9.25.6) (2022-04-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.6
- **@esri/hub-initiatives:** upgraded to 9.25.6
- **@esri/hub-teams:** upgraded to 9.25.6

## @esri/hub-sites [9.25.5](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.4...@esri/hub-sites@9.25.5) (2022-03-31)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.5
- **@esri/hub-initiatives:** upgraded to 9.25.5
- **@esri/hub-teams:** upgraded to 9.25.5

## @esri/hub-sites [9.25.4](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.3...@esri/hub-sites@9.25.4) (2022-03-31)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.4
- **@esri/hub-initiatives:** upgraded to 9.25.4
- **@esri/hub-teams:** upgraded to 9.25.4

## @esri/hub-sites [9.25.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.2...@esri/hub-sites@9.25.3) (2022-03-30)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.3
- **@esri/hub-initiatives:** upgraded to 9.25.3
- **@esri/hub-teams:** upgraded to 9.25.3

## @esri/hub-sites [9.25.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.1...@esri/hub-sites@9.25.2) (2022-03-25)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.2
- **@esri/hub-initiatives:** upgraded to 9.25.2
- **@esri/hub-teams:** upgraded to 9.25.2

## @esri/hub-sites [9.25.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.25.0...@esri/hub-sites@9.25.1) (2022-03-24)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.1
- **@esri/hub-initiatives:** upgraded to 9.25.1
- **@esri/hub-teams:** upgraded to 9.25.1

# @esri/hub-sites [9.25.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.24.2...@esri/hub-sites@9.25.0) (2022-03-23)

### Dependencies

- **@esri/hub-common:** upgraded to 9.25.0
- **@esri/hub-initiatives:** upgraded to 9.25.0
- **@esri/hub-teams:** upgraded to 9.25.0

## @esri/hub-sites [9.24.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.24.1...@esri/hub-sites@9.24.2) (2022-03-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.24.2
- **@esri/hub-initiatives:** upgraded to 9.24.2
- **@esri/hub-teams:** upgraded to 9.24.2

## @esri/hub-sites [9.24.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.24.0...@esri/hub-sites@9.24.1) (2022-03-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.24.1
- **@esri/hub-initiatives:** upgraded to 9.24.1
- **@esri/hub-teams:** upgraded to 9.24.1

# @esri/hub-sites [9.24.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.23.3...@esri/hub-sites@9.24.0) (2022-03-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.24.0
- **@esri/hub-initiatives:** upgraded to 9.24.0
- **@esri/hub-teams:** upgraded to 9.24.0

## @esri/hub-sites [9.23.3](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.23.2...@esri/hub-sites@9.23.3) (2022-03-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.3
- **@esri/hub-initiatives:** upgraded to 9.23.3
- **@esri/hub-teams:** upgraded to 9.23.3

## @esri/hub-sites [9.23.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.23.1...@esri/hub-sites@9.23.2) (2022-03-18)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.2
- **@esri/hub-initiatives:** upgraded to 9.23.2
- **@esri/hub-teams:** upgraded to 9.23.2

## @esri/hub-sites [9.23.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.23.0...@esri/hub-sites@9.23.1) (2022-03-17)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.1
- **@esri/hub-initiatives:** upgraded to 9.23.1
- **@esri/hub-teams:** upgraded to 9.23.1

# @esri/hub-sites [9.23.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.22.0...@esri/hub-sites@9.23.0) (2022-03-16)

### Dependencies

- **@esri/hub-common:** upgraded to 9.23.0
- **@esri/hub-initiatives:** upgraded to 9.23.0
- **@esri/hub-teams:** upgraded to 9.23.0

# @esri/hub-sites [9.22.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.21.2...@esri/hub-sites@9.22.0) (2022-03-01)

### Dependencies

- **@esri/hub-common:** upgraded to 9.22.0
- **@esri/hub-initiatives:** upgraded to 9.22.0
- **@esri/hub-teams:** upgraded to 9.22.0

## @esri/hub-sites [9.21.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.21.1...@esri/hub-sites@9.21.2) (2022-02-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.21.2
- **@esri/hub-initiatives:** upgraded to 9.21.2
- **@esri/hub-teams:** upgraded to 9.21.2

## @esri/hub-sites [9.21.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.21.0...@esri/hub-sites@9.21.1) (2022-02-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.21.1
- **@esri/hub-initiatives:** upgraded to 9.21.1
- **@esri/hub-teams:** upgraded to 9.21.1

# @esri/hub-sites [9.21.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.20.0...@esri/hub-sites@9.21.0) (2022-02-28)

### Dependencies

- **@esri/hub-common:** upgraded to 9.21.0
- **@esri/hub-initiatives:** upgraded to 9.21.0
- **@esri/hub-teams:** upgraded to 9.21.0

# @esri/hub-sites [9.20.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.19.0...@esri/hub-sites@9.20.0) (2022-02-25)

### Features

- **hub-common:** add removeDomainsBySiteId() ([ddb5999](https://github.com/Esri/hub.js/commit/ddb59992f071cd72e90b5bdc84b9c1809e415293)), closes [#3230](https://github.com/Esri/hub.js/issues/3230)

### Dependencies

- **@esri/hub-common:** upgraded to 9.20.0
- **@esri/hub-initiatives:** upgraded to 9.20.0
- **@esri/hub-teams:** upgraded to 9.20.0

# @esri/hub-sites [9.19.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.18.0...@esri/hub-sites@9.19.0) (2022-02-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.19.0
- **@esri/hub-initiatives:** upgraded to 9.19.0
- **@esri/hub-teams:** upgraded to 9.19.0

# @esri/hub-sites [9.18.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.17.1...@esri/hub-sites@9.18.0) (2022-02-18)

### Dependencies

- **@esri/hub-common:** upgraded to 9.18.0
- **@esri/hub-initiatives:** upgraded to 9.18.0
- **@esri/hub-teams:** upgraded to 9.18.0

## @esri/hub-sites [9.17.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.17.0...@esri/hub-sites@9.17.1) (2022-02-17)

### Dependencies

- **@esri/hub-common:** upgraded to 9.17.1
- **@esri/hub-initiatives:** upgraded to 9.17.1
- **@esri/hub-teams:** upgraded to 9.17.1

# @esri/hub-sites [9.17.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.16.0...@esri/hub-sites@9.17.0) (2022-02-16)

### Dependencies

- **@esri/hub-common:** upgraded to 9.17.0
- **@esri/hub-initiatives:** upgraded to 9.17.0
- **@esri/hub-teams:** upgraded to 9.17.0

# @esri/hub-sites [9.16.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.15.0...@esri/hub-sites@9.16.0) (2022-02-16)

### Dependencies

- **@esri/hub-common:** upgraded to 9.16.0
- **@esri/hub-initiatives:** upgraded to 9.16.0
- **@esri/hub-teams:** upgraded to 9.16.0

# @esri/hub-sites [9.15.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.14.1...@esri/hub-sites@9.15.0) (2022-02-12)

### Dependencies

- **@esri/hub-common:** upgraded to 9.15.0
- **@esri/hub-initiatives:** upgraded to 9.15.0
- **@esri/hub-teams:** upgraded to 9.15.0

## @esri/hub-sites [9.14.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.14.0...@esri/hub-sites@9.14.1) (2022-02-07)

### Dependencies

- **@esri/hub-common:** upgraded to 9.14.1
- **@esri/hub-initiatives:** upgraded to 9.14.1
- **@esri/hub-teams:** upgraded to 9.14.1

# @esri/hub-sites [9.14.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.13.2...@esri/hub-sites@9.14.0) (2022-01-25)

### Dependencies

- **@esri/hub-common:** upgraded to 9.14.0
- **@esri/hub-initiatives:** upgraded to 9.14.0
- **@esri/hub-teams:** upgraded to 9.14.0

## @esri/hub-sites [9.13.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.13.1...@esri/hub-sites@9.13.2) (2022-01-22)

### Dependencies

- **@esri/hub-common:** upgraded to 9.13.2
- **@esri/hub-initiatives:** upgraded to 9.13.2
- **@esri/hub-teams:** upgraded to 9.13.2

## @esri/hub-sites [9.13.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.13.0...@esri/hub-sites@9.13.1) (2022-01-21)

### Dependencies

- **@esri/hub-common:** upgraded to 9.13.1
- **@esri/hub-initiatives:** upgraded to 9.13.1
- **@esri/hub-teams:** upgraded to 9.13.1

# @esri/hub-sites [9.13.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.12.0...@esri/hub-sites@9.13.0) (2022-01-20)

### Dependencies

- **@esri/hub-common:** upgraded to 9.13.0
- **@esri/hub-initiatives:** upgraded to 9.13.0
- **@esri/hub-teams:** upgraded to 9.13.0

# @esri/hub-sites [9.12.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.11.0...@esri/hub-sites@9.12.0) (2022-01-13)

### Dependencies

- **@esri/hub-common:** upgraded to 9.12.0
- **@esri/hub-initiatives:** upgraded to 9.12.0
- **@esri/hub-teams:** upgraded to 9.12.0

# @esri/hub-sites [9.11.0](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.10.2...@esri/hub-sites@9.11.0) (2022-01-08)

### Dependencies

- **@esri/hub-common:** upgraded to 9.11.0
- **@esri/hub-initiatives:** upgraded to 9.11.0
- **@esri/hub-teams:** upgraded to 9.11.0

## @esri/hub-sites [9.10.2](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.10.1...@esri/hub-sites@9.10.2) (2022-01-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.10.2
- **@esri/hub-initiatives:** upgraded to 9.10.2
- **@esri/hub-teams:** upgraded to 9.10.2

## @esri/hub-sites [9.10.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.10.0...@esri/hub-sites@9.10.1) (2022-01-06)

### Dependencies

- **@esri/hub-common:** upgraded to 9.10.1
- **@esri/hub-initiatives:** upgraded to 9.10.1
- **@esri/hub-teams:** upgraded to 9.10.1

## @esri/hub-sites [9.10.1-beta.1](https://github.com/Esri/hub.js/compare/@esri/hub-sites@9.10.0...@esri/hub-sites@9.10.1-beta.1) (2022-01-04)

### Dependencies

- **@esri/hub-common:** upgraded to 9.10.1-beta.1
- **@esri/hub-initiatives:** upgraded to 9.10.1-beta.1
- **@esri/hub-teams:** upgraded to 9.10.1-beta.1

# ALL PRIOR CHANGES ARE IN THE ROOT CHANGELOG FILE
