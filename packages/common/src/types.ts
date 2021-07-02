/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IItem,
  IUser,
  IGroup,
  IGeometry,
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-types";
import { IPortal, ISearchResult } from "@esri/arcgis-rest-portal";
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

export interface IDraft {
  item: Partial<IItem>;
  data: any;
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
 * Types of Hub resources
 * DEPRECATED: Use HubFamily instead
 */
export type HubType =
  | "member"
  | "team"
  | "event"
  | "dataset"
  | "document"
  | "map"
  | "app"
  | "site"
  | "initiative"
  | "template"
  | "organization";

export type HubFamily =
  | "people"
  | "team"
  | "event"
  | "dataset"
  | "document"
  | "feedback"
  | "map"
  | "app"
  | "site"
  | "initiative"
  | "template"
  | "content";

/**
 * Visibility levels of a Hub resource
 */
export type Visibility = "private" | "org" | "public";

/**
 * User's access level to a Hub resource
 */
export type AccessControl = "view" | "edit" | "admin";

/**
 * Location of a Hub resource
 *
 * @export
 * @interface IHubGeography
 */
export interface IHubGeography {
  center?: [number, number];
  geometry?: IGeometry;
}

export type SearchableType = IItem | IGroup | IUser;
export type SearchFunction = (
  ...args: any[]
) => Promise<ISearchResult<SearchableType>>;

/**
 * Properties that are common to Hub content, community, members, etc
 *
 * @export
 * @interface IHubResource
 */
export interface IHubResource {
  /** Generic term for the primary label (title, fullname, username, etc.) */
  name: string;
  /** Content snippet or other summary */
  summary?: string;
  // TODO: publisher: IHubOwner // TODO: better name? item.owner with more user metadata
  // Derived metadata
  /** Type of Hub resource */
  hubType: HubType;

  // Explicit data information since this is a common confusion + bug report
  /** Date the item was created */
  createdDate: Date;
  /**
   * description of what was used for this attribute
   * the item key, e.g. `item.created` or `item.metadata.created_date`
   */
  createdDateSource?: string;
  /** Date the item was last updated */
  updatedDate: Date;
  /**
   * description of what was used for this attribute
   * the item key, e.g. `item.modified` or `item.metadata.modified_date`
   */
  updatedDateSource?: string;
  /** URL of the resource's page in the Portal Home application */
  portalHomeUrl?: string;
  /** URL of the Portal API endpoint for the resource */
  portalApiUrl?: string;
  /** Fully qualified URL for the item's thumbnail, including current user's token if authenticated and required */
  thumbnailUrl?: string; // Full URL. item.thumbnail with host + path

  /**
   * boundary will default to the item extent
   * but can be overwritten by enrichments from the Hub API (inline)
   * or fetched from a location such as /resources/boundary.json
   */
  boundary?: IHubGeography;

  // TODO: should metadata be on IHubContent instead of IHubResource?
  /**
   * Additional metadata from a metadata document using a formal or custom schema.
   * For example, [item metadata in ArcGIS Online](https://doc.arcgis.com/en/arcgis-online/manage-data/metadata.htm)
   * Metadata stored in XML format is parsed into JSON.
   */
  metadata?: any;
  // Unique or additional formal metadata that will be displayed in sidebar
}

/**
 * Information about an error that occurred while indexing or composing content
 */
export interface IEnrichmentErrorInfo {
  type: "HTTP" | "AGO" | "Other";
  statusCode?: number;
  message?: string;
}

/**
 * Properties that are common to all Hub content types (dataset, map, document, etc)
 *
 * @export
 * @interface IHubContent
 * @extends {IHubResource,IItem}
 */
export interface IHubContent extends IHubResource, IItem {
  /**
   * The content's ID for use with the Hub API
   * For most content this will be the item's id
   * For layers this will be `<itemId>_<layerId>`
   * This will be undefined for private items and in enterprise
   * because only public online items are included in the Hub API
   */
  hubId?: string;
  // NOTE: we may want to elevate this to IHubResource if it's needed for other subtypes
  /**
   * Content visibility and access control, including groups
   */
  permissions: {
    /** Visibility of the content */
    visibility: Visibility;
    /** Current user's control over the content */
    control?: AccessControl;
    /** The groups that have access to the item (as far as you know) */
    groups?: IGroup[]; // TODO: item.sharing.groups via content/users/:username/items/:id
  };

  // TODO: make this required at next breaking release
  family?: HubFamily;

  // TODO: license: IHubLicense // [Future] item.licenseInfo

  /**
   * Item categories are the original, non-flattened item
   * category strings.
   */
  itemCategories?: string[];
  /**
   * The normalized item type (we run normalizeItemType on
   * the item in order to compute this prop)
   */
  normalizedType?: string;
  /**
   * Date the content was published (formal metadata),
   * defaults to the date the content was created
   */
  publishedDate: Date;
  /** Description of the source of the published date */
  publishedDateSource?: string;

  updateFrequency?: string;

  // Hub configuration metadata
  /** Optional links to show in the Hub application for this content */
  actionLinks?: IActionLink[];
  /** Configure which Hub application actions (i.e. create web map) are available for this content */
  hubActions?: object;
  metrics?: {
    /** Visibility of the metrics for this content in the Hub application */
    visibility: Visibility | "updateGroups";
  };
  /** The content's unique URL slug in the Hub app */
  slug?: string;
  /** URL of the Portal API data endpoint for the resource */
  portalDataUrl?: string;
  /** The ids of any groups that the item belongs to */
  groupIds?: string[];
  /**
   * Any errors encountered when indexing or composing the content
   * see https://github.com/ArcGIS/hub-indexer/blob/master/docs/errors.md#response-formatting-for-errors
   */
  errors?: IEnrichmentErrorInfo[];
  /**
   * The item data associated w/ most types of content
   * the format of the data depends on the item type
   */
  data?: {
    [propName: string]: any;
  };
  // service types: Feature Service, Map Service
  /** service information (currentVersion, capabilities, maxRecordCount etc) */
  server?: Partial<IFeatureServiceDefinition>;
  /** layer information (geometryType, fields, etc) for related layers in the service */
  layers?: Array<Partial<ILayerDefinition>>;
  // layer types: Feature Layers, Raster Layers
  /** layer information (geometryType, fields, etc) */
  layer?: Partial<ILayerDefinition>;
  recordCount?: number;
  // TODO: statistics?: ???
  // NOTE: this is usually(? always?) returned by the item endpoint
  // but it's not on IItem, possibly b/c it's not listed here:
  // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
  /** The owner's organization id */
  orgId?: string;
  /**
   * The owner's organization (portal) details (id, name, extent, etc)
   */
  org?: Partial<IPortal>;
  /** Whether the content is downloadable in the Hub app */
  isDownloadable: boolean;
}

interface IActionLink {
  /** Link title */
  title: string;
  /** Link URL */
  url: string;
}

/**
 * IOperation
 * Represents some operation within the system.
 *
 * Used as a means to track the calls, inputs and outputs
 * during complex processes
 *
 * @export
 * @interface IOperation
 */
export interface IOperation {
  /**
   * Unique identifier:
   * i.e `getItem-3fc`, `convertToTemplate-bc7`
   */
  id: string;
  /**
   * What type of operation is this
   * i.e. getItem, convertToTemplate
   */
  type: string;
  /**
   * Inputs to the operation
   */
  inputs: Record<string, unknown>;
  state?: string;
  startedAt?: number;
  duration?: number;
  output?: Record<string, unknown>;
}

/**
 * Serialized Operation Stack
 *
 * @export
 * @interface SerializedOperationStack
 */
export interface ISerializedOperationStack {
  operations: IOperation[];
}

/**
 * IUpdateSiteOptions
 *
 * Options for site updates
 *
 * @export
 * @interface UpdateSiteOptions
 */
export interface IUpdateSiteOptions extends IHubRequestOptions {
  updateVersions?: boolean;
  allowList?: string[];
}

/**
 * IUpdatePageOptions
 *
 * Options for page updates
 *
 * @export
 * @interface UpdatePageOptions
 */
export interface IUpdatePageOptions extends IHubRequestOptions {
  allowList?: string[];
}
