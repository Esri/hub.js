# @esri/hub-content

> Manage Hub content [`@esri/hub.js`](https://github.com/Esri/hub.js).

### Example

```bash
npm install @esri/hub-content
```

```js
import { getContent  } from '@esri/hub-content';

// pass in a site id
getContent("abc123")
    .then(
        contentModel => {
            contentModel.title; // access content information
        }
    );
```

## Design

Hub Content is the generic term for Hub-related items and integrated metadata. Content types include datasets, maps, documents, apps, surveys, as well as events, sites, pages, and initiatives. Content provides a common metadata model and interface for creating, viewing, and managing content - as well as content-specific attributes and associations such as map basemap, app datasets, site pages, and initiative site. 

Content have common metadata, associated content or resources (e.g. owner member), and actions (update, delete). Content metadata is composed of the Portal Item + Data with content- or org-specific enrichments. For example, a Map content item has 
- _literal metadata_ like `title`
- _inferred metadata_ such as `coverage` (global, regional, local) derived from the geographic extent, 
- _linked metadata_ `license` created through `licenseInfo`
- _associated resources_ such as datasets via `operationalLayers` or `owner` (`as IHubMember`) via the `item.owner`

### Methods

- `getContent(id, associatedOptions, hubRequestOptions)`
- `createContent(id, attributes, hubRequestOptions)`
- `updateContent(id, attributes, hubRequestOptions)`
- `deleteContent(id, hubRequestOptions)`

`associatedOptions` is proposed to support external references that may require additional XHR to fetch. Similar to JSON-API or GraphQL. 
For example `associatedOptions: { itemInfo: true, itemData: true, connectedContent: 5 }`

- Question: should download formats + links be optional associations or require XHR via the download components?

### Metadata

Based on the [Hub Content UI Inventory](https://app.lucidchart.com/invitations/accept/dab82a25-2ed9-4f63-8075-3db8873087e3)

Attemping a simple _Hungarian Notation_ for attributes suffix: `*Date`, `*Id`, `*Number`. Plural (e.g. `tags`) is an array.

```ts
export interface IContentModel extends IModel {
    id: string; 
    type: 'document' | 'dataset' | 'map' | 'app' | 'site' | 'initiative' | 'event' | 'template' ;
    owner: IHubMember;
    
    access: {
        visibility: 'private' | 'org' | 'public';
        permission?: 'view' | 'edit' | 'admin'; // based on User requesting the info
        updateGroups?: Array<IGroup>;
        viewGroups?: Array<IGroup>;
    };

    metrics?: {
        visibility: 'private' | 'org' | 'updateGroups' | 'public'  ; // TODO: should we share with specific groups?
        viewNumber?: number; // available depending on visibility; 
    };

    // Common metadata
    title: string;
    summary: string;
    description: string;
    license: IHubLicense; // title, description, and optional link to license item with more info
    source: IHubOrg | IHubTeam | IHubMember; // each of these has common metadata like `title`, `thumbnail` , and `link`
    createdDate: Date; 
    publishedDate: Date;
    updatedDate: Date;
    geography: IHubGeography; // {title, coverage (global|regional|local), extent (WSEN), geometry, source}
    categories?: Array<string>;
    tags: Array<string>;
    language: string; // written locale e.g. en, es, cn
    contentUrl: string; // Link the the raw content
    thumbnailUrl: string; // Full URL
    status?: string; // e.g. [in-development, maintained, archived, unreviewed, prototype]

    // Unique or additional formal metadata that will be displayed in sidebar
    metadata?: {
        // Additional custom/formal metadata elements
    };

    // Content specific attributes such as 
    attributes?: {
        // Dataset, e.g.
        fields?: [{name:string, type:string, statistics:Array<any>}];
        recordNumber?: number;
        // Map, e.g.
        layers?: [];
        basemap?: string;
        // Document
        format?: 'link' | 'PDF' | 'MS Word' | 'MS Excel' | 'Text';
        // Initiative
        stage?: string;
        followersNumber?: number;
        coreTeamId?: string; 
        contentTeamId?: string;
        supportingTeamsNumber?: number;
        // Event
        sponsors?: Array<any>;
        attendeesNumber?: number;
        limitNumber?: number;
        startDate?: Date;
        endDate?: Date;
        videoUrl?: string;
    };

    // Depending on the association requests, e.g.
    associations?: {
        relatedContent?: Array<IContentModel>;  // Automatically determined through similar metadata, usages
        connectedContent?: Array<IContentModel>; // Explicit through usage, e.g. a dataset is connected to the Maps that use it.
    }

    // Optional configured app links that replace "Create StoryMap" with links to specific apps/sites
    // 'home' is special as the landing page for the item instead of /content/:id/about or ../explore
    links?: {
        home: string;
    };

    // [Future] View configuration options such as cartography, charts, table, etc.
    contentDisplay?: 'thumbnail' | 'map'; 
    // [Future] Optional configured home at `/content/:id` such as a Page or App 
    home?: {
        type: IContentType;
        contentId?: string; // if type is a Hub content type
        contentUrl?: string; // if type is an external link that will be iframed?
    }

    // Legacy / optional Portal items. TODO: Should these be in `associations`
    item?: IItem; // Portal Item
    data?: { // Portal item.data
        [propName: string]: any;
    };
}

```

### Raw Info

Content also include the original portal info via `content.item` and `content.data` for backwards compatibility and staging of new content model attributes.