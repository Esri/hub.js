import { IItem, IUser } from "@esri/arcgis-rest-types";
import {
  ArcGISContext,
  HubEntityStatus,
  IHubCatalog,
  IHubInitiative,
  IHubLocation,
  IHubSearchResult,
  IModel,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";

export const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";

export const INITIATIVE_LOCATION: IHubLocation = {
  type: "custom",
  extent: [
    [-77.32808191324128, 38.74173655216708],
    [-76.8191059305754, 39.08220981728297],
  ],
  spatialReference: {
    wkid: 4326,
  },
  geometries: [
    {
      type: "polygon",
      spatialReference: {
        wkid: 4326,
      },
      rings: [
        [
          [-77.32808191324128, 38.74173655216708],
          [-76.8191059305754, 39.08220981728297],
        ],
      ],
    } as unknown as __esri.Geometry,
  ],
};

export const INITIATIVE_ENTITY: IHubInitiative = {
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
  name: "Mock Initiative",
  orgUrlKey: "qa-pre-a-hub",
  owner: "dev_pre_hub_admin",
  schemaVersion: 1,
  slug: "qa-pre-a-hub|mock-initiative",
  status: HubEntityStatus.notStarted,
  summary: "this is a initiative snippet",
  tags: ["tag1", "tag2"],
  thumbnail: "thumbnail/mock-thumbnail.png",
  thumbnailUrl: "https://thumbnail/mock-thumbnail.png",
  type: "Hub Initiative",
  typeKeywords: ["Hub", "Hub Initiative", "slug|qa-pre-a-hub|mock-initiative"],
  updatedDate: new Date(1652819949000),
  updatedDateSource: "item.modified",
  location: INITIATIVE_LOCATION,
  view: {
    featuredImageUrl:
      "https://qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest/content/items/320d5995b77c4e2eae27c85faa75e1e2/resources/featuredImage.png",
    featuredContentIds: [
      "0003b14f3f1b41c8898181a64558503c",
      "2da121b858704d0e8cf1e1668d6c96ba",
      "246b43396c6749038fbe96eade69e253",
    ],
    timeline: {
      schemaVersion: 1,
      title: "",
      description: "",
      canCollapse: false,
      stages: [
        {
          key: "stage1683657342609",
          title: "This is step 1!",
          timeframe: "tomorrow",
          stageDescription: "this is step 1 description",
          status: "complete",
        },
        {
          key: "stage1683661509458",
          title: "This is step 2",
          timeframe: "next month",
          stageDescription: "this is step 2 description",
          status: "inProgress",
        },
      ],
    },
  },
};

export const INITIATIVE_ITEM: IItem = {
  id: GUID,
  access: "public",
  owner: "dev_pre_hub_admin",
  created: 1652819949000,
  modified: 1652819949000,
  description: "This is a mock description",
  snippet: "this is a initiative snippet",
  isOrgItem: true,
  title: "Mock Initiative",
  type: "Hub Initiative",
  typeKeywords: ["Hub", "Hub Initiative", "slug|qa-pre-a-hub|mock-initiative"],
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
    location: INITIATIVE_LOCATION,
  },
};

export const INITIATIVE_HUB_SEARCH_RESULT: IHubSearchResult = {
  access: "public",
  id: GUID,
  type: "Hub Initiative",
  name: "Mock Initiative",
  owner: "dev_pre_hub_admin",
  typeKeywords: ["Hub", "Hub Initiative", "slug|qa-pre-a-hub|mock-initiative"],
  tags: ["tag1", "tag2"],
  categories: ["Basemap imagery", "Creative maps"],
  summary: "this is a initiative snippet",
  createdDate: new Date(1652819949000),
  createdDateSource: "item.created",
  updatedDate: new Date(1652819949000),
  updatedDateSource: "item.modified",
  family: "initiative",
  index: 2,
  links: {
    self: "https://mock-home-url.com",
    siteRelative: "/mock-hub-relative-url",
    thumbnail: "https://thumbnail/mock-thumbnail.png",
    workspaceRelative: "/mock-relative-workspace-url",
  },
};

export const INITIATIVE_DATA = {
  timeline: {},
};

export const INITIATIVE_MODEL = {
  item: INITIATIVE_ITEM,
  data: INITIATIVE_DATA,
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
