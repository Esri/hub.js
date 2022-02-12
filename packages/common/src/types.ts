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
import { UserSession } from "@esri/arcgis-rest-auth";
import { IStructuredLicense } from "./items/get-structured-license";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IFacet } from "./search";

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

/**
 * @internal
 * This just adds user to the IPortal interface
 */
export interface IHubRequestOptionsPortalSelf extends IPortal {
  user?: IUser;
}

export interface IHubRequestOptions extends IRequestOptions {
  authentication?: UserSession;
  isPortal?: boolean;
  hubApiUrl?: string;
  portalSelf?: IHubRequestOptionsPortalSelf;
}

/**
 * Options for requests that require an authenticated user.
 */
export interface IHubUserRequestOptions extends IHubRequestOptions {
  authentication: UserSession;
}

export interface IItemResource {
  type?: string;
  url: string;
  name: string;
}

export type BBox = number[][];

// DEPRECATED: use BBox instead
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

export type GeographyProvenance = "item" | "none" | "automatic";

/**
 * Location of a Hub resource
 *
 * @export
 * @interface IHubGeography
 */
export interface IHubGeography {
  center?: [number, number];
  geometry?: IGeometry;
  provenance?: GeographyProvenance;
}

export type SearchableType = IItem | IGroup | IUser;
export type SearchFunction = (
  ...args: any[]
) => Promise<ISearchResult<SearchableType>>;

// TODO: remove this at the next breaking change
/**
 * DEPRECATED: Use IHubEntityBase instead.
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

export interface IActionLink {
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
export interface IUpdateSiteOptions extends IUpdatePageOptions {
  updateVersions?: boolean;
}

/**
 * IUpdatePageOptions
 *
 * Options for page updates
 *
 * @export
 * @interface UpdatePageOptions
 */
export interface IUpdatePageOptions extends IHubUserRequestOptions {
  allowList?: string[];
}

export interface IDomainEntry {
  clientKey: string;
  createdAt?: string;
  hostname: string;
  id: string;
  orgId: string;
  orgKey: string;
  orgTitle: string;
  permanentRedirect: boolean;
  siteId: string;
  siteTitle: string;
  sslOnly: boolean;
  updatedAt?: string;
}

/**
 * The catalog object found on Hub Site Application items.
 * It defines a selection of content to show up in the site's
 * search context.
 */
export interface ISiteCatalog {
  /**
   * A list of groups containing searchable content.
   */
  groups: string[];

  /**
   * An org to limit searching to.
   */
  orgId: string;
}

export interface IHubTeam extends IGroup {
  properties: {
    [key: string]: any;
  };
}

/**
 * Defines a generic search response interface with parameterized result type
 * for different types of searches
 *
 * total - total number of results
 * results - potentially paginated list of results
 * hasNext - boolean flag for if there are any more pages ofresults
 * next - invokable function for obtaining next page of results
 */
export interface ISearchResponse<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: (params?: any) => Promise<ISearchResponse<T>>;
  facets?: IFacet[];
}
