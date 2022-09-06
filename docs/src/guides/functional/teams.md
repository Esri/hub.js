---
title: Working with Teams
navTitle: Teams
description: Learn how to work with Hub Teams using @esri/hub.js.
order: 90
group: 3-functional-api
---

## Hub Teams

Teams are an organizing principle in Hub. They are backed by `Groups` in the Portal information model, but conceptually they are tightly tied to Sites and Initiatives (depending on licensing).

### Content Team

This team is created for all Sites, and the content in this group is automatically part of the Site's search index.

### Collaboration Team

This team is created for all Sites, and is backed by a "shared editing" Group. All Site content created through the Hub UI is shared to this Team group, allowing members of this Team to edit the content.

### Followers Team

In Hub Premium, an additional third team is created - one that tracks "Followers" of the Site/Initiaitive. This is what manages the "community participation" aspects of the Hub Premium experience.

### Event Teams

In Hub Premium, when an Event is created a Team is created specifically for that event. As users register to attend the event they are added to the backing group. This allows specific content to be shared to people attending the event.

#### A Note about Privileges

Team creation is tightly controlled by various privileges assigned to users in the ArcGIS Portal information model. Although almost any user can create a Site, the Teams are only created of the user has the correct privileges. If they are not created with the Site, they will be automatically created when a user visits areas of the Hub UI that require the team. If the visiting user lacks privileges to create the team an informative message is shown with instructions.

If a user with appropriate privileges visits one of these areas of the UI, the teams will be created, and the original Site owner will automatically be added

## Hub Teams API

At this point the API exposes a set of low-level functions focused mainly on supporting the Hub UI, and are not intended for general developer use. We plan on exposing an API that will allow for the creation of Teams, as well as
