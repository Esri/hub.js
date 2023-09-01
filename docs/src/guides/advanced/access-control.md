---
title: Access Control
navTitle: Access Control
description: Checking Access to Features
order: 10
group: 4-advanced
---

## Access Control in ArcGIS Hub

ArcGIS Hub is a collaboration system, and thus determining what actions a user can take, within a specific context is a common task, commonly referred to as "access control"

In Hub, all this is handled via "Permissions"

There are 5 elements to the Permission system:
- Permission Policies - the business rules embedded in the system
- Entity Permission Policies - additional entity specific rules that further limit access
- Entity Feature Flags - entity specific means to disable a feature, 
- System Feature Flags - globally override specific permissions
- System Service Flags - globally disable a service to test graceful degradation UX

For details, please read the [Permissions Guide](../permissions)

## High Level Model

To determine if a user can take a specific action, in some context, the application calls `checkPermission(...): IPermissionAccessResponse`. The critical property on the response is `.access:boolean`, but the response also includes information on all the checks what we applied, as well as the reason access was denied, allowing a variety of different messages or behaviors to be implemented.

The `checkPermission(...)` call takes the following into account:
- status of any services the permission depends on
- availability checks (`alpha`, `beta`, `general`)
- environment checks (`devext`, `qaext`, `production`, `enterprise-sites`)
- authentication status
- platform privileges
- if user is owner of the entity
- if user has edit access to the entity
- entity specific feature flags
- system feature flags

## General Logic when not passed an entity
`checkPermission(permission, context): IPermissionAccessResponse`

- is this a valid permission?
- is there a system policy defined for this permission?
- is there a system feature flag set for this permission?
  - hold that flag value, overriding any set by the entity
- if there is a flag value, and it's `false`
  - return `access:false, reason: "disabled-by-<entity|feature>-flag"`
- if there is a flag value, and it's `true`
  - run all checks other than `availability` and `environment`
- if there is no flag set, run all checks
- aggregate all policy checks, determine if access is granted
- return IPermissionAccessResponse
  
## General Logic when passed an entity
`checkPermission(permission, context, entity): IPermissionAccessResponse`

- is this a valid permission?
- is there a system policy defined for this permission?
- is `.entityConfigurable:true` on the policy?
  - does the `entity.features` have a flag for this permission?
    - hold that flag value
- is there a system feature flag set for this permission?
  - hold that flag value, overriding any set by the entity
- if there is a flag value, and it's `false`
  - return `access:false, reason: "disabled-by-<entity|feature>-flag"`
- if there is a flag value, and it's `true`
  - run all checks other than `availability` and `environment`
- if there is no flag set, run all checks
- aggregate all policy checks, determine if access is granted
- is there an Entity Policy for this permission?
  - run all Entity Policy checks
  - if no policy checks pass, access is denied
- return IPermissionAccessResponse


### Developer Guidance

As we build the next generation of the ArcGIS Hub system, want behavior to be “configurable by default” - meaning that we should design and build the UI layer by querying the Permissions subsystem, instead of implementing custom checks in-place. This will enable the system to adapt to different licensing, or packaging strategies, simply by changing the business rules, instead of making sweeping code changes.
