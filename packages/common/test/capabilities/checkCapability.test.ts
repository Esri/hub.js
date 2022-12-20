import { Capability, checkCapability, IHubProject } from "../../src/index";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import * as checkCapAccessModule from "../../src/capabilities/_internal";

describe("checkCapability:", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });
  });
  it("denies access if capability is invalid", () => {
    const chk = checkCapability(
      "fakedetails" as Capability,
      authdCtxMgr.context,
      {} as IHubProject
    );
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("invalid-capability");
  });
  it("denies access if capability not defined for entity", () => {
    const chk = checkCapability("details", authdCtxMgr.context, {
      type: "Hub Project",
      capabilities: {},
    } as IHubProject);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-available");
  });
  it("denies access if capability rule not defined for type", () => {
    const chk = checkCapability("details", authdCtxMgr.context, {
      type: "Other Type",
      capabilities: {},
    } as IHubProject);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-available");
  });
  it("denites access if capabilityAccess is denied", () => {
    const spy = spyOn(
      checkCapAccessModule,
      "checkCapabilityAccess"
    ).and.returnValue({ access: false, response: "not-group-admin" });
    const chk = checkCapability("details", authdCtxMgr.context, {
      type: "Hub Project",
      capabilities: {
        details: true,
      },
    } as IHubProject);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-group-admin");
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("grants access if capability is defined for entity", () => {
    const spy = spyOn(
      checkCapAccessModule,
      "checkCapabilityAccess"
    ).and.returnValue({ access: true, response: "granted" });
    const chk = checkCapability("details", authdCtxMgr.context, {
      type: "Hub Project",
      capabilities: {
        details: true,
      },
    } as IHubProject);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
