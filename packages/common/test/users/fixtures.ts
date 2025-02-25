import { IUser } from "@esri/arcgis-rest-types";
import { ArcGISContext, IHubSearchResult } from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";

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

export const USER_HUB_SEARCH_RESULT: IHubSearchResult = {
  access: "org",
  id: "dbouwman_dc",
  type: "User",
  name: "Dave Bouwman",
  owner: "dbouwman_dc",
  summary: "Just a dude slinging javascript",
  createdDate: new Date(1652819949000),
  createdDateSource: "item.created",
  updatedDate: new Date(1652819949000),
  updatedDateSource: "item.modified",
  family: "people",
  links: {
    self: "https://mock-home-url.com",
    siteRelative: "/mock-hub-relative-url",
    thumbnail: "https://thumbnail/mock-thumbnail.png",
  },
  orgName: "Washington, DC R&D Center (QA)",
  index: 2,
  typeKeywords: ["User"],
  tags: ["tag1", "tag2"],
  rawResult: USER,
};
