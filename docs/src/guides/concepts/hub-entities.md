---
title: Hub Entities
navTitle: Hub Entities
description: Core Entities in ArcGIS Hub
order: 3
group: 2-concepts
---

# Hub Entities

While ArcGIS Hub acts as an integration point for the entire ArcGIS ecosystem, at it's core are 5 main entities:

- Hub Sites
- Hub Pages
- Hub Initiatives
- Hub Projects
- Hub Events

While Discussions are a key component of the ArcGIS Hub as a system, they are in independent subsystem, documented in the [Hub Discussions Guide](/hub.js/guides/hub-discussions)

The following sections describe these entities, their role in the Hub System, and how you work with them in Hub.js

### Hub Sites

In terms of ArcGIS Hub, sites are the central entity. A site is backed by an item, it has a [layout](/hub.js/api/common/IHubLayout/) that can include a header and footer, and a theme.

In ArcGIS Online, the item type is `Hub Site Application`

In ArcGIS Enterprise, the item type is `Site Application`

In both environments, we use Hub.js to work with sites via the `HubSiteManager`, which operates on `IHubSite` objects.

#### API Links

- [HubSiteManager (/hub.js/api/common/HubSiteManager)]()
- [IHubSite](/hub.js/api/common/IHubSite)

### Hub Pages

A Hub Page is an item which represents a Page, which can be associated with one or more Hub Sites. It also has a [layout](/hub.js/api/common/IHubLayout/), but since it always renders in the context of a Hub Site, it does not have a theme, header or footer.

In ArcGIS Online, the item type is `Hub Page`

In ArcGIS Enterprise, the item type is `Site Page`

In both environments, we use Hub.js to work with sites via the `HubPageManager`, which operates on `IHubPage` objects.

#### API Links

- [HubPageManager (Not implemented yet)]()
- [IHubPage](/hub.js/api/common/IHubPage)

### Hub Projects

A Hub Project is a customizable representation of a real-world project. It can be associated with one or more Hub Sites or Hub Initiatives. It has a [banner image](), [timeline]() and can optionally have a [layout](/hub.js/api/common/IHubLayout/).

In ArcGIS Online, the item type is `Hub Project`

Hub Projects are not available in ArcGIS Enterprise.

We use Hub.js to work with Projects via the `HubProjectManager`, which operates on `IHubProject` objects.

#### API Links

- [HubProjectManager](/hub.js/api/common/HubProjectManager)
- [IHubProject](/hub.js/api/common/IHubProject)

### Hub Initiatives

A Hub Initiative is a broad umbrella of a real-world project. It can be associated with a Hub Sites and one or more Hub Projects. It has a [banner image](), and can optionally have a [layout](/hub.js/api/common/IHubLayout/).

In ArcGIS Online, the item type is `Hub Initiative`

Hub Initiatives are not available in ArcGIS Enterprise.

We use Hub.js to work with Initiatives via the `HubInitiativeManager`, which operates on `IHubInitiative` objects.

#### API Links

- [HubInitiativeManager (Not implemented yet)]()
- [IHubInitiative](/hub.js/api/common/IHubInitiative)

### Hub Content

Any other items surfaced in ArcGIS Hub, are abstracted into "Hub Content". Depending on the specific item type, the properties available may vary a lot - i.e. a multi-layer feature service exposes a lot more properties than a PDF Document.

Within Hub we do allow users to edit some of the basic Item information - title, description, summary, thumbnail etc, and that is done via the `HubContentManager`, which operates on `IHubContent` objects.

#### API Links

- [HubContentManager (Not implemented yet)]()
- [IHubContent](/hub.js/api/common/IHubContent)

### Hub Events

Hub Events are not currently backed by items, only available in ArcGIS Online (Hub Premium). The are represented by `IHubEvent`

#### API Links

- [HubEventManager (Not implemented yet)]()
- [IHubEvent](/hub.js/api/common/IHubEvent)
