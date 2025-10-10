---
title: Access Control
navTitle: Access Control
description: Checking Access to Features
order: 10
group: 4-advanced
---

## Access Control in ArcGIS Hub

ArcGIS Hub is a collaboration system, so determining what actions a user can take within a specific context is a common task, known as "access control."

In Hub, access control is managed via **Permissions**.

There are five elements in the Permission system:

- **Permission Policies** — business rules embedded in the system
- **Entity Permission Policies** — additional entity-specific rules that further limit access
- **Entity Feature Flags** — entity-specific means to disable a feature
- **System Feature Flags** — global overrides for specific permissions
- **System Service Flags** — globally disable a service to test graceful degradation UX

For details, see the [Permissions Guide](../permissions).

## Desiging Permission Policies

A permission policy is defined as an object, stored in the `{Entity}BusinessRules.ts` module, and adheres to the following interface:

```ts
export interface IPermissionPolicy {
  // unique permission identifier hub:project:edit etc
  permission: Permission;

  // used to group permissions and remove redundancy
  dependencies?: Permission[];

  // platform requirements - must be met
  services?: HubService[];
  licenses?: HubLicense[];
  platformVersion?: number;
  authenticated?: boolean;
  privileges?: PlatformPrivilege[];

  // Entity requirements
  entityEdit?: boolean;
  entityDelete?: boolean;
  entityOwner?: boolean;

  // allow for more complex checks
  assertions?: IPolicyAssertion[];

  // Overridable requirements
  availability?: HubAvailability[];
  environments?: HubEnvironment[];
  releaseAfter?: string;
  retireAfter?: string;
}
```

The only required property is the `Permission`. If no other properties are set, the permission will resolve to `true` under all conditions.

## Checking Permissions

To determine if a user can take a specific action in a given context, the application calls `checkPermission(...): IPermissionAccessResponse`. The key property on the response is `.access: boolean`, but the response also includes information about all checks that were applied and the reason access was denied, enabling a variety of messages or behaviors.

The `checkPermission(...)` call considers:

- Status of any services the permission depends on
- Availability checks (`alpha`, `beta`, `general`)
- Environment checks (`devext`, `qaext`, `production`, `enterprise-sites`)
- Release gating (to coordinate with a Platform release or a specific date)
- Authentication status
- Platform privileges
- Whether the user is the owner of the entity
- Whether the user has edit access to the entity
- Entity-specific feature flags
- System feature flags
- Overrides passed into the app via query params (`pe=permission:to:enable` or `pd=permission:to:disable`)

## General Logic (No Entity Provided)

`checkPermission(permission, context): IPermissionAccessResponse`

1. Is this a valid permission?
2. Is there a system policy defined for this permission?
3. Is there a system feature flag set for this permission?
   - Hold that flag value, overriding any set by the entity
4. If a flag value is set and it's `false`:
   - Return `access: false, reason: "disabled-by-<entity|feature>-flag"`
5. If a flag value is set and it's `true`:
   - Run all checks except `availability`, `environment`, and `release gating`
6. If no flag is set, run all checks
7. Aggregate all policy checks to determine if access is granted
8. Return `IPermissionAccessResponse`

## General Logic (Entity Provided)

`checkPermission(permission, context, entity): IPermissionAccessResponse`

1. Is this a valid permission?
2. Is there a system policy defined for this permission?
3. If `.entityConfigurable: true` on the policy:
   - Does `entity.features` have a flag for this permission?
     - Hold that flag value
4. Is there a system feature flag set for this permission?
   - Hold that flag value, overriding any set by the entity
5. If a flag value is set and it's `false`:
   - Return `access: false, reason: "disabled-by-<entity|feature>-flag"`
6. If a flag value is set and it's `true`:
   - Run all checks except `availability` and `environment`
7. If no flag is set, run all checks
8. Aggregate all policy checks to determine if access is granted
9. Is there an Entity Policy for this permission?
   - Run all Entity Policy checks
   - If no policy checks pass, access is denied
10. Return `IPermissionAccessResponse`

## Gated Release Model

Permissions are used to restrict access to application functionality, based on various conditions. They are also used to restrict access to functionality until it is formally released. This is known as Release Gating.

This release model separates delivery from release. Developers merge behind permissions while Product chooses cadence of release to customers. A dedicated release permission gates a bundle of changes across environments and availability. Validation in production is possible via URL parameters without bypassing platform checks. When ready, flip to a scheduled date or platform version, then remove the temporary release gate and keep product-facing permissions only.

### Goals and constraints

- Product chooses a cadence that supports customer and business needs.
- Delivery is continuous: develop, test, integrate, and merge independent of the release cadence.
- Minimize extra tracking for docs, blogs, translations at release time.
- Provide a single place to see the planned schedule and to validate current state.
- Allow enabling on production for targeted user acceptance testing and feedback, without full GA.

### Concepts

- Release permissions
  - Temporary, internal gates used to stage and coordinate a release. Never checked directly by features. Used to bundle related capabilities under a single switch.
- Feature flags
  - End‑user opt‑in or opt‑out controls named `hub:feature:*`. Persisted in `hub‑settings.json` and surfaced in UI. Due to the higher level of complexity, use only when a user-facing toggle is required.
- Scheduling gates
  - `releaseAfter`: ISO UTC datetime when a permission becomes true.
  - `retireAfter`: ISO UTC datetime when a permission becomes false.
  - `platformVersion`: Logical version fence, for aligning with a platform cut.
- Environments and Availability gating
  - `environments`: devext, qaext, prod, enterprise
  - `availability`: alpha, beta, general

### Single Feature Release

For a single feature, that will be released independent of other things, a single permission is sufficient.

Example:

```ts
{
    // Group Admin's can message members of a group
    permission: "hub:group:messaging",
    authenticated: true,
    licenses: ["hub-premium"],
    environments: ["qaext"],
    availability: ["alpha"],
    services: ["portal"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
```

If a release happens with the permission in this state, the feature can be tested in production by using `?pe=hub:group:messaging`, which will skip the `environments` and `availibility` checks. Once QA is complete, to release this to all users in production, simply remove the `environments` and `availibility` properties.

```ts
{
    // Group Admin's can message members of a group
    permission: "hub:group:messaging",
    authenticated: true,
    licenses: ["hub-premium"],
    services: ["portal"],
    assertions: [
      {
        property: "context:currentUser",
        type: "is-group-admin",
        value: "entity:id",
      },
    ],
  },
```

### Patterns

### Release Permission Pattern

- Create a root release gate: `hub:release:<id>`.
- Do not check it directly. Only depend on it from product permissions.
- Useful when there are multiple application features that require separate permissions, but are to be released as a unit.
- Stage by scoping with `environments` and `availability`. Later, switch to `releaseAfter` or `platformVersion`.
- Remove the gate after general availability; keep product permissions in place.

Example

```ts
// Epic 13472 — release gate only
{
  permission: "hub:release:13472",
  availability: ["alpha"],
  environments: ["qaext"]
}

// Hub Premium capability depends on the release gate
{
  permission: "hub:content:metadata-card:edit",
  dependencies: ["hub:release:13472"],
  licenses: ["hub-premium"]
}

// Hub Basic CTA depends on the same gate
{
  permission: "hub:content:metadata-card:cta",
  dependencies: ["hub:release:13472"],
  licenses: ["hub-basic"]
}

// View in hub basic and premium, hidden in enterprise, still wired to the gate
{
  permission: "hub:content:metadata-card:view",
  dependencies: ["hub:release:13472"],
  licenses: ["hub-basic", "hub-premium"]
}
```

With this in place, and merged, QA can exercise all the functionality via `?pe="hub:release:13472`

### Scheduling the release

```ts
// Switch from env/availability gating to a date or version fence
{
  permission: "hub:release:13472",
  releaseAfter: "2025-11-05T17:00:00Z" // or platformVersion: "2026.1"
}
```

Finalization

- After the release date or platform cut, remove `hub:release:13472`.
- Product-facing permissions remain. License checks continue to apply.

## Feature Flag Pattern

- Name permission as `hub:feature:*`. Backed by `hub‑settings.json` and surfaced via user settings UI.
- Use only when end users require opt in or out, as the process is more complex and requires opt-in/out UI.

Example

```ts
// hub-settings.json fetched from portal api during auth
{
  "features": {
    "workspace": true // opt-in/out UI sets this value
  },
  "schemaVersion": 1.1,
  "username": "paige_p",
  "updated": 1758319420210
}
```

```ts
// System feature policy
{
	permission: "hub:feature:workspace"
}

// Entity permissions depends on the feature
{
  permission: "hub:content:workspace",
  dependencies: ["hub:feature:workspace"]
}

{
  permission: "hub:project:workspace",
  dependencies: ["hub:feature:workspace"]
}
```

### Resolution flow during opt-in/out Period

During `checkPermission("hub:content:workspace", context)` call, the permission system will transparently use the value from `context.hubSettings.feature.workspace` as the value for `hub:feature:workspace`.

If `context.hubSettings.feature.workspace` is `undefined`, then the permission evaluates the other gating properties. If it is defined, then the value will used, and no other checks are run.

### Ending opt-out Period

A migration is applied to the `hubSettings` object, removing `feature.workspace` , and any other gating properties are removed from `hub:feature:workspace`. This has the effect of making that permission return `.access: true` under all cases, thus ending the opt-out period and forcing all users into the new behavior.

### Release permissions vs Feature flags

| Topic           | Release permissions                                               | Feature flags                                                 |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Purpose         | Stage and coordinate internal release bundles                     | Allow end users to opt in or out of capabilities              |
| Naming          | `hub:release:{id}` and not checked directly                       | `hub:feature:*`                                               |
| Scope control   | `availability`, `environments`, `releaseAfter`, `platformVersion` | Persisted per user via `hub-settings.json` and surfaced in UI |
| Dependencies    | Product permissions depend on the release gate                    | Entity permissions depend on the feature flag                 |
| Prod validation | Use `?pe=hub:release:{id}` bypass env/availability/schedule gates | Use UI toggle or settings. Do not use for internal staging    |
| Removal         | Remove after GA; keep leaf permissions                            | Remains as long as the product supports opt in/out            |

### Developer Guidance

As we build the next generation of ArcGIS Hub, we want behavior to be “configurable by default.” Design and build the UI layer by querying the Permissions subsystem, rather than implementing custom checks in-place. This enables the system to adapt to different licensing or packaging strategies simply by changing business rules, instead of making sweeping code changes.
