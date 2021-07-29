---
title: Working with Hub Discussions
navTitle: Hub Discussions
description: Learn how to perform basic flows using the Hub Discussions API via @esri/hub.js.
order: 50
group:  2-concepts
---

# Overview 

As organizations use ArcGIS Hub to support community engagement and collaboration, **ArcGIS Hub Discussions** provides a comprehensive, integrated capability for organizations to meet their varied needs for internal and external communication. Hub Discussions will begin rolling out for customers in mid-2021 starting with private discussions within Hub Teams. Through the rest of the year, Hub Discussions will expand to support focused public feedback, dataset comments or corrections, and possibly public forums.

**Channels** and **Posts** are the central models to the Discussions system. Currently, Channels and Posts are related by a simple one-to-many relationship, where a channel may have many posts and a post belongs to a single channel. A Post can have zero or many **Reactions**, which represent a user's elicited response to a post as emoji, as commonly found in chat applications like MS Teams and Slack. Posts can also belong to other posts as replies.

# Channels

The domain model is linked to ArcGIS Online users through Channels -- Channels are the mechanism that determine whether a user can engage with a piece of discussion content. A Channel represents a unique platform sharing configuration, comprised of a distinct set of values for **[sharing access](https://esri.github.io/hub.js/api/discussions/SharingAccess/)**, **groups**, and **orgs**. Possible values of `channel.access` include `private`, `org` and `public`. `channel.groups` and `channel.orgs` are represented as arrays of group and org ID's, respectively. Combining these three fields results in a flexible configuration that can make discussion content interactable to a select few users or widely visible to an entire organization or open to the public.

## Basic channel configuration

A "team" channel describes a channel model where `channel.access: 'private'` and the groups array contains a single ArcGIS Online group ID, `channel.groups: ['someGroupId']` (By default, `channel.orgs` is populated with the channel-creating user's org ID). In effect, any posts that belong to this channel can be viewed and responded to by members of `'someGroupId'` group only. In the first iteration of Hub Discussions, we will limit users to only create "team" channels.

Following along, other channel types not yet implemented will include "shared", "org", and "public". A "shared" channel will be similar to a "team" channel, except that its `channel.groups` array includes more than one group ID, enabling collaboration between members of multiple teams. An "org" channel will consist of `channel.access: 'org'` and `channel.orgs: ['someOrgId]`, and only members of `'someOrgId'` organization will be granted access to engage with discussion content related to it. Finally, "public" channels are configured using `channel.access: 'public'` and `channel.orgs: ['someOrgId']`, and while only members of `'someOrgId'` can author content in the channel anyone can view its discussions posts.

```js
// Simple channel configurations
import { IChannel } from '@esri/hub-discussions';

// team channel
const teamChannel: IChannel = {
  access: 'private',
  orgs: ['myUserOrg'],
  groups: ['someGroupId'],
  ...
};

// shared channel
const sharedChannel: IChannel = {
  access: 'private',
  orgs: ['myUserOrg'],
  groups: ['someGroupId', 'someOtherGroupId'],
  ...
};

// org channel
const orgChannel: IChannel = {
  access: 'org',
  orgs: ['myUserOrg'],
  groups: [],
  ...
};

// cross-org channel? (tbd)
const xOrgChannel: IChannel = {
  access: 'org',
  orgs: ['myUserOrg', 'someOtherOrgId'],
  groups: [],
  ...
};

// public channel
const publicChannel: IChannel = {
  access: 'public',
  orgs: ['myUserOrg'],
  groups: [],
  ...
};
```

## Advanced channel configuration

Channels include some advanced configurations that set the "rules of engagement" for the discourse that occurs within it. These settings are outlined below:

**property**|**type**|**default**|**description**
-----|-----|-----|-----
allowReply|boolean|true|Enables users to reply to posts
allowAnonymous|boolean|false|Enables anonymous users to create posts (in public channels only)
softDelete|boolean|true|Enables soft-delete strategy for posts in channels, meaning that DELETE actions flag posts as "deleted" instead of permanent deletion
defaultPostStatus|[PostStatus](https://esri.github.io/hub.js/api/discussions/PostStatus/)|"approved"|Posts made in channel will have this status by default. Enables posts to be reviewed before making them visible to other users.
allowReaction|boolean|true|Enables users to react to posts in channel
allowedReactions|[PostReaction](https://esri.github.io/hub.js/api/discussions/PostReaction/)[]|null|Array of allowed post reactions in channel. If null, all reactions are allowed.
blockWords|string[] |[]|Array of words or phrases that should trigger moderation. Not yet implemented in API.

## Moderation

Channels can only be created by an "administrator"-like user. For "team" channels, that is the ArcGIS Online **group owner** or a **group manager**. For "org" and "public" channels, that is a user with the **"Administrator" role**. Similarly, these channel creators are effectively channel **moderators**, and are granted the ability to hide, obscure, and delete other user's posts at their discretion.

# Posts

A Post is the primary forum for dialogue between users in a Channel. Posts are organized into "threads" using a self-join: a post can have many replies, or a post can belong to a single "parent" post. Posts are required to have a `body`, and optionally a `title` (perhaps best suited for parent posts). Posts may also encode a content subject (called `discussion`) and geography (called `geometry`). Posts additionally have a `status`, which dictates visibility and can currently be used by channel managers to employ light-weight moderation. The full data model for posts is described below:

**property**|**type**|**nullable**|**description**
-----|-----|-----|-----
body|string|false|Main content of post
title|string|true|Optional title for post
status|[PostStatus](https://esri.github.io/hub.js/api/discussions/PostStatus/)|false|Describes a post's visibility
discussion|string|true|See the [Discussion URI](#posting-about-content) section for details. Note that this attribute is optional. A post with no discussion could be viewed as a "general" post ("nice weather we're having" or "let's grab lunch") made in a channel
geometry|Geometry|true|Geometry property of GeoJSON spec. Note that the spec requires geometries be projected in WGS84
appInfo|string|true|Used to store additional information about a post in specific app context
channelId|string (UUID v4)|false|Join field for channel
parentId|string (UUID v4)|true|Join field for parent post if reply

## Posting about content

At the core of the Hub Discussions API is the ability to create posts and drive conversation about data. This data can be a literal dataset, a feature in a dataset, an attribute of a feature of a dataset, or it could be an item, or a sentence in a pdf. The idea is that anything can be discussed with this platform. The property `post.discussion` expects a specifically formatted URI string to encapsulate the following information: the application context the post originated from (i.e. Hub, Urban), content type, content id, and optionally for datasets identification of specific layers, features, and attribute. The format allows posts to target coarsely-grained and highly-specific content. See the URI format and examples below:

```
// coarsely-grained
<application context>://<content type>/<content id>

// highly-specific
<application context>://dataset/<dataset id>_<layer id>?id=<feature id>&attribute=<feature attribute>

//// examples

// commenting on item ab4
hub://item/ab4

// commenting on layer 1 of dataset 3ef
hub://dataset/3ef_1

// commenting on feature #5 of layer 1 of dataset 3ef
hub://dataset/3ef_1?id=5

// commenting on features #5 & #7
hub://dataset/3ef_1?id=5,7

// commenting on the species attribute of layer 1 of dataset 3ef
hub://dataset/3ef_1?attribute=species

// commenting on the species attributet of feature 5 of layer 1 of 3ef dataset
hub://dataset/3ef_1?id=5&attribute=species
```

## Replying to posts

A core tenet of any discussion system is the ability to reply to posts. Reply posts are just _posts_, except they have a `parentId` which links them to the "parent" post. All of the same validation for creating a post is applied when creating a reply. Additionally, a reply post _cannot be more visible_ than the parent post. That is to say, a user cannot reply to a post from a private channel in a public channel; however, a user can reply to a post from a public channel in a private channel. As such, replies in private channels must be made to the same channel.

# Reactions

The Reaction model is not central to the objective of enabling in-app communication between ArcGIS Online users, but it offers users the ability to engage with posts in an expressive manner familiar to other popular collaboration platforms (think Slack, GitHub, MS Teams, etc). Reactions encode a user's sentiment ("thumbs up", "crying face", "thinking face", etc) onto a post [using emojis or symbols](https://esri.github.io/hub.js/api/discussions/PostReaction/).

# Authentication and Authorization

All requests to the Hub Discussions API rely on ArcGIS Online for authentication. In the `@esri/hub-discussions` library, authentication is handled using the familiar [`IHubRequestOptions`](https://esri.github.io/hub.js/api/common/IHubRequestOptions/#authentication) interface, and specifically the [`UserSession`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/) instance attached to it.

A user's access to content stored in the Discussions API is determined by their platform identity -- that is their organization and group memberships and any managerial roles therein. As noted above, ArcGIS Online access and permissions are encoded in Channels. Currently, most API methods employ one or many checks comparing Channel specs to the requesting user's identity. A summary of authorization checks are in the table below ([source code](https://github.com/Esri/hub.js/blob/master/packages/discussions/src/utils/channels.ts)):

| **Permission** | **Description** |
|---|---|
| view posts in Channel | If Channel.access is "private", then user must be member of at least one group in Channel.groups If Channel.access is "org", then user must be member of at least one org in Channel.orgs If Channel.access is "public", then any user can view posts |
| create posts in Channel | If Channel.access is "private", then user must be member of at least one group in Channel.groups If Channel.access is "org" or "public", then user must be member of at least one org in Channel.orgs Additionally, if Channel.access is "public" and Channel.allowAnonymous is true, then any user can create posts |
| modify posts in Channel | If Channel.access is "private", then user must be manager of at least one group in Channel.groups If Channel.access is "org" or "public", then user must be admin of at least one org in Channel.orgs |
| create Channel | If Channel.access is "private", then user must be manager of ALL groups in Channel.groups If Channel.access is "org" or "public", then user must be admin of org in Channel.orgs * |

# Using `@esri/hub-discussions`

The sections below highlight common workflows you may engage in using the `@esri/hub-discussions` library.

## Common setup

Each of the following scenarios will assume access to a variable called `authentication`, which is assigned to a user session.

```js
import { UserSession } from '@esri/arcgis-rest-auth';

const authentication = new UserSession({
  username: 'jdoe',
  password: '########',
  portal: 'https://arcgis.com//sharing/rest'
});
```

## Creating posts

To create a post, consider the following code:

```js
import { createPost, ICreatePost, ICreatePostOptions } from '@esri/hub-discussions';

const params: ICreatePost = {
  title: 'Dataset 1234 is so cool',
  body: 'this data ROCKS',
  discussion: 'hub://dataset/1234',
  access: 'private',
  groups: ['someGroupId']
};

const opts: ICreatePostOptions = { authentication, params };

const myPost = await createPost(opts);
/*
myPost = IPost {
  id: 'abcdefg',
  ...
}
*/
```

Note that in this example, the channel configuration for the post is provided alongside the post content. This is a valid way to create a post when the channel ID is unknown, but the sharing configuration is known. In this case, if a "team" channel for `'someGroupId'` doesn't exist and the authenticated user has sufficient permission to create it (i.e. is group manager/owner), then the channel will be created on-the-fly and the post will be joined to it. If the user lacks the ability to create the channel, the API will return an error.

In instances where the channel ID is known, the payload for creating a post changes slightly, omittin the `access` and `groups` properties in favor of `channelId`:

```js
import { createPost, ICreateChannelPost, ICreatePostOptions } from '@esri/hub-discussions';

const params: ICreateChannelPost = {
  title: 'Dataset 1234 is so cool',
  body: 'this data ROCKS',
  discussion: 'hub://dataset/1234',
  channelId: '3efabc'
};

const opts: ICreatePostOptions = { authentication, params };

const myPost = await createPost(opts);
/*
myPost = IPost {
  id: 'abcdefg',
  ...
}
*/
```

Replying to a post is just as simple as creating a post; the only additional piece of information required is the ID of the post to reply to.

```js
import { createReply, ICreateChannelPost, ICreateReplyOptions } from '@esri/hub-discussions';

const params: ICreateChannelPost = {
  body: 'I disagree, I do not like this dataset',
  discussion: 'hub://dataset/1234',
  channelId: '3efabc'
};

const opts: ICreateReplyOptions = { authentication, params, postId: 'abcdefg' };

const myReply = await createReply(opts);
/*
myPost = IPost {
  id: 'gjahsdkj',
  ...
}
*/
```

In all of these examples, we created a post about Dataset ID 1234. These posts are linked to that dataset through the `params.discussion` property. If we wanted to search for posts about this dataset, the code would look something like this:

```js
import { searchPosts, ISearchPosts, ISearchPostsOptions } from '@esri/hub-discussions';

const params: ISearchPosts = {
  discussion: 'hub://dataset/1234',
};

const opts: ISearchPostsOptions = { authentication, params };

const dataset1234Posts = await searchPosts(opts);
/*
dataset1234Posts = IPagedResponse<IPost> {
  items: [<IPost>, ...],
  total: 3,
  nextStart: -1
}
*/
```

This would return all posts about dataset 1234 in a general sense. But remember that the `discussion` parameter can point to layers, features, and attributes of datasets as well. What if we wanted to find posts about any and every layer and feature included in the dataset, and not just general posts about the dataset? In the Discussions API, all string parameters utilize PostgreSQL's [LIKE operator](https://www.postgresql.org/docs/9.0/functions-matching.html) when performing queries, so the provided value is actually a pattern and can use % and \_ characters to match sequences and characters, respectively. Note that this means any _actual_ percent signs or underscores must be backslash escaped. To return _every_ post about dataset 1234, we can change the example above to:

```js
import { searchPosts, ISearchPosts, ISearchPostsOptions } from '@esri/hub-discussions';

const params: ISearchPosts = {
  discussion: '%://dataset/1234%',
};

const opts: ISearchPostsOptions = { authentication, params };

const allDataset1234Posts = await searchPosts(opts);
/*
allDataset1234Posts = IPagedResponse<IPost> {
  items: [<IPost>, ...],
  total: 6,
  nextStart: -1
}
*/
```

The query above will return posts from all application contexts (instead of just `hub://`) and about any layer, feature, or attribute of that dataset.
Some other common query params are enumerated below:

```js
import { searchPosts, ISearchPosts, ISearchPostsOptions } from '@esri/hub-discussions';

// search for posts by jdoe made in hub about dataset 1234
const params: ISearchPosts = {
  creator: 'jdoe'
  discussion: 'hub://dataset/1234',
};

// search for posts about trees that are replies to post abcdefg
const params: ISearchPosts = {
  body: '%trees%',
  parents: 'abcdefg'
};

// search for posts about trees in team channels only
const params: ISearchPosts = {
  body: '%trees%',
  access: 'private'
};
```

If you want to show support for a post, see the following code to give a thumbs up reaction:

```js
import { createReaction, ICreateReaction, ICreateReactionOptions, PostReaction } from '@esri/hub-discussions';

const params: ICreateReaction = {
  postId: 'abd123',
  value: PostReaction.THUMBS_UP
};

const opts: ICreateReactionOptions = { authentication, params };

const thumbs_up = await createReaction(opts);
```

# In Conclusion

The Hub Discussions API has only begun to expose the numerous ways users can interact with each other around data and content in Hub. The API is under continuous development. The `@esri/hub-discussions` package provides a familar Hub.js interface to the API. There is much more that can be done with the Discussions API and library than what is expressed in this guide. Please add an issue to this repo if you have any questions or if something does not work as expected.