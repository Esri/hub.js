---
title: Access Control
navTitle: Access Control
description: Checking Access to Features
order: 10
group: 4-advanced
---

## Access Control in ArcGIS Hub

ArcGIS Hub is a collaboration system, and thus determining what actions a user can take, within a specific context is a common task, commonly referred to as "access control"

Hub.js provides two levels of access controls - Capabilities and Permissions.

### Capabilities vs Permissions

[Capabilities](../capabilities) represent sets of functionality, such as “Events” or “Discussions”, that can be enabled or disabled on a per-entity basis. Capabilities are implemented as sets of Permission checks, which can be different for each entity type.

The Workspace UX will utilize Capabilities to determine what Workspace Navigation links the current user can access, in the context of a specific entity.

![Query Model](/hub.js/img/workspace-capabilities.png)

In contrast, [Permissions](../permissions) are fine-grained access controls, which can be used to show/hide individual buttons or sections of a UI.

Permissions check:

- system status,
- licensing,
- platform access controls,
- ArcGIS Hub business rules
- entity level grant definitions

For more information on how to configure and check access, please see the [Capabilities](../capabilities) and [Permissions](../permissions) guides.

### Developer Guidance

As we build the next generation of the ArcGIS Hub system, want behavior to be “configurable by default” - meaning that we should design and build the UI layer by querying the Capabilities and Permissions subsystems, instead of implementing custom checks in-place. This will enable the system to adapt to different licensing, or packaging strategies, simply by changing the business rules, instead of making sweeping code changes.
