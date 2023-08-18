import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { checkPermission, IHubItemEntity, Permission } from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("checkPermission:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  let consoleInfoSpy: jasmine.Spy;
  let consoleDirSpy: jasmine.Spy;
  beforeEach(async () => {
    consoleInfoSpy = spyOn(console, "info").and.callThrough();
    consoleDirSpy = spyOn(console, "dir").and.callThrough();
    unauthdCtxMgr = await ArcGISContextManager.create();
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
            enabled: false,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });
  });
  it("returns invalid permission if its invalid", () => {
    const chk = checkPermission(
      "foo:site:create" as Permission,
      authdCtxMgr.context
    );
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("invalid-permission");
    expect(chk.checks.length).toBe(0);
    expect(consoleDirSpy).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalled();
  });
  it("runs system level permission checks that all pass", () => {
    const chk = checkPermission("hub:site:create", authdCtxMgr.context);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(chk.checks.length).toBe(4);
    // verify that the service check is run
    expect(chk.checks[0].name).toBe("service portal online");
  });
  it("runs system level permission checks fail", () => {
    const chk = checkPermission("hub:project:create", authdCtxMgr.context);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-licensed");
    expect(chk.checks.length).toBe(4);
  });
  it("runs entity level permission checks passing", () => {
    const entity = {
      canEdit: true,
      permissions: [
        {
          permission: "hub:site:edit",
          collaborationType: "user",
          collaborationId: "casey",
        },
      ],
    } as unknown as IHubItemEntity;
    const chk = checkPermission("hub:site:edit", authdCtxMgr.context, entity);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(chk.checks.length).toBe(5);
  });
  it("runs entity level checks on entity without permissions", () => {
    const entity = {
      canEdit: true,
    } as unknown as IHubItemEntity;
    const chk = checkPermission("hub:site:edit", authdCtxMgr.context, entity);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(chk.checks.length).toBe(4);
  });
  it("runs entity level permission checks failing", () => {
    const entity = {
      canEdit: true,
      permissions: [
        {
          permission: "hub:site:edit",
          collaborationType: "user",
          collaborationId: "john",
        },
      ],
    } as unknown as IHubItemEntity;
    const chk = checkPermission("hub:site:edit", authdCtxMgr.context, entity);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-granted");
    expect(chk.checks.length).toBe(5);
  });
});
