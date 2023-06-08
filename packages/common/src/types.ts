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
  | "project";

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
 * Array valid item types
 * DO **NOT** UPDATE THIS ARRAY W/O RESOLVING https://devtopia.esri.com/dc/hub/issues/6990
 */
export const ItemTypes = [
  "API Key",
  "Layer Template",
  "360 VR Experience",
  "Apache Parquet",
  "AppBuilder Widget Package",
  "Desktop Add In",
  "Explorer Add In",
  "Explorer Map",
  "Explorer Map",
  "Explorer Layer",
  "Windows Mobile Package",
  "ArcGIS Pro Add In",
  "ArcGIS Pro Configuration",
  "Globe Document",
  "Map Document",
  "Map Document",
  "ArcPad Package",
  "Published Map",
  "Scene Document",
  "CityEngine Web Scene",
  "Code Sample",
  "CSV Collection",
  "CSV",
  "CAD Drawing",
  "Deep Learning Package",
  "Desktop Application",
  "Desktop Application Template",
  "Desktop Style",
  "Earth Configuration",
  "Esri Classifier Definition",
  "Feature Collection",
  "File Geodatabase",
  "Form",
  "GeoJson",
  "Geoprocessing Package",
  "GeoPackage",
  "Geoprocessing Sample",
  "GML",
  "Image Collection",
  "Image",
  "iWork Keynote",
  "iWork Numbers",
  "iWork Pages",
  "KML Collection",
  "KML",
  "Knowledge Graph",
  "Layer",
  "Layer Package",
  "Layout",
  "Locator Package",
  "Map Package",
  "Map Template",
  "Microsoft Excel",
  "Microsoft Powerpoint",
  "Visio Document",
  "Microsoft Word",
  "Mobile Basemap Package",
  "Mobile Map Package",
  "Mobile Scene Package",
  "Notebook",
  "PDF",
  "Pro Map",
  "Pro Project",
  "Pro Report",
  "Project Package",
  "Project Template",
  "Raster function template",
  "Rule Package",
  "Scene Package",
  "Service Definition",
  "Shapefile",
  "Survey123 Add In",
  "Tile Package",
  "Vector Tile Package",
  "Tile Layer",
  "Workflow Manager Package",
  "Document Link",
  "Feature Service",
  "Geocoding Service",
  "Geodata Service",
  "Geometry Service",
  "Geoprocessing Service",
  "Geoenrichment Service",
  "GeoRSS",
  "Globe Service",
  "Image Service",
  "Map Service",
  "Network Analysis Service",
  "Image Service",
  "Vector Tile Service",
  "Video Service",
  "WFS",
  "WMS",
  "WMTS",
  "OGCFeatureServer",
  "Scene Service",
  "Stream Service",
  "Workflow Manager Service",
  "Image Service",
  "Web Mapping Application",
  "Web Map",
  "Web Scene",
  "Web Experience Template",
  "Mobile Application",
  "AppBuilder Extension",
  "Google Drive",
  "Dropbox",
  "OneDrive",
  "Map Service",
  "StoryMap",
  "Dashboard",
  "Hub Initiative",
  "Hub Site Application",
  "Web Experience",
  "Insights Workbook Package",
  "Application",
  "ArcGIS Explorer Application Configuration",
  "ArcMap Document",
  "Layer File",
  "Solution",
  "Spatial Database Engine",
  "Compact Tile Package",
  "netCDF",
  "datastore catalog service",
  "Pro Report Template",
  "Real Time Analytic",
  "Big Data Analytic",
  "Data Store",
  "Big Data File Share",
  "Hub Page",
  "Hub Project",
  "Code Attachment",
  "Solution",
  "Hub Initiative Template",
  "Quickcapture Project",
]

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
