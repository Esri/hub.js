/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IItem,
  IUser,
  IGroup,
  IPolygon,
  ISpatialReference,
  IGeometry,
} from "@esri/arcgis-rest-types";
import { IPortal, ISearchResult } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";

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
  resources?: {
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

export interface IHubTrustedOrgsResponse {
  from: IHubTrustedOrgsRelationship;
  to: IHubTrustedOrgsRelationship;
}

export interface IHubTrustedOrgsRelationship {
  orgId: string;
  usersAccess: boolean;
  established: number;
  name?: string;
  hub: boolean;
  state: string;
  [propName: string]: any;
}

export interface IItemResource {
  type?: string;
  url: string;
  name: string;
}

export type BBox = number[][];

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

export type HubFamily =
  | "app"
  | "content"
  | "dataset"
  | "document"
  | "event"
  | "feedback"
  | "initiative"
  | "map"
  | "people"
  | "site"
  | "team"
  | "template"
  | "project"
  | "channel"
  | "discussion"
  | "eventAttendee";

/**
 * Visibility levels of a Hub resource
 */
export type Visibility = "private" | "org" | "public";

/**
 * User"s access level to a Hub resource
 */
export type AccessControl = "view" | "edit" | "admin";

export type GeographyProvenance = "item" | "none" | "automatic";

/**
 * properties to be used with the ArcGIS API geometry class constructors
 */
export interface IGeometryProperties extends IGeometry {
  type: string;
}
export interface IPolygonProperties extends IPolygon, IGeometryProperties {
  type: "polygon";
}

/**
 * Location of a Hub resource
 *
 * @export
 * @interface IHubGeography
 */
export interface IHubGeography {
  center?: [number, number];
  geometry?: IPolygonProperties;
  provenance?: GeographyProvenance;
  spatialReference?: ISpatialReference;
}

export type SearchableType = IItem | IGroup | IUser;
export type SearchFunction = (
  ...args: any[]
) => Promise<ISearchResult<SearchableType>>;

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
  clientKey?: string;
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
}

/**
 * BEGIN CONTENT UPLOAD RELATED TYPES
 * Please note that the below enum/types are duplicated from the AGO
 * content upload modal. They were brought over for forward compability purposes and changes
 * to them may impact how our content upload works.
 */

/**
 * ENUM which defines File extensions.
 */
export enum FileExtension {
  aptx = "aptx",
  bpk = "bpk",
  csv = "csv",
  eaz = "eaz",
  esriaddin = "esriaddin",
  esriaddinx = "esriaddinx",
  doc = "doc",
  docx = "docx",
  dlpk = "dlpk",
  featurecollection = "featurecollection",
  geojson = "geojson",
  gcpk = "gcpk",
  gpk = "gpk",
  gpkg = "gpkg",
  gpkx = "gpkx",
  insightswbk = "insightswbk",
  ipynb = "ipynb",
  jpg = "jpg",
  jpeg = "jpeg",
  json = "json",
  key = "key",
  kml = "kml",
  kmz = "kmz",
  lpk = "lpk",
  lpkx = "lpkx",
  lyr = "lyr",
  lyrx = "lyrx",
  mapx = "mapx",
  mmpk = "mmpk",
  mpk = "mpk",
  mpkx = "mpkx",
  msd = "msd",
  mspk = "mspk",
  mxd = "mxd",
  ncfg = "ncfg",
  nmc = "nmc",
  nmf = "nmf",
  numbers = "numbers",
  pages = "pages",
  pagx = "pagx",
  parquet = "parquet",
  pdf = "pdf",
  pmf = "pmf",
  png = "png",
  ppkx = "ppkx",
  ppt = "ppt",
  pptx = "pptx",
  proconfigx = "proconfigx",
  rpk = "rpk",
  rptx = "rptx",
  sd = "sd",
  slpk = "slpk",
  spk = "spk",
  stylx = "stylx",
  surveyaddin = "surveyaddin",
  sxd = "sxd",
  tif = "tif",
  tiff = "tiff",
  tpk = "tpk",
  tpkx = "tpkx",
  vsd = "vsd",
  vtpk = "vtpk",
  wmpk = "wmpk",
  wpk = "wpk",
  xls = "xls",
  xml = "xml",
  xlsx = "xlsx",
  zip = "zip",
  "3dd" = "3dd",
  "3vr" = "3vr",
  "3ws" = "3ws",
  "rft.json" = "rft.json",
  "rft.xml" = "rft.xml",
}

/**
 * List of item type objects that are supported by AGO
 * updated as of 2024-11-1
 */
export const ItemTypes = [
  {
    type: "Web Map",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Map Document",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["msd"],
    uploadable: true,
  },
  {
    type: "Scene Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["slpk", "spk"],
    uploadable: true,
  },
  {
    type: "Scene Package Part",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Globe Document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["3dd"],
    uploadable: true,
  },
  {
    type: "Scene Document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["sxd"],
    uploadable: true,
  },
  {
    type: "Published Map",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["pmf"],
    uploadable: true,
  },
  {
    type: "Explorer Map",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["nmf"],
    uploadable: true,
  },
  {
    type: "Explorer Layer",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["nmc"],
    uploadable: true,
  },
  {
    type: "Explorer Add In",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["eaz"],
    uploadable: true,
  },
  {
    type: "Layer Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["lpk", "lpkx"],
    uploadable: true,
  },
  {
    type: "Layer",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["lyr"],
    uploadable: true,
  },
  {
    type: "Map Service",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Geocoding Service",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Network Analysis Service",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Globe Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Geoprocessing Service",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Geodata Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Image Service",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Geometry Service",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Web Mapping Application",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Feature Service",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Scene Service",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Featured Items",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Map Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["mpk", "mpkx"],
    uploadable: true,
  },
  {
    type: "Code Attachment",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Windows Mobile Package",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["wmpk"],
    uploadable: true,
  },
  {
    type: "Addin Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Desktop Add In",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["esriaddin"],
    uploadable: true,
  },
  {
    type: "Legend",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Mobile Application",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Code Sample",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Geoprocessing Sample",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Map Template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Desktop Application Template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Feature Collection",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["featurecollection"],
    uploadable: true,
  },
  {
    type: "Geoprocessing Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["gpk", "gpkx"],
    uploadable: true,
  },
  {
    type: "Service Definition",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["sd"],
    uploadable: true,
  },
  {
    type: "Feature Collection Template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Symbol Set",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Locator Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["gcpk"],
    uploadable: true,
  },
  {
    type: "CSV",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["csv"],
    uploadable: true,
  },
  {
    type: "Shapefile",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Tile Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["tpk", "tpkx"],
    uploadable: true,
  },
  {
    type: "KML",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["kml", "kmz"],
    uploadable: true,
  },
  {
    type: "WMS",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Color Set",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Workflow Manager Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["wpk"],
    uploadable: true,
  },
  {
    type: "Workflow Manager Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Viewer Configuration",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Windows Viewer Add In",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "CityEngine Web Scene",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["3ws"],
    uploadable: true,
  },
  {
    type: "Application Configuration",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "ArcPad Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Operation View",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Operations Dashboard Add In",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Application",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Document Link",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Microsoft Word",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["doc", "docx"],
    uploadable: true,
  },
  {
    type: "Microsoft Excel",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["xls", "xlsx"],
    uploadable: true,
  },
  {
    type: "PDF",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["pdf"],
    uploadable: true,
  },
  {
    type: "Image",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["jpg", "jpeg", "png", "tif", "tiff"],
    uploadable: true,
  },
  {
    type: "Visio Document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["vsd"],
    uploadable: true,
  },
  {
    type: "Microsoft Powerpoint",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["ppt", "pptx"],
    uploadable: true,
  },
  {
    type: "CSV Collection",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "KML Collection",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "File Geodatabase",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Rule Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["rpk"],
    uploadable: true,
  },
  {
    type: "Desktop Application",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Basemap Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Task File",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "SQLite Geodatabase",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Map Area",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Web Scene",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Project Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["ppkx"],
    uploadable: true,
  },
  {
    type: "iWork Keynote",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["key"],
    uploadable: true,
  },
  {
    type: "iWork Pages",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["pages"],
    uploadable: true,
  },
  {
    type: "iWork Numbers",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["numbers"],
    uploadable: true,
  },
  {
    type: "Pro Map",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["mapx"],
    uploadable: true,
  },
  {
    type: "Layout",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["pagx"],
    uploadable: true,
  },
  {
    type: "CAD Drawing",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Stream Service",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "GeoJson",
    family: "dataset",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["geojson", "json"],
    uploadable: true,
  },
  {
    type: "Style",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Desktop Style",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["stylx"],
    uploadable: true,
  },
  {
    type: "Layer Template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Activity",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Project Template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["aptx"],
    uploadable: true,
  },
  {
    type: "Mobile Map Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["mmpk"],
    uploadable: true,
  },
  {
    type: "Mobile Basemap Package",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["bpk"],
    uploadable: true,
  },
  {
    type: "Raster function template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["rft.json", "rft.xml"],
    uploadable: true,
  },
  {
    type: "Operations Dashboard Extension",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Native Application",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Native Application Template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Native Application Installer",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Vector Tile Service",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Vector Tile Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["vtpk"],
    uploadable: true,
  },
  {
    type: "Data Package Collection",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Geoenrichment Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Server",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Workforce Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Form",
    family: "feedback",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Report Template",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Big Data File Share",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Notebook",
    family: "document",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["ipynb"],
    uploadable: true,
  },
  {
    type: "Notebook Code Snippets",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Notebook Code Snippet Library",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Workbook",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Model",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Relational Database Connection",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "ArcGIS Pro Add In",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["esriaddinx"],
    uploadable: true,
  },
  {
    type: "Statistical Data Collection",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "netCDF",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "WFS",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "OGCFeatureServer",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "WMTS",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Replication Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "360 VR Experience",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["3dd"],
    uploadable: true,
  },
  {
    type: "Insights Page",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Image Collection",
    family: "map",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "ArcGIS Pro Configuration",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["proconfigx"],
    uploadable: true,
  },
  {
    type: "Dashboard",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Hub Initiative",
    family: "initiative",
    entityType: "item",
    hubEntityType: "initiative",
    uploadable: false,
  },
  {
    type: "Hub Site Application",
    family: "site",
    entityType: "item",
    hubEntityType: "site",
    uploadable: false,
  },
  {
    type: "Hub Page",
    family: "document",
    entityType: "item",
    hubEntityType: "page",
    uploadable: false,
  },
  {
    type: "AppBuilder Extension",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "AppBuilder Widget Package",
    family: "content",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Content Category Set",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Ortho Mapping Template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Ortho Mapping Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Solution",
    family: "template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Theme",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Mobile Scene Package",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["mspk"],
    uploadable: true,
  },
  {
    type: "Oriented Imagery Catalog",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "App Bundle",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Export Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Deep Learning Package",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip", "dlpk"],
    uploadable: true,
  },
  {
    type: "GeoPackage",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["gpkg"],
    uploadable: true,
  },
  {
    type: "Big Data Analytic",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Real Time Analytic",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Feed",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Data Store",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Excalibur Imagery Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Mission",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Compact Tile Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Site Application",
    family: "site",
    entityType: "item",
    hubEntityType: "site",
    uploadable: false,
  },
  {
    type: "Site Page",
    family: "document",
    entityType: "item",
    hubEntityType: "page",
    uploadable: false,
  },
  {
    type: "StoryMap",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "QuickCapture Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Urban Model",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Pro Report",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["rptx"],
    uploadable: true,
  },
  {
    type: "Web Experience",
    family: "app",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Workflow",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Survey123 Add In",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["surveyaddin"],
    uploadable: true,
  },
  {
    type: "Web Experience Template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Script",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Kernel Gateway Connection",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "User License Type Extension",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "API Key",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Knowledge Graph",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Web Link Chart",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Hub Initiative Template",
    family: "template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Indoors Map Configuration",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Mission Report",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Esri Classification Schema",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Deep Learning Studio Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Administrative Report",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "StoryMap Theme",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Hub Event",
    family: "event",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Web AppBuilder Widget",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "GML",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["zip"],
    uploadable: true,
  },
  {
    type: "Earth Configuration",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["xml"],
    uploadable: true,
  },
  {
    type: "GeoBIM Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "GeoBIM Application",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Knowledge Graph Web Investigation",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Pro Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Workbook Package",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["insightswbk"],
    uploadable: true,
  },
  {
    type: "Apache Parquet",
    entityType: "item",
    hubEntityType: "content",
    fileExtensions: ["parquet"],
    uploadable: true,
  },
  {
    type: "SMX Item",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "SMX Theme",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "SMX Map",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Symbol Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Hub Project",
    family: "project",
    entityType: "item",
    hubEntityType: "project",
    uploadable: false,
  },
  {
    type: "Video Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Experience Builder Widget Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Experience Builder Widget",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Data Pipeline",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Suitability Model",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Esri Classifier Definition",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Data Engineering Model",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Insights Data Engineering Workbook",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Pro Report Template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Arcade Module",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "AllSource Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Reality Studio Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Reality Mapping Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Discussion",
    family: "discussion",
    entityType: "item",
    hubEntityType: "discussion",
    uploadable: false,
  },
  {
    type: "Knowledge Studio Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Mission Template",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "3DTiles Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "3DTiles Service",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "IPS Configuration",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Group Layer",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Media Layer",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Knowledge Graph Layer",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Living Atlas Export Package",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Analysis Model",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "WCS",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Urban Project",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Pro Presentation",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
  {
    type: "Application SDK",
    entityType: "item",
    hubEntityType: "content",
    uploadable: false,
  },
];

export const TypeFamilyMap = {
  map: [
    {
      type: "Web Map",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Map Service",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Feature Service",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Scene Service",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "WMS",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Web Scene",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Vector Tile Service",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "WFS",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "WMTS",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Image Collection",
      family: "map",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
  ],
  content: [
    {
      type: "Map Document",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["msd"],
      uploadable: true,
    },
    {
      type: "Scene Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["slpk", "spk"],
      uploadable: true,
    },
    {
      type: "Explorer Layer",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["nmc"],
      uploadable: true,
    },
    {
      type: "Explorer Add In",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["eaz"],
      uploadable: true,
    },
    {
      type: "Layer Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["lpk", "lpkx"],
      uploadable: true,
    },
    {
      type: "Layer",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["lyr"],
      uploadable: true,
    },
    {
      type: "Geocoding Service",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Network Analysis Service",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Geoprocessing Service",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Geometry Service",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Map Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["mpk", "mpkx"],
      uploadable: true,
    },
    {
      type: "Code Attachment",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Desktop Add In",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["esriaddin"],
      uploadable: true,
    },
    {
      type: "Mobile Application",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Code Sample",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Geoprocessing Sample",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Map Template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Desktop Application Template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Geoprocessing Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["gpk", "gpkx"],
      uploadable: true,
    },
    {
      type: "Service Definition",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["sd"],
      uploadable: true,
    },
    {
      type: "Feature Collection Template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Locator Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["gcpk"],
      uploadable: true,
    },
    {
      type: "Tile Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["tpk", "tpkx"],
      uploadable: true,
    },
    {
      type: "Workflow Manager Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["wpk"],
      uploadable: true,
    },
    {
      type: "Application Configuration",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "ArcPad Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Operations Dashboard Add In",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Rule Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["rpk"],
      uploadable: true,
    },
    {
      type: "Desktop Application",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "SQLite Geodatabase",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Map Area",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Project Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["ppkx"],
      uploadable: true,
    },
    {
      type: "Layout",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["pagx"],
      uploadable: true,
    },
    {
      type: "CAD Drawing",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Style",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Desktop Style",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["stylx"],
      uploadable: true,
    },
    {
      type: "Layer Template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Project Template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["aptx"],
      uploadable: true,
    },
    {
      type: "Mobile Map Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["mmpk"],
      uploadable: true,
    },
    {
      type: "Raster function template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["rft.json", "rft.xml"],
      uploadable: true,
    },
    {
      type: "Native Application",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Vector Tile Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["vtpk"],
      uploadable: true,
    },
    {
      type: "Report Template",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "360 VR Experience",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["3dd"],
      uploadable: true,
    },
    {
      type: "AppBuilder Widget Package",
      family: "content",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
  ],
  noFamily: [
    {
      type: "Scene Package Part",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Globe Document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["3dd"],
      uploadable: true,
    },
    {
      type: "Scene Document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["sxd"],
      uploadable: true,
    },
    {
      type: "Published Map",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["pmf"],
      uploadable: true,
    },
    {
      type: "Explorer Map",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["nmf"],
      uploadable: true,
    },
    {
      type: "Globe Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Geodata Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Featured Items",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Windows Mobile Package",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["wmpk"],
      uploadable: true,
    },
    {
      type: "Addin Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Legend",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Symbol Set",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Color Set",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Workflow Manager Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Viewer Configuration",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Windows Viewer Add In",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Visio Document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["vsd"],
      uploadable: true,
    },
    {
      type: "Basemap Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Task File",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Activity",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Mobile Basemap Package",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["bpk"],
      uploadable: true,
    },
    {
      type: "Operations Dashboard Extension",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Native Application Template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Native Application Installer",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Data Package Collection",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Geoenrichment Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Server",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Workforce Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Big Data File Share",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Notebook Code Snippets",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Notebook Code Snippet Library",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Model",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Relational Database Connection",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "ArcGIS Pro Add In",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["esriaddinx"],
      uploadable: true,
    },
    {
      type: "Statistical Data Collection",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "netCDF",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "OGCFeatureServer",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Replication Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "ArcGIS Pro Configuration",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["proconfigx"],
      uploadable: true,
    },
    {
      type: "AppBuilder Extension",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Content Category Set",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Ortho Mapping Template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Ortho Mapping Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Theme",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Mobile Scene Package",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["mspk"],
      uploadable: true,
    },
    {
      type: "Oriented Imagery Catalog",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "App Bundle",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Export Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Deep Learning Package",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip", "dlpk"],
      uploadable: true,
    },
    {
      type: "GeoPackage",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["gpkg"],
      uploadable: true,
    },
    {
      type: "Big Data Analytic",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Real Time Analytic",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Feed",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Data Store",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Excalibur Imagery Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Mission",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Compact Tile Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "QuickCapture Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Pro Report",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["rptx"],
      uploadable: true,
    },
    {
      type: "Workflow",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Survey123 Add In",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["surveyaddin"],
      uploadable: true,
    },
    {
      type: "Web Experience Template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Script",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Kernel Gateway Connection",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "User License Type Extension",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "API Key",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Knowledge Graph",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Web Link Chart",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Indoors Map Configuration",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Mission Report",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Esri Classification Schema",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Deep Learning Studio Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Administrative Report",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "StoryMap Theme",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Web AppBuilder Widget",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "GML",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Earth Configuration",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["xml"],
      uploadable: true,
    },
    {
      type: "GeoBIM Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "GeoBIM Application",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Knowledge Graph Web Investigation",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Pro Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Workbook Package",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["insightswbk"],
      uploadable: true,
    },
    {
      type: "Apache Parquet",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["parquet"],
      uploadable: true,
    },
    {
      type: "SMX Item",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "SMX Theme",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "SMX Map",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Symbol Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Video Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Experience Builder Widget Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Experience Builder Widget",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Data Pipeline",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Suitability Model",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Esri Classifier Definition",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Data Engineering Model",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Data Engineering Workbook",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Pro Report Template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Arcade Module",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "AllSource Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Reality Studio Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Reality Mapping Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Knowledge Studio Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Mission Template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "3DTiles Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "3DTiles Service",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "IPS Configuration",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Group Layer",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Media Layer",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Knowledge Graph Layer",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Living Atlas Export Package",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Analysis Model",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "WCS",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Urban Project",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Pro Presentation",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Application SDK",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
  ],
  dataset: [
    {
      type: "Image Service",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Feature Collection",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["featurecollection"],
      uploadable: true,
    },
    {
      type: "CSV",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["csv"],
      uploadable: true,
    },
    {
      type: "Shapefile",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "KML",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["kml", "kmz"],
      uploadable: true,
    },
    {
      type: "CSV Collection",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "KML Collection",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "File Geodatabase",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["zip"],
      uploadable: true,
    },
    {
      type: "Stream Service",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "GeoJson",
      family: "dataset",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["geojson", "json"],
      uploadable: true,
    },
  ],
  app: [
    {
      type: "Web Mapping Application",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "CityEngine Web Scene",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["3ws"],
      uploadable: true,
    },
    {
      type: "Operation View",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Application",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Workbook",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Insights Page",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Dashboard",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "StoryMap",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Urban Model",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Web Experience",
      family: "app",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
  ],
  document: [
    {
      type: "Document Link",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Microsoft Word",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["doc", "docx"],
      uploadable: true,
    },
    {
      type: "Microsoft Excel",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["xls", "xlsx"],
      uploadable: true,
    },
    {
      type: "PDF",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["pdf"],
      uploadable: true,
    },
    {
      type: "Image",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["jpg", "jpeg", "png", "tif", "tiff"],
      uploadable: true,
    },
    {
      type: "Microsoft Powerpoint",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["ppt", "pptx"],
      uploadable: true,
    },
    {
      type: "iWork Keynote",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["key"],
      uploadable: true,
    },
    {
      type: "iWork Pages",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["pages"],
      uploadable: true,
    },
    {
      type: "iWork Numbers",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["numbers"],
      uploadable: true,
    },
    {
      type: "Pro Map",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["mapx"],
      uploadable: true,
    },
    {
      type: "Notebook",
      family: "document",
      entityType: "item",
      hubEntityType: "content",
      fileExtensions: ["ipynb"],
      uploadable: true,
    },
    {
      type: "Hub Page",
      family: "document",
      entityType: "item",
      hubEntityType: "page",
      uploadable: false,
    },
    {
      type: "Site Page",
      family: "document",
      entityType: "item",
      hubEntityType: "page",
      uploadable: false,
    },
  ],
  feedback: [
    {
      type: "Form",
      family: "feedback",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
  ],
  initiative: [
    {
      type: "Hub Initiative",
      family: "initiative",
      entityType: "item",
      hubEntityType: "initiative",
      uploadable: false,
    },
  ],
  site: [
    {
      type: "Hub Site Application",
      family: "site",
      entityType: "item",
      hubEntityType: "site",
      uploadable: false,
    },
    {
      type: "Site Application",
      family: "site",
      entityType: "item",
      hubEntityType: "site",
      uploadable: false,
    },
  ],
  template: [
    {
      type: "Solution",
      family: "template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
    {
      type: "Hub Initiative Template",
      family: "template",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
  ],
  event: [
    {
      type: "Hub Event",
      family: "event",
      entityType: "item",
      hubEntityType: "content",
      uploadable: false,
    },
  ],
  project: [
    {
      type: "Hub Project",
      family: "project",
      entityType: "item",
      hubEntityType: "project",
      uploadable: false,
    },
  ],
  discussion: [
    {
      type: "Discussion",
      family: "discussion",
      entityType: "item",
      hubEntityType: "discussion",
      uploadable: false,
    },
  ],
};

/**
 * ENUM which defines human readable Item Type names
 * DO **NOT** UPDATE THIS ENUM W/O RESOLVING https://devtopia.esri.com/dc/hub/issues/6990
 */
export enum ItemType {
  "360 VR Experience" = "360 VR Experience",
  "Apache Parquet" = "Apache Parquet",
  "AppBuilder Widget Package" = "AppBuilder Widget Package",
  "Desktop Add In" = "Desktop Add In",
  "Explorer Add In" = "Explorer Add In",
  "Explorer Map" = "Explorer Map",
  "Explorer Layer" = "Explorer Layer",
  "Windows Mobile Package" = "Windows Mobile Package",
  "ArcGIS Pro Add In" = "ArcGIS Pro Add In",
  "ArcGIS Pro Configuration" = "ArcGIS Pro Configuration",
  "Globe Document" = "Globe Document",
  "Map Document" = "Map Document",
  "ArcPad Package" = "ArcPad Package",
  "Published Map" = "Published Map",
  "Scene Document" = "Scene Document",
  "CityEngine Web Scene" = "CityEngine Web Scene",
  "Code Sample" = "Code Sample",
  "CSV Collection" = "CSV Collection",
  "CSV" = "CSV",
  "CAD Drawing" = "CAD Drawing",
  "Deep Learning Package" = "Deep Learning Package",
  "Desktop Application" = "Desktop Application",
  "Desktop Application Template" = "Desktop Application Template",
  "Desktop Style" = "Desktop Style",
  "Earth Configuration" = "Earth Configuration",
  "Feature Collection" = "Feature Collection",
  "File Geodatabase" = "File Geodatabase",
  "GeoJson" = "GeoJson",
  "Geoprocessing Package" = "Geoprocessing Package",
  "GeoPackage" = "GeoPackage",
  "Geoprocessing Sample" = "Geoprocessing Sample",
  "GML" = "GML",
  "Image Collection" = "Image Collection",
  "Image" = "Image",
  "iWork Keynote" = "iWork Keynote",
  "iWork Numbers" = "iWork Numbers",
  "iWork Pages" = "iWork Pages",
  "KML Collection" = "KML Collection",
  "KML" = "KML",
  "Layer" = "Layer",
  "Layer Package" = "Layer Package",
  "Layout" = "Layout",
  "Locator Package" = "Locator Package",
  "Map Package" = "Map Package",
  "Map Template" = "Map Template",
  "Microsoft Excel" = "Microsoft Excel",
  "Microsoft Powerpoint" = "Microsoft Powerpoint",
  "Visio Document" = "Visio Document",
  "Microsoft Word" = "Microsoft Word",
  "Mobile Basemap Package" = "Mobile Basemap Package",
  "Mobile Map Package" = "Mobile Map Package",
  "Mobile Scene Package" = "Mobile Scene Package",
  "Notebook" = "Notebook",
  "PDF" = "PDF",
  "Pro Map" = "Pro Map",
  "Pro Report" = "Pro Report",
  "Project Package" = "Project Package",
  "Project Template" = "Project Template",
  "Raster function template" = "Raster function template",
  "Rule Package" = "Rule Package",
  "Scene Package" = "Scene Package",
  "Service Definition" = "Service Definition",
  "Shapefile" = "Shapefile",
  "Survey123 Add In" = "Survey123 Add In",
  "Tile Package" = "Tile Package",
  "Vector Tile Package" = "Vector Tile Package",
  "Workflow Manager Package" = "Workflow Manager Package",
  "Document Link" = "Document Link",
  "Feature Service" = "Feature Service",
  "Geocoding Service" = "Geocoding Service",
  "Geodata Service" = "Geodata Service",
  "Geometry Service" = "Geometry Service",
  "Geoprocessing Service" = "Geoprocessing Service",
  "Geoenrichment Service" = "Geoenrichment Service",
  "Globe Service" = "Globe Service",
  "Image Service" = "Image Service",
  "Map Service" = "Map Service",
  "Network Analysis Service" = "Network Analysis Service",
  "Vector Tile Service" = "Vector Tile Service",
  "WFS" = "WFS",
  "WMS" = "WMS",
  "WMTS" = "WMTS",
  "OGCFeatureServer" = "OGCFeatureServer",
  "Scene Service" = "Scene Service",
  "Stream Service" = "Stream Service",
  "Workflow Manager Service" = "Workflow Manager Service",
  "Web Mapping Application" = "Web Mapping Application",
  "Mobile Application" = "Mobile Application",
  "AppBuilder Extension" = "AppBuilder Extension",
  "Google Drive" = "Google Drive",
  "Dropbox" = "Dropbox",
  "OneDrive" = "OneDrive",
  "StoryMap" = "StoryMap",
  "Dashboard" = "Dashboard",
  "Hub Project" = "Hub Project",
  "Hub Initiative" = "Hub Initiative",
  "Hub Site Application" = "Hub Site Application",
  "Web Experience" = "Web Experience",
  "Insights Workbook Package" = "Insights Workbook Package",
  "Application" = "Application",
  "ArcGIS Explorer Application Configuration" = "ArcGIS Explorer Application Configuration",
  "ArcMap Document" = "ArcMap Document",
  "Layer File" = "Layer File",
  "ogcFeature" = "ogcFeature",
  FeatureServer = "Feature Service",
  GeocodeServer = "GeocodeServer",
  GeoDataServer = "GeoDataServer",
  GeometryServer = "GeometryServer",
  GeoenrichmentServer = "GeoenrichmentServer",
  GPServer = "GPServer",
  GlobeServer = "GlobeServer",
  ImageServer = "ImageServer",
  MapServer = "MapServer",
  NAServer = "NAServer",
  ElevationServer = "ElevationServer",
  VectorTileServer = "VectorTileServer",
  "Scene Server" = "Scene Server",
  StreamServer = "StreamServer",
  WMServer = "WMServer",
  TiledImageServer = "TiledImageServer",
}

/**
 * File type to extension interface
 */
export interface IFileType {
  type: ItemType;
  typeKeywords: string[];
  fileExt?: FileExtension[];
}

/**
 * Array of ItemTypes and/or array of extensions. Primarily used for the create new content flow
 */
export interface IAllowedFileTypes {
  types?: ItemType[];
  extensions?: FileExtension[];
}

/**
 * Maps human readable file names to extensions IE Image === jpg, png, etc
 */
export const addCreateItemTypes: Record<string, IFileType> = {
  "360 VR Experience": {
    fileExt: [FileExtension["3dd"]],
    type: ItemType["360 VR Experience"],
    typeKeywords: [],
  },
  "Apache Parquet": {
    fileExt: [FileExtension.parquet],
    type: ItemType["Apache Parquet"],
    typeKeywords: [],
  },
  "AppBuilder Widget Package": {
    fileExt: [FileExtension.zip],
    type: ItemType["AppBuilder Widget Package"],
    typeKeywords: [],
  },
  "Desktop Add In": {
    fileExt: [FileExtension.esriaddin],
    type: ItemType["Desktop Add In"],
    typeKeywords: [
      "Tool",
      "Add In",
      "Desktop Add In",
      "ArcGIS Desktop",
      "ArcMap",
      "ArcGlobe",
      "ArcScene",
      "esriaddin",
    ],
  },
  "Explorer Add In": {
    fileExt: [FileExtension.eaz],
    type: ItemType["Explorer Add In"],
    typeKeywords: [
      "Tool",
      "Add In",
      "Explorer Add In",
      "ArcGIS Explorer",
      "eaz",
    ],
  },
  "Explorer Map": {
    fileExt: [FileExtension.nmf],
    type: ItemType["Explorer Map"],
    typeKeywords: [
      "Map",
      "Explorer Map",
      "Explorer Document",
      "2D",
      "3D",
      "ArcGIS Explorer",
      "nmf",
    ],
  },
  "ArcGIS Explorer Application Configuration": {
    fileExt: [FileExtension.ncfg],
    type: ItemType["Explorer Map"],
    typeKeywords: [
      "Map",
      "Explorer Map",
      "Explorer Mapping Application",
      "2D",
      "3D",
      "ArcGIS Explorer",
    ],
  },
  "Explorer Layer": {
    fileExt: [FileExtension.nmc],
    type: ItemType["Explorer Layer"],
    typeKeywords: ["Data", "Layer", "Explorer Layer", "ArcGIS Explorer", "nmc"],
  },
  "Windows Mobile Package": {
    fileExt: [FileExtension.wmpk],
    type: ItemType["Windows Mobile Package"],
    typeKeywords: [],
  },
  "ArcGIS Pro Add In": {
    fileExt: [FileExtension.esriaddinx],
    type: ItemType["ArcGIS Pro Add In"],
    typeKeywords: ["Tool", "Add In", "Pro Add In", "esriaddinx"],
  },
  "ArcGIS Pro Configuration": {
    fileExt: [FileExtension.proconfigx],
    type: ItemType["ArcGIS Pro Configuration"],
    typeKeywords: [],
  },
  "Globe Document": {
    fileExt: [FileExtension["3dd"]],
    type: ItemType["Globe Document"],
    typeKeywords: [
      "Map",
      "Globe Document",
      "3D",
      "ArcGlobe",
      "ArcGIS Server",
      "3dd",
    ],
  },
  "Map Document": {
    fileExt: [FileExtension.msd],
    type: ItemType["Map Document"],
    typeKeywords: [
      "Map Document",
      "Map",
      "2D",
      "ArcMap",
      "ArcGIS Server",
      "msd",
    ],
  },
  "ArcMap Document": {
    fileExt: [FileExtension.mxd],
    type: ItemType["Map Document"],
    typeKeywords: ["Map Document", "Map", "2D", "ArcMap", "ArcGIS Server"],
  },
  "ArcPad Package": {
    fileExt: [FileExtension.zip],
    type: ItemType["ArcPad Package"],
    typeKeywords: ["Map", "Layer", "Data"],
  },
  "Published Map": {
    fileExt: [FileExtension.pmf],
    type: ItemType["Published Map"],
    typeKeywords: [
      "Map",
      "Published Map",
      "2D",
      "ArcReader",
      "ArcMap",
      "ArcGIS Server",
      "pmf",
    ],
  },
  "Scene Document": {
    fileExt: [FileExtension.sxd],
    type: ItemType["Scene Document"],
    typeKeywords: ["Map", "Scene Document", "3D", "ArcScene", "sxd"],
  },
  "CityEngine Web Scene": {
    fileExt: [FileExtension["3ws"]],
    type: ItemType["CityEngine Web Scene"],
    typeKeywords: ["3D", "Map", "Scene", "Web"],
  },
  "Code Sample": {
    fileExt: [FileExtension.zip],
    type: ItemType["Code Sample"],
    typeKeywords: ["Code", "Sample"],
  },
  "CSV Collection": {
    fileExt: [FileExtension.zip],
    type: ItemType["CSV Collection"],
    typeKeywords: [],
  },
  CSV: {
    fileExt: [FileExtension.csv],
    type: ItemType.CSV,
    typeKeywords: ["CSV"],
  },
  "CAD Drawing": {
    fileExt: [FileExtension.zip],
    type: ItemType["CAD Drawing"],
    typeKeywords: [],
  },
  "Deep Learning Package": {
    fileExt: [FileExtension.zip, FileExtension.dlpk],
    type: ItemType["Deep Learning Package"],
    typeKeywords: ["Deep Learning", "Raster"],
  },
  "Desktop Application": {
    type: ItemType["Desktop Application"],
    typeKeywords: ["Desktop Application"],
  },
  "Desktop Application Template": {
    fileExt: [FileExtension.zip],
    type: ItemType["Desktop Application Template"],
    typeKeywords: ["application", "template", "ArcGIS desktop"],
  },
  "Desktop Style": {
    fileExt: [FileExtension.stylx],
    type: ItemType["Desktop Style"],
    typeKeywords: ["ArcGIS Pro", "Symbology", "Style", "Symbols"],
  },
  "Earth Configuration": {
    fileExt: [FileExtension.xml],
    type: ItemType["Earth Configuration"],
    typeKeywords: ["ArcGIS Earth", "Earth", "Earth Configuration"],
  },
  "Feature Collection": {
    type: ItemType["Feature Collection"],
    fileExt: [FileExtension.featurecollection],
    typeKeywords: [],
  },
  "File Geodatabase": {
    fileExt: [FileExtension.zip],
    type: ItemType["File Geodatabase"],
    typeKeywords: [],
  },
  GeoJson: {
    fileExt: [FileExtension.geojson, FileExtension.json],
    type: ItemType.GeoJson,
    typeKeywords: [
      "Coordinates Type",
      "CRS",
      "Feature",
      "FeatureCollection",
      "GeoJSON",
      "Geometry",
      "GeometryCollection",
    ],
  },
  "Geoprocessing Package": {
    fileExt: [FileExtension.gpk, FileExtension.gpkx],
    type: ItemType["Geoprocessing Package"],
    typeKeywords: [
      "ArcGIS Desktop",
      "ArcGlobe",
      "ArcMap",
      "ArcScene",
      "Geoprocessing Package",
      "gpk",
      "Model",
      "Result",
      "Script",
      "Sharing",
      "Tool",
      "Toolbox",
    ],
  },
  GeoPackage: {
    fileExt: [FileExtension.gpkg],
    type: ItemType.GeoPackage,
    typeKeywords: ["Data", "GeoPackage", "gpkg"],
  },
  "Geoprocessing Sample": {
    fileExt: [FileExtension.zip],
    type: ItemType["Geoprocessing Sample"],
    typeKeywords: ["tool", "geoprocessing", "sample"],
  },
  GML: {
    fileExt: [FileExtension.zip],
    type: ItemType.GML,
    typeKeywords: [],
  },
  "Image Collection": {
    fileExt: [FileExtension.zip],
    type: ItemType["Image Collection"],
    typeKeywords: [],
  },
  Image: {
    fileExt: [
      FileExtension.jpg,
      FileExtension.jpeg,
      FileExtension.png,
      FileExtension.tif,
      FileExtension.tiff,
    ],
    type: ItemType.Image,
    typeKeywords: ["Data", "Image"],
  },
  "iWork Keynote": {
    fileExt: [FileExtension.key],
    type: ItemType["iWork Keynote"],
    typeKeywords: ["Data", "Document", "Mac"],
  },
  "iWork Numbers": {
    fileExt: [FileExtension.numbers],
    type: ItemType["iWork Numbers"],
    typeKeywords: ["Data", "Document", "Mac"],
  },
  "iWork Pages": {
    fileExt: [FileExtension.pages],
    type: ItemType["iWork Pages"],
    typeKeywords: ["Data", "Document", "Mac"],
  },
  "KML Collection": {
    fileExt: [FileExtension.zip],
    type: ItemType["KML Collection"],
    typeKeywords: [],
  },
  KML: {
    type: ItemType.KML,
    fileExt: [FileExtension.kml, FileExtension.kmz],
    typeKeywords: ["Data", "Map", "kml"],
  },
  Layer: {
    fileExt: [FileExtension.lyr],
    type: ItemType.Layer,
    typeKeywords: [
      "Data",
      "Layer",
      "ArcMap",
      "ArcGlobe",
      "ArcGIS Explorer",
      "lyr",
    ],
  },
  "Layer File": {
    fileExt: [FileExtension.lyrx],
    type: ItemType.Layer,
    typeKeywords: ["ArcGIS Pro", "Layer", "Layer File"],
  },
  "Layer Package": {
    fileExt: [FileExtension.lpk, FileExtension.lpkx],
    type: ItemType["Layer Package"],
    typeKeywords: [],
  },
  Layout: {
    fileExt: [FileExtension.pagx],
    type: ItemType.Layout,
    typeKeywords: ["ArcGIS Pro", "Layout", "Layout File", "pagx"],
  },
  "Locator Package": {
    fileExt: [FileExtension.gcpk],
    type: ItemType["Locator Package"],
    typeKeywords: [],
  },
  "Map Package": {
    fileExt: [FileExtension.mpk, FileExtension.mpkx],
    type: ItemType["Map Package"],
    typeKeywords: [],
  },
  "Map Template": {
    fileExt: [FileExtension.zip],
    type: ItemType["Map Template"],
    typeKeywords: ["map", "ArcMap", "template", "ArcGIS desktop"],
  },
  "Microsoft Excel": {
    fileExt: [FileExtension.xls, FileExtension.xlsx],
    type: ItemType["Microsoft Excel"],
    typeKeywords: ["Data", "Document", "Microsoft Excel"],
  },
  "Microsoft Powerpoint": {
    fileExt: [FileExtension.ppt, FileExtension.pptx],
    type: ItemType["Microsoft Powerpoint"],
    typeKeywords: ["Data", "Document", "Microsoft Powerpoint"],
  },
  "Visio Document": {
    fileExt: [FileExtension.vsd],
    type: ItemType["Visio Document"],
    typeKeywords: ["Data", "Document", "Visio Document"],
  },
  "Microsoft Word": {
    fileExt: [FileExtension.doc, FileExtension.docx],
    type: ItemType["Microsoft Word"],
    typeKeywords: ["Data", "Document"],
  },
  "Mobile Basemap Package": {
    fileExt: [FileExtension.bpk],
    type: ItemType["Mobile Basemap Package"],
    typeKeywords: [],
  },
  "Mobile Map Package": {
    fileExt: [FileExtension.mmpk],
    type: ItemType["Mobile Map Package"],
    typeKeywords: [],
  },
  "Mobile Scene Package": {
    fileExt: [FileExtension.mspk],
    type: ItemType["Mobile Scene Package"],
    typeKeywords: [],
  },
  Notebook: {
    fileExt: [FileExtension.ipynb],
    type: ItemType.Notebook,
    typeKeywords: ["Notebook", "Python"],
  },
  PDF: {
    fileExt: [FileExtension.pdf],
    type: ItemType.PDF,
    typeKeywords: ["Data", "Document", "PDF"],
  },
  "Pro Map": {
    fileExt: [FileExtension.mapx],
    type: ItemType["Pro Map"],
    typeKeywords: ["ArcGIS Pro", "Map", "Map File", "mapx"],
  },
  "Pro Report": {
    fileExt: [FileExtension.rptx],
    type: ItemType["Pro Report"],
    typeKeywords: [],
  },
  "Project Package": {
    fileExt: [FileExtension.ppkx],
    type: ItemType["Project Package"],
    typeKeywords: [],
  },
  "Project Template": {
    fileExt: [FileExtension.aptx],
    type: ItemType["Project Template"],
    typeKeywords: [],
  },
  "Raster function template": {
    fileExt: [FileExtension["rft.json"], FileExtension["rft.xml"]],
    type: ItemType["Raster function template"],
    typeKeywords: [
      "Raster",
      "Functions",
      "Processing",
      "rft",
      "srf",
      "function template",
      "templates",
      "ArcGIS Pro",
    ],
  },
  "Rule Package": {
    fileExt: [FileExtension.rpk],
    type: ItemType["Rule Package"],
    typeKeywords: [],
  },
  "Scene Package": {
    fileExt: [FileExtension.slpk, FileExtension.spk],
    type: ItemType["Scene Package"],
    typeKeywords: [],
  },
  "Service Definition": {
    fileExt: [FileExtension.sd],
    type: ItemType["Service Definition"],
    typeKeywords: ["Data", "Service", "Service Definition"],
  },
  Shapefile: {
    fileExt: [FileExtension.zip],
    type: ItemType.Shapefile,
    typeKeywords: ["Data", "Layer", "shapefile"],
  },
  "Survey123 Add In": {
    fileExt: [FileExtension.surveyaddin],
    type: ItemType["Survey123 Add In"],
    typeKeywords: ["Add In", "Survey123 Add In", "Tool"],
  },
  "Tile Package": {
    fileExt: [FileExtension.tpk, FileExtension.tpkx],
    type: ItemType["Tile Package"],
    typeKeywords: [],
  },
  "Vector Tile Package": {
    fileExt: [FileExtension.vtpk],
    type: ItemType["Vector Tile Package"],
    typeKeywords: [],
  },
  "Workflow Manager Package": {
    fileExt: [FileExtension.wpk],
    type: ItemType["Workflow Manager Package"],
    typeKeywords: [],
  },
  "Document Link": {
    type: ItemType["Document Link"],
    typeKeywords: ["Data", "Document"],
  },
  "Feature Service": {
    type: ItemType["Feature Service"],
    typeKeywords: [
      "ArcGIS Server",
      "Data",
      "Feature Access",
      "Feature Service",
      "Service",
      "Singlelayer",
      "Hosted Service",
    ],
  },
  GeocodeServer: {
    type: ItemType["Geocoding Service"],
    typeKeywords: [
      "ArcGIS Server",
      "Geocoding Service",
      "Locator Service",
      "Service",
      "Tool",
      "Service Proxy",
    ],
  },
  GeoDataServer: {
    type: ItemType["Geodata Service"],
    typeKeywords: ["Data", "Service", "Geodata Service", "ArcGIS Server"],
  },
  GeometryServer: {
    type: ItemType["Geometry Service"],
    typeKeywords: ["Tool", "Service", "Geometry Service", "ArcGIS Server"],
  },
  GeoenrichmentServer: {
    type: ItemType["Geoenrichment Service"],
    typeKeywords: ["Geoenrichment Service", "ArcGIS Server"],
  },
  GPServer: {
    type: ItemType["Geoprocessing Service"],
    typeKeywords: ["Tool", "Service", "Geoprocessing Service", "ArcGIS Server"],
  },
  GlobeServer: {
    type: ItemType["Globe Service"],
    typeKeywords: ["Data", "Service", "Globe Service", "ArcGIS Server"],
  },
  ImageServer: {
    type: ItemType["Image Service"],
    typeKeywords: ["Data", "Service", "Image Service", "ArcGIS Server"],
  },
  MapServer: {
    type: ItemType["Map Service"],
    typeKeywords: ["Data", "Service", "Map Service", "ArcGIS Server"],
  },
  NAServer: {
    type: ItemType["Network Analysis Service"],
    typeKeywords: [
      "Tool",
      "Service",
      "Network Analysis Service",
      "ArcGIS Server",
    ],
  },
  ElevationServer: {
    type: ItemType["Image Service"],
    typeKeywords: ["Elevation 3D Layer"],
  },
  VectorTileServer: {
    type: ItemType["Vector Tile Service"],
    typeKeywords: [],
  },
  WFS: {
    type: ItemType.WFS,
    typeKeywords: ["Data", "Service", "Web Feature Service", "OGC"],
  },
  WMS: {
    type: ItemType.WMS,
    typeKeywords: ["Data", "Service", "Web Map Service", "OGC"],
  },
  WMTS: {
    type: ItemType.WMTS,
    typeKeywords: ["Data", "Service", "OGC"],
  },
  ogcFeature: {
    type: ItemType.OGCFeatureServer,
    typeKeywords: [
      "Data",
      "Service",
      "Feature Service",
      "OGC",
      "OGC Feature Service",
    ],
  },
  SceneServer: {
    type: ItemType["Scene Service"],
    typeKeywords: ["Scene Service"],
  },
  StreamServer: {
    type: ItemType["Stream Service"],
    typeKeywords: ["Data", "Service", "Stream Service", "ArcGIS Server"],
  },
  WMServer: {
    type: ItemType["Workflow Manager Service"],
    typeKeywords: [
      "Workflow Manager",
      "ArcGIS Server",
      "WMServer",
      "Workflow",
      "JTX",
      "Job Tracking",
    ],
  },
  TiledImageServer: {
    type: ItemType["Image Service"],
    typeKeywords: ["Tiled Imagery"],
  },
  "Web Mapping Application": {
    type: ItemType["Web Mapping Application"],
    typeKeywords: [
      "JavaScript",
      "Map",
      "Mapping Site",
      "Online Map",
      "Ready To Use",
      "Web AppBuilder",
      "Web Map (+ WAB2D or WAB3D)",
    ],
  },
  "Mobile Application": {
    type: ItemType["Mobile Application"],
    typeKeywords: ["ArcGIS Mobile Map", "Mobile Application"],
  },
  "AppBuilder Extension": {
    type: ItemType["AppBuilder Extension"],
    typeKeywords: ["Widget", "App Builder"],
  },
  "Google Drive": {
    type: ItemType["Google Drive"],
    typeKeywords: ["CSV", "Shapefile", "GeoJSON", "Excel", "FileGeodatabase"],
  },
  Dropbox: {
    type: ItemType.Dropbox,
    typeKeywords: ["CSV", "Shapefile", "GeoJSON", "Excel", "FileGeodatabase"],
  },
  OneDrive: {
    type: ItemType.OneDrive,
    typeKeywords: ["CSV", "Shapefile", "GeoJSON", "Excel", "FileGeodatabase"],
  },
  "Map Service": {
    type: ItemType["Map Service"],
    typeKeywords: [
      "ArcGIS Server",
      "Data",
      "Map Service",
      "Service",
      "Hosted Service",
    ],
  },
  StoryMap: {
    type: ItemType.StoryMap,
    typeKeywords: [
      "arcgis-storymaps",
      "StoryMap",
      "Web Application (smstatusdraft or smsstatuspublished)",
    ],
  },
  Dashboard: {
    type: ItemType.Dashboard,
    typeKeywords: ["Dashboard", "Operations Dashboard"],
  },
  "Hub Initiative": {
    type: ItemType["Hub Initiative"],
    typeKeywords: ["Hub", "hubInitiative", "OpenData"],
  },
  "Hub Site Application": {
    type: ItemType["Hub Site Application"],
    typeKeywords: [
      "Hub",
      "hubSite",
      "hubSolution",
      "JavaScript",
      "Map",
      "Mapping Site",
      "Online Map",
      "OpenData",
      "Ready To Use",
      "selfConfigured",
      "Web Map",
      "Registered App",
    ],
  },
  "Web Experience": {
    type: ItemType["Web Experience"],
    typeKeywords: [
      "EXB Experience",
      "JavaScript",
      "Ready To Use Web Application",
      "Web Experience",
      "Web Mapping Application",
      "Web Page",
      "Web Site",
    ],
  },
  "Insights Workbook Package": {
    type: ItemType["Insights Workbook Package"],
    fileExt: [FileExtension.insightswbk],
    typeKeywords: ["Insights", "Insights Workbook Package"],
  },
};

/**
 * ENUM which defines entity statuses
 */
export enum HubEntityStatus {
  notStarted = "notStarted",
  inProgress = "inProgress",
  onHold = "onHold",
  complete = "complete",
}

/**
 * Types of entity heroes
 */
export enum HubEntityHero {
  map = "map",
  image = "image",
}
/**
 * END CONTENT UPLOAD TYPES/ENUMS
 */
