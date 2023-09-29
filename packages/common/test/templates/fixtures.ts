import { IItem, IUser } from "@esri/arcgis-rest-types";
import { IHubCatalog, IHubSearchResult } from "../../src/search/types";
import { IModel } from "../../src/types";
import { IHubTemplate } from "../../src/core/types/IHubTemplate";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { mergeObjects } from "../../src/objects";

export const GUID = "8b77674e43cf4bbd9ecad5189b3f1fdc";

export const TEMPLATE_ENTITY: IHubTemplate = {
  access: "public",
  canEdit: true,
  canDelete: true,
  categories: ["Basemap imagery", "Creative maps"],
  catalog: {} as IHubCatalog,
  createdDate: new Date(1652819949000),
  createdDateSource: "item.created",
  description: "This is a mock description",
  extent: [
    [-87.76875870296065, 41.82501713512609],
    [-87.74262594052858, 41.83922261453605],
  ],
  id: GUID,
  itemControl: "admin",
  name: "Mock Template",
  orgUrlKey: "qa-pre-a-hub",
  owner: "dev_pre_hub_admin",
  previewUrl: "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com",
  schemaVersion: 1,
  slug: "qa-pre-a-hub|mock-template",
  summary: "this is a template snippet",
  tags: ["tag1", "tag2"],
  thumbnail: "thumbnail/mock-thumbnail.png",
  thumbnailUrl: "https://thumbnail/mock-thumbnail.png",
  type: "Solution",
  typeKeywords: [
    "hubSolutionTemplate",
    "hubSolutionType|hubSiteApplication",
    "Solution",
    "Template",
    "slug|qa-pre-a-hub|mock-template",
  ],
  updatedDate: new Date(1652819949000),
  updatedDateSource: "item.modified",
};

export const TEMPLATE_ITEM: IItem = {
  id: GUID,
  access: "public",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  modified: 1652819949000,
  description: "This is a mock description",
  snippet: "this is a template snippet",
  isOrgItem: true,
  title: "Mock Template",
  type: "Solution",
  typeKeywords: [
    "hubSolutionTemplate",
    "hubSolutionType|hubSiteApplication",
    "Solution",
    "Template",
    "slug|qa-pre-a-hub|mock-template",
  ],
  tags: ["tag1", "tag2"],
  categories: ["Basemap imagery", "Creative maps"],
  thumbnail: "thumbnail/mock-thumbnail.png",
  extent: [],
  licenseInfo: "CC-BY-SA",
  culture: "en-us",
  contentOrigin: "self",
  numViews: 10,
  size: 0,
  properties: {
    slug: "qa-pre-a-hub|mock-template",
    schemaVersion: 1,
    previewUrl: "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com",
  },
};

export const TEMPLATE_HUB_SEARCH_RESULT: IHubSearchResult = {
  access: "public",
  id: GUID,
  type: "Solution",
  name: "Mock Template",
  owner: "dev_pre_hub_admin",
  typeKeywords: [
    "hubSolutionTemplate",
    "hubSolutionType|hubSiteApplication",
    "Solution",
    "Template",
    "slug|qa-pre-a-hub|mock-template",
  ],
  tags: ["tag1", "tag2"],
  categories: ["Basemap imagery", "Creative maps"],
  summary: "this is a template snippet",
  createdDate: new Date(1652819949000),
  createdDateSource: "item.created",
  updatedDate: new Date(1652819949000),
  updatedDateSource: "item.modified",
  family: "template",
  index: 2,
  links: {
    self: "https://mock-home-url.com",
    siteRelative: "/mock-hub-relative-url",
    thumbnail: "https://thumbnail/mock-thumbnail.png",
    workspaceRelative: "/mock-relative-workspace-url",
  },
};

export const TEMPLATE_DATA = {};

export const TEMPLATE_MODEL = {
  item: TEMPLATE_ITEM,
  data: TEMPLATE_DATA,
} as IModel;

export const initContextManager = async (opts = {}) => {
  const defaults = {
    authentication: MOCK_AUTH,
    currentUser: {
      username: "casey",
      privileges: [],
    } as unknown as IUser,
    portal: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      urlKey: "fake-org",
    } as unknown as IPortal,
    portalUrl: "https://myserver.com",
  };
  return await ArcGISContextManager.create(
    mergeObjects(opts, defaults, ["currentUser"])
  );
};
