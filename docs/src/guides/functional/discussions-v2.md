---
title: Working with Hub Discussions v2
navTitle: Discussions v2
description: Learn how to perform basic flows using the Hub Discussions API via @esri/hub.js.
order: 80
group: 3-functional-api
---

# Overview

As organizations use ArcGIS Hub to support community engagement and collaboration, **ArcGIS Hub Discussions** provides an integrated capability for organizations to meet their varied needs for internal & external collaborative communication around Hub initiatives, content and data.

Hub Discussions will be available in mid-2021 starting with private discussions within Hub Teams. Through the rest of the year, Hub Discussions will expand to support focused public feedback, dataset comments or corrections, and possibly public forums.

## Useful links

- [Hub Discussions API Swagger Docs](https://hub.arcgis.com/api/discussions/v2/docs)
- [Hub Discussions API root](https://hub.arcgis.com/api/discussions/v2)

## Common Terms

A **Post** is created by a User with a reference to a _topic_ and _location_ within datasets, documents, teams, sites, and any Hub resource.

Users can **Reply** to a Post, or add a **Reaction** to quickly indicate support or other feeling.

Posts are shared in a **Channel**. The Channel defines which groups/organizations can participate in the discussion, who can manage posts, and whether the discussion allows public participation.

**Table of Contents**

- [Overview](#overview)
  - [Common Terms](#common-terms)
- [Getting Started](#getting-started)
  - [Authentication](#authentication)
  - [Creating posts](#creating-posts)
- [Posts](#posts)
  - [Posting about content](#posting-about-content)
  - [Replying to posts](#replying-to-posts)
- [Reactions](#reactions)
  - [Creating reactions](#creating-reactions)
- [Searching Posts](#searching-posts)
  - [Expanded Search](#expanded-search)
  - [More Search Examples](#more-search-examples)
- [Channels](#channels)
  - [Channel configuration](#channel-configuration)
  - [Channel participation configuration](#channel-participation-configuration)
  - [Channel participation configuration examples](#channel-participation-configuration-examples)
  - [Moderation](#moderation)
- [Authentication and Authorization](#authentication-and-authorization)
- [In Conclusion](#in-conclusion)
- [Useful links](#useful-links)

# Getting Started

This is a quick introduction to using `@esri/hub-discussions` in your own application or service. You can find more details on each topic further below.

## Authentication

Authentication is provided using [arcgis-rest-js](https://github.com/esri/arcgis-rest-js).

```js
import { UserSession } from "@esri/arcgis-rest-auth";

const authentication = new UserSession({
  username: "jdoe",
  password: "########",
  portal: "https://www.arcgis.com/sharing/rest",
});
```

## Creating posts

To create a post use [createPost](https://esri.github.io/hub.js/api/discussions/createPost/).

The `post.discussion` is important as a reference for the Post to some content item. Currently `discussion` uses a URI like `hub://item/{itemId}`. See [Posting about content](#posting-about-content) for details.

```js
import {
  createPostV2,
  ICreatePost,
  ICreatePostParamsV2,
} from "@esri/hub-discussions";

const data: ICreatePost = {
  title: "Question about updating trees dataset",
  body: "We need to add more details about tree planting date.",
  discussion: "hub://dataset/1234",
  channelId: "3efabc",
};

const opts: ICreatePostOptions = { authentication, data };

const myPost = await createPostV2(opts);
/*
myPost = IPost {
  id: 'abcdefg',
  ...
}
*/
```

# Posts

A Post is the primary forum for dialogue between users in a Channel. Posts are organized into "threads" using a self-join: a post can have many replies, and a post can belong to a single "parent" post. Posts are required to have a `body`, and optionally a `title` (perhaps best suited for parent posts). Posts may also encode a content subject (called `discussion`) and geography (called `geometry`). Posts additionally have a `status`, which dictates visibility and can be used by channel managers to employ light-weight moderation. The full data model for posts is described below:

| **property** | **type** | **nullable** | **description** |
| :----------- | :------  | :----------- | :-------------- |
| body         | string   | false        | Main content of post  |
| title        | string   | true         | Optional title for post |
| status       | [PostStatus](https://esri.github.io/hub.js/api/common/PostStatus/) | false        | Describes a post's visibility  |
| discussion   | string   | true         | See the [Discussion URI](#posting-about-content) section for details. Note that this attribute is optional. A post with no discussion could be viewed as a "general" post ("nice weather we're having" or "let's grab lunch") made in a channel |
| geometry     | Geometry         | true         | Geometry property of GeoJSON spec, projected in WGS84 |
| featureGeometry | Geometry      | true         | Geometry property from related feature of GeoJSON spec, projected in WGS84 |
| appInfo      | string           | true         | Used to store additional information about a post in specific app context |
| postType     | [PostType](https://esri.github.io/hub.js/api/common/PostType/) | true | Post type
| id           | string (UUID v4) | false        | Identifier for the post |
| channelId    | string (UUID v4) | false        | Join field for channel |
| parentId     | string (UUID v4) | true         | Join field for parent post if reply |

## Posting about content

At the core of the Hub Discussions API is the ability to create posts and drive conversation about data. This data can be a literal dataset, a feature in a dataset, an attribute of a feature of a dataset, or it could be an item, or a sentence in a pdf. The idea is that anything can be discussed with this platform. The property `post.discussion` expects a specifically formatted URI string to encapsulate the following information: the application context the post originated from (i.e. Hub, Urban), content type, content id, and optionally for datasets identification of specific layers, features, and attribute. The format allows posts to target coarsely-grained and highly-specific content. See the URI format and examples below:

```
# coarsely-grained
<application context>://<content type>/<content id>

# highly-specific
<application context>://dataset/<dataset id>_<layer id>?id=<feature id>&attribute=<feature attribute>

## examples

# commenting on item ab4
hub://item/ab4

# commenting on layer 1 of dataset 3ef
hub://dataset/3ef_1

# commenting on feature #5 of layer 1 of dataset 3ef
hub://dataset/3ef_1?id=5

# commenting on features #5 & #7
hub://dataset/3ef_1?id=5,7

# commenting on the species attribute of layer 1 of dataset 3ef
hub://dataset/3ef_1?attribute=species

# commenting on the species attributet of feature 5 of layer 1 of 3ef dataset
hub://dataset/3ef_1?id=5&attribute=species
```

## Replying to posts

A core tenet of any discussion system is the ability to reply to posts. Reply posts are just _posts_ using [createReply](https://esri.github.io/hub.js/api/discussions/createReply/), except they have a `postId` which links them to the "parent" post. All of the same validation for creating a post is applied when creating a reply.

Additionally, a reply post _cannot be more visible_ than the parent post. That is to say, a user cannot reply to a post from a private channel in a public channel; however, a user can reply to a post from a public channel in a private channel. As such, replies in private channels must be made to the same channel.

```js
import {
  createReplyV2,
  ICreateReplyParams
  IPostOptions,
} from "@esri/hub-discussions";

const data: IPostOptions = {
  body: "I disagree, I do not like this dataset",
  discussion: "hub://dataset/1234",
};

const opts: ICreateReplyParams = { postId: "abcdefg", authentication, data };

const myReply = await createReplyV2(opts);
/*
myReply = IPost {
  id: 'gjahsdkj',
  ...
}
*/
```

# Reactions

The Reaction model is not central to the objective of enabling in-app communication between ArcGIS Online users, but it offers users the ability to engage with posts in an expressive manner familiar to other popular collaboration platforms (think Slack, GitHub, MS Teams, etc). Reactions encode a user's sentiment ("thumbs up", "crying face", "thinking face", etc) onto a post [using emojis or symbols](https://esri.github.io/hub.js/api/common/PostReaction/).

## Creating reactions

If you want to show support for a post, you can add a thumbs up reaction:

```js
import {
  createReactionV2,
  ICreateReaction,
  ICreateReactionOptions,
  PostReaction,
} from "@esri/hub-discussions";

const data: ICreateReaction = {
  postId: "abd123",
  value: PostReaction.THUMBS_UP,
};

const opts: ICreateReactionOptions = { authentication, data };

const thumbs_up = await createReactionV2(opts);
```

# Searching Posts

Searchable properties are enumerated on the [`ISearchPosts`](https://esri.github.io/hub.js/api/common/ISearchPosts/) interface.

In all of these examples, we created a post about Dataset ID 1234. These posts are linked to that dataset through the `data.discussion` property. If we wanted to search for posts about this dataset, the code would look something like this:

```js
import {
  searchPostsV2,
  ISearchPosts,
  ISearchPostsParams,
} from "@esri/hub-discussions";

const data: ISearchPosts = {
  discussion: "hub://dataset/1234",
};

const opts: ISearchPostsParams = { authentication, data };

const dataset1234Posts = await searchPostsV2(opts);
/*
dataset1234Posts = IPagedResponse<IPost> {
  items: [<IPost>, ...],
  total: 3,
  nextStart: -1
}
*/
```

## Expanded Search

This would return all posts about dataset 1234 in a general sense. But remember that the `discussion` parameter can point to layers, features, and attributes of datasets as well.

What if we wanted to find posts about any and every layer and feature included in the dataset, and not just general posts about the dataset? In the Discussions API, all string parameters utilize PostgreSQL's [LIKE operator](https://www.postgresql.org/docs/9.0/functions-matching.html) when performing queries, so the provided value is actually a pattern and can use % and \_ characters to match sequences and characters, respectively.

Note that this means any _actual_ percent signs or underscores must be backslash escaped. To return _every_ post about dataset 1234, we can change the example above to:

```js
import {
  searchPostsV2,
  ISearchPosts,
  ISearchPostsParams,
} from "@esri/hub-discussions";

const data: ISearchPosts = {
  discussion: "%://dataset/1234%",
};

const opts: ISearchPostsParams = { authentication, data };

const allDataset1234Posts = await searchPostsV2(opts);
/*
allDataset1234Posts = IPagedResponse<IPost> {
  items: [<IPost>, ...],
  total: 6,
  nextStart: -1
}
*/
```

## More Search Examples

The query above will return posts from all application contexts (instead of just `hub://`) and about any layer, feature, or attribute of that dataset.
Some other common query data are enumerated below:

```js
import { ISearchPosts } from '@esri/hub-discussions';

// search for posts by jdoe made in hub about dataset 1234
const data: ISearchPosts = {
  creator: 'jdoe'
  discussion: 'hub://dataset/1234',
};

// search for posts about trees that are replies to post abcdefg
const data: ISearchPosts = {
  body: '%trees%',
  parents: 'abcdefg'
};

// search for posts about trees in private channels only
const data: ISearchPosts = {
  body: '%trees%',
  access: 'private'
};
```

# Channels

Discussions are shared with users through [Channels](https://esri.github.io/hub.js/api/common/IChannel/) -- Channels are the mechanism that determine whether a user can view, reply, or manage a channel's posts.

## Channel configuration

Channels include configurations that set the "rules of engagement" for the discourse that occurs within it. These settings are outlined below:

| **property** | **type** | **default** | **description**  |
| :----------- | :------- | :---------- | :--------------- |
| allowAsAnonymous | boolean  | false   | Enables authenticated users to create posts with author details hidden  |
| allowReaction    | boolean  | true    | Enables users to react to posts in channel |
| allowReply       | boolean  | true    | Enables users to reply to posts |
| allowedReactions | [PostReaction](https://esri.github.io/hub.js/api/common/PostReaction/)[] | null | Array of allowed post reactions in channel. If null, all reactions are allowed |
| blockWords       | string[] | null    | Array of words or phrases that should trigger moderation |
| defaultPostStatus | [PostStatus](https://esri.github.io/hub.js/api/common/PostStatus/) | "approved"  | Enables posts to be reviewed before making them visible to other users |
| metadata         | [IChannelMetadata](https://esri.github.io/hub.js/api/common/IChannelMetadata/) | null | Metadata associated with the channel |
| name             | string   |         | Name for the channel |
| softDelete       | boolean  | true    | Enables soft-delete strategy for posts in channels, meaning that DELETE actions flag posts as "deleted" instead of permanent deletion |
| channelAcl       | [IChannelAclPermission](https://esri.github.io/hub.js/api/common/IChannelAclPermission/)[] |  | Participation configuration for the channel (see next section) |

## Channel participation configuration

The [channel.channelAcl](https://esri.github.io/hub.js/api/common/IChannelAclPermission/) is an array that defines variations of users, organizations, or the public to participate in the discussion. The level of participation is set by the defined [role](https://esri.github.io/hub.js/api/common/Role/). A role of `readWrite` allows creating, updating, and viewing posts in the channel. A role of `read` only allows viewing posts in the channel. A role of `manage` allows creating, updating, and viewing posts in the channel, as well as moderation and channel re-configuration.

Each entry in `channel.channelAcl` has the following shape:

| **property** | **type** | **description**  |
| :----------- | :------- | :--------------- |
| category     | [AclCategory](https://esri.github.io/hub.js/api/common/AclCategory/)    | Category for the permission (`group`, `org`, `anonymousUser`, `authenticatedUser`) <br> Category: `user` not API supported  |
| subCategory  | [AclSubCategory](https://esri.github.io/hub.js/api/common/AclSubCategory/) | SubCategory for the permission (`admin`, `member`) <br> Only valid for category: `group` or `org` |
| key          | string   | Identifier for the category <br> Only valid for category: `group` or `org` or `user` <br> For category: `group` - key is the `ArcGIS Online Group ID` <br> For category: `org` - key is the `ArcGIS Online Organization ID` <br> For category: `user` - key is the user's `ArcGIS Online username` (not API supported) |
| role         | [Role](https://esri.github.io/hub.js/api/common/Role/)    | Role for the permission (`manage`, `readWrite`, `read`, `write`) <br> Role: `owner`, `moderate`, not API supported  |


## Channel participation configuration examples
```js
import { IChannel } from '@esri/hub-discussions';

// group channel
const groupChannel: IChannel = {
  channelAcl: [
    { category: 'group', subCategory: 'admin', key: 'group_id', role: 'owner' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'readWrite' },
  ];
  ...
};

// multiple group channel
const groupChannel: IChannel = {
  channelAcl: [
    { category: 'group', subCategory: 'admin', key: 'group_id', role: 'owner' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'readWrite' },
    { category: 'group', subCategory: 'admin', key: 'group_id_2', role: 'manage' },
    { category: 'group', subCategory: 'member', key: 'group_id_2', role: 'readWrite' },
  ];
  ...
};

// group channel with public participation
const groupChannel: IChannel = {
  channelAcl: [
    { category: 'group', subCategory: 'admin', key: 'group_id', role: 'owner' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'readWrite' },
    { category: 'authenticatedUser', role: 'readWrite' },
  ];
  ...
};

// group channel with public view only participation
const groupChannel: IChannel = {
  channelAcl: [
    { category: 'group', subCategory: 'admin', key: 'group_id', role: 'owner' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'readWrite' },
    { category: 'authenticatedUser', role: 'read' },
  ];
  ...
};

// org channel
const orgChannel: IChannel = {
  channelAcl: [
    { category: 'org', subCategory: 'admin', key: 'org_id', role: 'owner' },
    { category: 'org', subCategory: 'member', key: 'org_id', role: 'readWrite' },
  ];
  ...
};

// org channel with group participation
const orgChannel: IChannel = {
  channelAcl: [
    { category: 'org', subCategory: 'admin', key: 'org_id', role: 'owner' },
    { category: 'org', subCategory: 'member', key: 'org_id', role: 'readWrite' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'readWrite' },
  ];
  ...
};

// org channel with group management
const orgChannel: IChannel = {
  channelAcl: [
    { category: 'org', subCategory: 'admin', key: 'org_id', role: 'owner' },
    { category: 'org', subCategory: 'member', key: 'org_id', role: 'readWrite' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'manage' },
  ];
  ...
};

// org channel with public participation
const orgChannel: IChannel = {
  channelAcl: [
    { category: 'org', subCategory: 'admin', key: 'org_id', role: 'owner' },
    { category: 'org', subCategory: 'member', key: 'org_id', role: 'readWrite' },
    { category: 'authenticatedUser', role: 'readWrite' },
  ];
  ...
};

// org channel with group management and public participation
const orgChannel: IChannel = {
  channelAcl: [
    { category: 'org', subCategory: 'admin', key: 'org_id', role: 'owner' },
    { category: 'org', subCategory: 'member', key: 'org_id', role: 'readWrite' },
    { category: 'group', subCategory: 'member', key: 'group_id', role: 'manage' },
    { category: 'authenticatedUser', role: 'readWrite' },
  ];
  ...
};

```

## Moderation

Users in the channelAcl category/subCategory with a role of `manage` can moderate posts within the channel. **Moderators** are granted the ability to hide, obscure, and delete other user's posts at their discretion. Only moderators can update [**`post.status`**](https://esri.github.io/hub.js/api/common/PostStatus/) -- non-moderators can only view posts where `post.status` equals `'approved'`.

# Authentication and Authorization

All requests to the Hub Discussions API rely on ArcGIS Online for authentication.

In the `@esri/hub-discussions` library, authentication is handled using the familiar [`IHubRequestOptions`](https://esri.github.io/hub.js/api/common/IHubRequestOptions/#authentication) interface, and specifically the [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/) instance attached to it.

A user's access to content stored in the Discussions API is determined by their platform identity -- that is their organization and group memberships and manage roles. As noted above, ArcGIS Online access and permissions are encoded in Channels. Currently, most API methods employ one or many checks comparing Channel specs to the requesting user's identity.

A summary of authorization checks are in the table below (source code: [channels](https://github.com/Esri/hub.js/blob/master/packages/common/src/discussions/api/utils/channels/index.ts), [posts](https://github.com/Esri/hub.js/blob/master/packages/common/src/discussions/api/utils/posts/index.ts)):

| **Permission** | **Description** |
| :------------- | :-------------- |
| create a channel | - create acl entry with category: `anonymousUser OR authenticatedUser` -  user has portal privilege `portal:admin:shareToPublic` or `portal:user:shareToPublic` <br> - create acl entry with category: `group`, subCategory: `admin` - user is the group owner or admin <br> - create acl entry with category: `group`, subCategory: `member` - user is a group member <br> - create acl entry with category: `org`, subCategory: `admin or member` - user has portal privilege `portal:admin:shareToOrg` or `portal:user:shareToOrg` |
| view posts in channel | - an acl entry has category: `anonymousUser` with role: `read` <br> - OR acl entry has category: `authenticatedUser` with role: `read OR readWrite` <br> - OR acl entry has category: `group`, subCategory: `admin OR member` with role `read or readWrite or manage`, and the user is in the group, as a member or admin <br> - OR acl entry has category: `org`, subCategory: `admin OR member` with role `read or readWrite or manage`, and the user is in the org, as a member or admin |
| create post in channel | - acl entry has category: `authenticatedUser` with role: `readWrite OR write` <br> - OR acl entry has category: `group`, subCategory: `admin OR member` with role `readWrite OR write OR manage`, and the user is in the group, as a member or admin <br> - OR acl entry has category: `org`, subCategory: `admin OR member` with role `readWrite, write, or manage`, and the user is in the org, as a member or admin |
| moderate post in channel | - acl entry has category: `group`, subCategory: `admin OR member` with role `manage`, and the user is in the group, as a member or admin <br> - OR acl entry has category: `org`, subCategory: `admin OR member` with role `manage`, and the user is in the org, as a member or admin |

# In Conclusion

The Hub Discussions API has only begun to expose the numerous ways users can interact with each other around data and content in Hub. The API is under continuous development. The `@esri/hub-discussions` package provides a familar Hub.js interface to the API. There is much more that can be done with the Discussions API and library than what is expressed in this guide. Please add an issue to this repo if you have any questions or if something does not work as expected.