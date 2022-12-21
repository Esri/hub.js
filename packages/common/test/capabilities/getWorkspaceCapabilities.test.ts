import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  getWorkspaceCapabilities,
  ICapabilityAccessResponse,
  ICapabilityPermission,
  IHubProject,
} from "../../src/index";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as checkCapAccessModule from "../../src/capabilities/_internal/checkCapabilityAccess";

describe("getWorkspaceCapabilities:", () => {
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
  it("returns granted list and details", () => {
    const spy = spyOn(
      checkCapAccessModule,
      "checkCapabilityAccess"
    ).and.callFake((rule: ICapabilityPermission) => {
      const response: ICapabilityAccessResponse = {
        access: true,
        response: "granted",
        capability: rule.capability,
        code: "PR100",
        responses: [],
      };
      switch (rule.capability) {
        case "details":
          response.access = false;
          response.response = "not-available";
          break;
      }
      return response;
    });
    const entity: IHubProject = {
      id: "00c",
      type: "Hub Project",
      capabilities: {
        details: false, // these are irrelevant for this test
        settings: true,
      },
    } as IHubProject;
    const chk = getWorkspaceCapabilities(entity, authdCtxMgr.context);
    // These are relative checks because the capabilities
    // per type are likely to expand over time
    expect(chk.granted.length).toBeLessThan(chk.details.length);
    expect(chk.details.length).toBeGreaterThanOrEqual(3);
    expect(spy).toHaveBeenCalledTimes(chk.details.length);
  });
});
