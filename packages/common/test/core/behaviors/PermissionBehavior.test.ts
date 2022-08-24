import { IUser } from "@esri/arcgis-rest-portal";
import {
  addPermission,
  checkPermission,
  getPermissions,
  IHubPermission,
  removePermission,
} from "../../../src/index";

describe("PermissionBehavior module:", () => {
  let permissions: IHubPermission[];
  beforeEach(() => {
    const userPerm: IHubPermission = {
      id: "p1",
      permission: "addProject",
      target: "user",
      targetId: "casey",
    };
    const otherUserPerm: IHubPermission = {
      id: "p2",
      permission: "createProject",
      target: "user",
      targetId: "steve",
    };
    const groupPerm: IHubPermission = {
      id: "p3",
      permission: "addEvent",
      target: "group",
      targetId: "bc3",
    };
    const group2Perm: IHubPermission = {
      id: "p4",
      permission: "addEvent",
      target: "group",
      targetId: "cc0",
    };
    const orgPerm: IHubPermission = {
      id: "p5",
      permission: "addInitiative",
      target: "org",
      targetId: "P0G8KK1",
    };
    // create user that meets all requirements

    permissions = [userPerm, groupPerm, group2Perm, orgPerm, otherUserPerm];
  });
  it("checkPermission()", () => {
    // create user that meets all requirements
    const user = {
      username: "casey",
      orgId: "P0G8KK1",
      groups: [
        {
          id: "bc3",
        },
      ],
    } as unknown as IUser;

    const userWithoutGroups = {
      username: "casey",
      orgId: "P0G8KK1",
    } as unknown as IUser;

    expect(checkPermission("addProject", user, permissions)).toBeTruthy();
    expect(checkPermission("addEvent", user, permissions)).toBeTruthy();
    expect(checkPermission("addInitiative", user, permissions)).toBeTruthy();
    expect(checkPermission("createProject", user, permissions)).toBeFalsy();
    expect(
      checkPermission("addEvent", userWithoutGroups, permissions)
    ).toBeFalsy();
  });
  it("getPermission", () => {
    const chk = getPermissions("addEvent", permissions);
    expect(chk.length).toBe(2);
    expect(chk[0].id).toBe("p3"); // bc3
    expect(chk[1].id).toBe("p4"); // cc0
  });
  it("addPermission replaces existing", () => {
    const updates = addPermission(
      {
        id: "pnew",
        permission: "addInitiative",
        target: "org",
        targetId: "P0G8KK1",
      },
      permissions
    );
    expect(updates.length).toBe(5, "should replace existing entry");
    const chk = getPermissions("addInitiative", updates);
    expect(chk.length).toBe(1, "should have one entry");
    expect(chk[0].id).toBe("pnew", "should have new entry");
  });
  it("addPermission adds new", () => {
    const updates = addPermission(
      {
        id: "p9",
        permission: "createProject",
        target: "group",
        targetId: "4cc",
      },
      permissions
    );
    expect(updates.length).toBe(6, "should add new entry");
  });

  it("removePermission", () => {
    const updated = removePermission("addEvent", "cc0", permissions);
    expect(updated.length).toBe(4, "should remove entry");
  });
});
