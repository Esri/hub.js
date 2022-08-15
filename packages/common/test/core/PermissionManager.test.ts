import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import * as PermissionBehavior from "../../src/core/behaviors/IWithPermissionBehavior";
import { IHubPermission, PermissionManager } from "../../src/index";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("PermissionManager Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
  });
  it("create from json, toJson returns clone", () => {
    const permissions: IHubPermission[] = [
      {
        id: "p1",
        permission: "addEvent",
        target: "user",
        targetId: "casey",
      },
    ];
    const pm = PermissionManager.fromJson(permissions, authdCtxMgr.context);
    expect(pm instanceof PermissionManager).toBeTruthy();
    expect(pm.toJson()).toEqual(permissions);
    expect(pm.toJson()).not.toBe(permissions);
  });
  it("delegates to behavior functions", () => {
    const checkPermissionSpy = spyOn(
      PermissionBehavior,
      "checkPermission"
    ).and.callThrough();
    const getPermissionSpy = spyOn(
      PermissionBehavior,
      "getPermissions"
    ).and.callThrough();
    const addPermissionSpy = spyOn(
      PermissionBehavior,
      "addPermission"
    ).and.callThrough();
    const removePermissionSpy = spyOn(
      PermissionBehavior,
      "removePermission"
    ).and.callThrough();

    const permissions: IHubPermission[] = [
      {
        id: "p1",
        permission: "addEvent",
        target: "user",
        targetId: "casey",
      },
    ];
    const pm = PermissionManager.fromJson(permissions, authdCtxMgr.context);

    expect(pm.check("addEvent")).toBe(true);
    expect(checkPermissionSpy).toHaveBeenCalledTimes(1);

    const p2: IHubPermission = {
      id: "p2",
      permission: "addInitiative",
      target: "group",
      targetId: "3ef",
    };

    const p3: IHubPermission = {
      // id is not required, but will be added
      permission: "addInitiative",
      target: "org",
      targetId: "bchy8ad",
    };

    pm.add(p2.permission, p2);
    pm.add(p3.permission, p3);
    expect(addPermissionSpy.calls.count()).toBe(2);
    expect(pm.get("addInitiative").length).toBe(2);
    pm.remove("addInitiative", p2.targetId);
    expect(removePermissionSpy).toHaveBeenCalledTimes(1);
    expect(pm.get("addInitiative").length).toBe(1);
  });
});
