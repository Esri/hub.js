/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem, IUser, IGroup, IGeometry } from "@esri/arcgis-rest-types";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Generic Model, used with all items that have a json
 * `/data` payload
 *
 * @export
 * @interface IModel
 */
export interface IModel {
  item: IItem;
  data?: {
    [propName: string]: any;
  };
  [key: string]: any;
}

/**
 * Defined the Initiative Item as having
 * `type: "Hub Initiative"`
 *
 * @export
 * @interface IInitiativeItem
 * @extends {IItemAdd}
 */
export interface IInitiativeItem extends IItem {
  id: string;
  type: "Hub Initiative";
}

/**
 * Initiative Model
 *
 * @export
 * @interface IInitiativeModel
 * @extends {IModel}
 */
export interface IInitiativeModel extends IModel {
  item: IInitiativeItem;
  data?: {
    [propName: string]: any;
  };
}

export interface IInitiativeModelTemplate {
  item: Partial<IInitiativeItem>;
  data: {
    [propName: string]: any;
  };
}

// TODO fine-tune this with sensible constraints
export type IItemTemplate = Record<string, any>;

export interface ITemplateAsset {
  mimeType?: "image/png" | "image/jpg" | "image/jpeg";
  name: string;
  url?: string;
  type?: string;
}

export interface IModelTemplate {
  itemId: string;
  item: IItemTemplate;
  data: { [propName: string]: any };
  properties?: { [propName: string]: any };
  type: string;
  key: string;
  dependencies?: any[];
  resources?: string[];
  assets?: ITemplateAsset[];
  [propName: string]: any;
}

export interface ISolutionTemplate extends IModel {
  data: {
    templates: IModelTemplate[];
  };
}

export type GenericAsyncFunc = (...args: any) => Promise<any>;

interface IHubRequestOptionsPortalSelf extends IPortal {
  user?: IUser;
}

export interface IHubRequestOptions extends IUserRequestOptions {
  isPortal: boolean;
  hubApiUrl: string;
  portalSelf?: IHubRequestOptionsPortalSelf;
}

export interface IItemResource {
  type?: string;
  url: string;
  name: string;
}

export type IBBox = number[][];

export type IBatch = any[];

export type IBatchTransform = (value: any) => any;

export interface IGetSurveyModelsResponse {
  form: IModel;
  featureService: IModel;
  fieldworker: IModel;
  stakeholder: IModel;
}

export interface IGetGroupSharingDetailsResults {
  group: IGroup;
  modelsToShare: IModel[];
}

export interface IRevertableTaskSuccess {
  status: "fullfilled";
  revert: (...args: any[]) => Promise<any>;
  results: any;
}

export interface IRevertableTaskFailed {
  status: "rejected";
  error: Error;
}

export type IRevertableTaskResult =
  | IRevertableTaskSuccess
  | IRevertableTaskFailed;

/**
 * Hub Types
 */
export type HubType =
  | "member"
  | "team"
  | "event"
  | "dataset"
  | "document"
  | "map "
  | "app "
  | "site"
  | "initiative"
  | "template"
  | "organization";
export type VisibilityOptions = "private" | "org" | "public";
export type ControlOptions = "view" | "edit" | "admin";

// TW: basing this on https://opendata.arcgis.com/api/v3/datasets/7a153563b0c74f7eb2b3eae8a66f2fbb_0/
// but that may not be accurate
export interface IHubGeography {
  center?: [number, number];
  geometry?: IGeometry;
}

export interface IHubResource {
  name: string; // Generic term for the primary label (title, fullname, username, etc.)
  summary?: string; // snippet or other summary
  // publisher: IHubOwner // TODO: better name? item.owner with more user metadata

  // Derived metadata
  hubType: HubType;
  // TW: why is this on IHubResource instead of IHubContent?
  permissions: {
    // overrides item.access with more attributes. could flatten.
    visibility: VisibilityOptions; // item.access
    control?: ControlOptions; // itemControl
    groups?: IGroup[]; // item.sharing.groups via content/users/:username/items/:id
  };

  // Explicit data information since this is a common confusion + bug report
  createdDate: Date; // formal metadata || new Date(item.created)
  createdDateSource?: string; // description of what was used for this attribute
  updatedDate: Date; // formal metadata || new Date(item.modified)
  updatedDateSource?: string; // description of what was used for this attribute
  thumbnailUrl?: string; // Full URL. item.thumbnail with host + path

  // boundary will default to the item extent
  // but can be overwritten by enrichments from the Hub API (inline)
  // or fetched from a location such as /resources/boundary.json
  boundary?: IHubGeography;

  // Additional metadata from custom/formal elements
  metadata?: any;
  // Unique or additional formal metadata that will be displayed in sidebar
}

export interface IHubContent extends IHubResource, IItem {
  // license: IHubLicense // [Future] item.licenseInfo

  publishedDate: Date; // formal metadata || new Date(item.created)
  publishedDateSource?: string; // description of what was used for this attribute

  // Hub configuration metadata
  actionLinks?: IActionLink[]; // item.properties.links
  hubActions?: object; // item.properties.actions - enable/disable standard actions like `createWebmap` or `createStorymap`

  metrics?: {
    // Set visibility for telemetry metrics. Nested object future-proofing, but could flatten.
    visibility: VisibilityOptions | "updateGroups"; // item.properties.metrics
  };

  // TW: not sure about contentUrl - why not just use item.url???
  // contentUrl: string // Link to the raw content. item.url in most (but not all) item types

  // potential future props
  // contentDisplay?: 'thumbnail' | 'map' // [Future] View configuration options such as cartography, charts, table, etc.
  // source: IHubCommunity // [Future] each of these has common metadata like `title`, `thumbnail` , and `link`

  // Content specific values. Combination of relevant item.data, layer info, enrichments, configuration settings
  // could use values instead - which is common within item.data.values
  // TW: why not just add these on the sub types? Examples:
  // - IHubDocument has .format but not .fields or .recordNumebr, etc
  // - IHubDataset has .fields, .recordNumber, but not .basemap, etc
  // attributes?: {
  //     // Dataset, e.g.
  //     fields?: [IField]
  //     recordNumber?: number
  //     // Map, e.g.
  //     layers?: []
  //     basemap?: string
  //     // Document
  //     format?: 'link' | 'PDF' | 'MS Word' | 'MS Excel' | 'Text'
  //     // Initiative
  //     stage?: string
  //     followersNumber?: number
  //     coreTeamId?: string
  //     contentTeamId?: string
  //     supportingTeamsNumber?: number
  // }
}

// Optional configured app links that replace "Create StoryMap" with links to specific apps/sites
// per https://esriarlington.tpondemand.com/entity/96316-content-viewer-sees-associated-app-links
export interface IActionLink {
  title: string;
  url: string;
}
