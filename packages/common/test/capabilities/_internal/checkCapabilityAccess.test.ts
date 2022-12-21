import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { checkCapabilityAccess } from "../../../src/capabilities/_internal/checkCapabilityAccess";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { ICapabilityPermission, IHubProject } from "../../../src";
import * as coreModule from "../../../src/index";
describe("checkCapabilityAccess:", () => {
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
  it("denies access if capability is undefined or false", () => {
    const rule: ICapabilityPermission = {
      entity: "project",
      capability: "details",
      permissions: ["hub:project:edit"],
    };
    const entity = {
      id: "123",
      capabilities: {},
    } as IHubProject;

    const chk = checkCapabilityAccess(rule, authdCtxMgr.context, entity);
    expect(chk.access).toBe(false);
    expect(chk.code).toBe("disabled");
    entity.capabilities = { details: false };
    const chk2 = checkCapabilityAccess(rule, authdCtxMgr.context, entity);
    expect(chk2.access).toBe(false);
    expect(chk2.code).toBe("disabled");
  });
  it("denies access if a permission check fails", () => {
    const checkPermissionSpy = spyOn(
      coreModule,
      "checkPermission"
    ).and.returnValue({ access: false, code: "not-licensed" });
    const rule: ICapabilityPermission = {
      entity: "project",
      capability: "details",
      permissions: ["hub:project:edit"],
    };
    const entity = {
      id: "123",
      capabilities: {
        details: true,
      },
    } as IHubProject;
    const chk = checkCapabilityAccess(rule, authdCtxMgr.context, entity);
    expect(chk.access).toBe(false);
    expect(chk.code).toBe("not-licensed");
    expect(checkPermissionSpy).toHaveBeenCalledTimes(1);
  });
  it("grants access if all permissions are met", () => {
    const checkPermissionSpy = spyOn(
      coreModule,
      "checkPermission"
    ).and.returnValue({ access: true, response: "granted" });
    const rule: ICapabilityPermission = {
      entity: "project",
      capability: "details",
      permissions: ["hub:project:edit", "hub:project:delete"],
    };
    const entity = {
      id: "123",
      capabilities: {
        details: true,
      },
    } as IHubProject;
    const chk = checkCapabilityAccess(rule, authdCtxMgr.context, entity);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(checkPermissionSpy).toHaveBeenCalledTimes(2);
  });
});
