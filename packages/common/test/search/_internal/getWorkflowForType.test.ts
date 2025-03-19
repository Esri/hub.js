import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src";
import { MOCK_AUTH_QA, MOCK_ENTERPRISE_AUTH } from "../../mocks/mock-auth";
import { getDefaultCreateableTypes } from "../../../src/search/_internal/getWorkflowForType";

const MOCK_HUB_BASIC_PORTAL = {
  name: "DC R&D Center",
  id: "BRXFAKE",
  urlKey: "fake-org",
  portalProperties: {
    hub: {
      enabled: false,
    },
  },
} as unknown as IPortal;

describe("getDefaultCreateableTypes:", () => {
  let premiumUserCtxMgr: ArcGISContextManager;
  let enterpriseUserCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    premiumUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH_QA,
      currentUser: {
        username: "casey",
        orgId: "BRXFAKE",
        privileges: ["portal:user:createItem", "portal:user:shareToGroup"],
        groups: [],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        portalProperties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.mapsqa.arcgis.com",
      properties: {
        alphaOrgs: ["BRXFAKE"],
      },
    });

    enterpriseUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_ENTERPRISE_AUTH,
      currentUser: {
        username: "darth",
        orgId: "BRXFAKE",
        privileges: [],
        groups: [],
      } as unknown as IUser,
      portal: MOCK_HUB_BASIC_PORTAL,
      portalUrl: "https://my.enterprise.com",
    });
  });

  it("returns all types for premium users", () => {
    const chk = getDefaultCreateableTypes(premiumUserCtxMgr.context);
    expect(chk.length).toBe(7);
    [
      "Discussion",
      "Event",
      "Hub Project",
      "Hub Initiative",
      "Group",
      "Hub Page",
      "Hub Site Application",
    ].forEach((type) => {
      expect(chk).toContain(type);
    });
  });

  it("returns enterprise types", () => {
    const chk = getDefaultCreateableTypes(enterpriseUserCtxMgr.context);
    expect(chk.length).toBe(7);
    ["Site Application", "Site Page"].forEach((type) => {
      expect(chk).toContain(type);
    });
  });
  it("can limit to items", () => {
    const chk = getDefaultCreateableTypes(premiumUserCtxMgr.context, ["item"]);
    expect(chk.length).toBe(5);
    [
      "Discussion",
      "Hub Project",
      "Hub Initiative",
      "Hub Page",
      "Hub Site Application",
    ].forEach((type) => {
      expect(chk).toContain(type);
    });
  });
  it("can limit to event", () => {
    const chk = getDefaultCreateableTypes(premiumUserCtxMgr.context, ["event"]);
    expect(chk.length).toBe(1);
    ["Event"].forEach((type) => {
      expect(chk).toContain(type);
    });
  });
  it("can limit to group", () => {
    const chk = getDefaultCreateableTypes(premiumUserCtxMgr.context, ["group"]);
    expect(chk.length).toBe(1);
    ["Group"].forEach((type) => {
      expect(chk).toContain(type);
    });
  });
  it("can limit to multiple types", () => {
    const chk = getDefaultCreateableTypes(premiumUserCtxMgr.context, [
      "item",
      "event",
    ]);
    expect(chk.length).toBe(6);
    [
      "Discussion",
      "Event",
      "Hub Project",
      "Hub Initiative",
      "Hub Page",
      "Hub Site Application",
    ].forEach((type) => {
      expect(chk).toContain(type);
    });
  });
});
