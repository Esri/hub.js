import { IPortal } from "@esri/arcgis-rest-portal";
import { IItem, IUser } from "@esri/arcgis-rest-types";
import {
  ArcGISContext,
  IHubCatalog,
  IHubInitiativeTemplate,
  IHubSearchResult,
  IModel,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";

export const GUID = "";

export const INITIATIVE_TEMPLATE_ENTITY: IHubInitiativeTemplate = {
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
  name: "Mock Initiative Template",
  orgUrlKey: "qa-pre-a-hub",
  owner: "dev_pre_hub_admin",
  previewUrl: "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com",
  recommendedTemplates: ["c456"],
  schemaVersion: 1,
  siteSolutionId: "c123",
  slug: "qa-pre-a-hub|mock-initiative-template",
  summary: "this is an initiative template snippet",
  tags: ["tag1", "tag2"],
  thumbnail: "thumbnail/mock-thumbnail.png",
  thumbnailUrl: "https://thumbnail/mock-thumbnail.png",
  type: "Hub Initiative Template",
  typeKeywords: [
    "Hub",
    "Hub Initiative Template",
    "slug|qa-pre-a-hub|mock-initiative-template",
  ],
  updatedDate: new Date(1652819949000),
  updatedDateSource: "item.modified",
};

export const INITIATIVE_TEMPLATE_ITEM: IItem = {
  id: GUID,
  access: "public",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  modified: 1652819949000,
  description: "This is a mock description",
  snippet: "this is an initiative template snippet",
  isOrgItem: true,
  title: "Mock Initiative Template",
  type: "Hub Initiative Template",
  typeKeywords: [
    "Hub",
    "Hub Initiative Template",
    "slug|qa-pre-a-hub|mock-initiative-template",
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
    schemaVersion: 1,
    previewUrl: "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com",
  },
};

export const INITIATIVE_TEMPLATE_HUB_SEARCH_RESULT: IHubSearchResult = {
  access: "public",
  id: GUID,
  type: "Hub Initiative Template",
  name: "Mock Initiative Template",
  owner: "dev_pre_hub_admin",
  typeKeywords: [
    "Hub",
    "Hub Initiative Template",
    "slug|qa-pre-a-hub|mock-initiative-template",
  ],
  tags: ["tag1", "tag2"],
  categories: ["Basemap imagery", "Creative maps"],
  summary: "this is an initiative template snippet",
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

export const INITIATIVE_TEMPLATE_DATA = {
  recommendedTemplates: ["c456"],
  siteSolutionId: "c123",
};

export const INITIATIVE_TEMPLATE_MODEL = {
  item: INITIATIVE_TEMPLATE_ITEM,
  data: INITIATIVE_TEMPLATE_DATA,
} as IModel;

const USER: IUser = {
  username: "mock_user",
  fullName: "Mock User",
  firstName: "Mock",
  lastName: "User",
  preferredView: null,
  description: "You may also know me as Mock User.",
  email: "mock_user@esri.com",
  orgId: "org_id_1",
  role: "org_admin",
  privileges: [],
  roleId: "role_id_1",
  access: "public",
  created: 1558412566000,
  modified: 1616690771000,
  provider: "arcgis",
};

export const CONTEXT: ArcGISContext = new ArcGISContext({
  id: 123,
  currentUser: USER,
  portalUrl: "https://qaext.arcgis.com/sharing/rest",
  authentication: MOCK_AUTH,
  portalSelf: {
    id: "123",
    name: "My org",
    isPortal: false,
    urlKey: "www",
  } as IPortal,
});
