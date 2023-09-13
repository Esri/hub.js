import { IItem } from "@esri/arcgis-rest-portal";
import { IFeatureServiceDefinition } from "@esri/arcgis-rest-types";

export const HOSTED_FEATURE_SERVICE_GUID = "9001";
export const HOSTED_FEATURE_SERVICE_URL =
  "https://services.arcgis.com/:orgId/arcgis/rest/services/:serviceName/FeatureServer";
export const HOSTED_FEATURE_SERVICE_ITEM: IItem = {
  id: HOSTED_FEATURE_SERVICE_GUID,
  access: "public",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  modified: 1652819949000,
  description: "This is a mock description",
  snippet: "this is a content snippet",
  isOrgItem: true,
  title: "Mock Content",
  type: "Feature Service",
  typeKeywords: ["Hosted Service"],
  tags: [],
  categories: ["Basemap imagery", "Creative maps"],
  thumbnail: "thumbnail/mock-thumbnail.png",
  extent: [],
  licenseInfo: "CC-BY-SA",
  culture: "en-us",
  contentOrigin: "self",
  numViews: 10,
  properties: {},
  size: 0,
  url: HOSTED_FEATURE_SERVICE_URL,
};
export const HOSTED_FEATURE_SERVICE_DEFINITION = {
  capabilities: "Extract,Query",
} as IFeatureServiceDefinition;

export const NON_HOSTED_FEATURE_SERVICE_GUID = "9002";
export const NON_HOSTED_FEATURE_SERVICE_ITEM: IItem = {
  ...HOSTED_FEATURE_SERVICE_ITEM,
  id: NON_HOSTED_FEATURE_SERVICE_GUID,
  typeKeywords: [],
};

export const PDF_GUID = "9003";
export const PDF_ITEM: IItem = {
  id: PDF_GUID,
  access: "public",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  modified: 1652819949000,
  description: "This is a mock description",
  snippet: "this is a content snippet",
  isOrgItem: true,
  title: "Mock Content",
  type: "PDF",
  typeKeywords: [],
  tags: [],
  categories: [],
  thumbnail: "thumbnail/mock-thumbnail.png",
  extent: [],
  licenseInfo: "CC-BY-SA",
  culture: "en-us",
  contentOrigin: "self",
  numViews: 10,
  properties: {},
  size: 1001,
};
