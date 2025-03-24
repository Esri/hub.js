import type { IGroup, IUser } from "../../../../src/rest/types";
import {
  isOrgAdmin,
  isUserInOrg,
  reduceByGroupMembership,
  userHasPrivilege,
  userHasPrivileges,
} from "../../../../src/discussions/api/utils/platform";

describe("Util: reduceByGroupMembership", () => {
  it("returns reducer fn", async () => {
    const groupId = "foo";
    const fn = reduceByGroupMembership(["member"]);
    const groups = [
      { id: groupId, userMembership: { memberType: "member" } } as IGroup,
      { id: "bar", userMembership: { memberType: "admin" } } as IGroup,
    ];
    expect(groups.reduce(fn, [])).toEqual([groupId]);
  });
});

describe("Util: isOrgAdmin", () => {
  it("returns true if org_admin", async () => {
    const user = { role: "org_admin" } as unknown as IUser;
    expect(isOrgAdmin(user)).toBeTruthy();
  });

  it("returns true if org_admin via platform role", async () => {
    const user = { role: "org_admin", roleId: "3ef" } as IUser;
    expect(isOrgAdmin(user)).toBeTruthy();
  });

  it("returns false if not org_admin", async () => {
    const user = { role: "org_user" } as unknown as IUser;
    expect(isOrgAdmin(user)).toBeFalsy();
  });
});

describe("Util: isUserInOrg", () => {
  it("returns true if user orgId matches passed orgId", async () => {
    const user = { orgId: "aaa" } as unknown as IUser;
    const orgId = "aaa";
    expect(isUserInOrg(user, orgId)).toBeTruthy();
  });

  it("returns false if user orgId does not match passed orgId", async () => {
    const user = { orgId: "aaa" } as unknown as IUser;
    const orgId = "bbb";
    expect(isUserInOrg(user, orgId)).toBeFalsy();
  });

  it("returns false if user is undefined", async () => {
    const user = undefined as unknown as IUser;
    const orgId = "bbb";
    expect(isUserInOrg(user, orgId)).toBeFalsy();
  });
});

describe("Util: userHasPrivilege", () => {
  it("returns true if user has privilege", async () => {
    const user = { privileges: ["portal:user:createItem"] } as unknown as IUser;
    expect(userHasPrivilege(user, "portal:user:createItem")).toBeTruthy();
  });

  it("returns false if user does not have privilege", async () => {
    const user = { privileges: [] } as unknown as IUser;
    expect(userHasPrivilege(user, "portal:user:createItem")).toBeFalsy();
  });

  it("returns false if user privileges is undefined", async () => {
    const user = {} as unknown as IUser;
    expect(userHasPrivilege(user, "portal:user:createItem")).toBeFalsy();
  });

  it("returns false if user is undefined", async () => {
    const user = undefined as unknown as IUser;
    expect(userHasPrivilege(user, "portal:user:createItem")).toBeFalsy();
  });
});

describe("Util: userHasPrivileges", () => {
  it("returns true if user has all privileges", async () => {
    const user = {
      privileges: ["portal:user:createItem", "portal:user:shareToGroup"],
    } as unknown as IUser;
    expect(
      userHasPrivileges(user, [
        "portal:user:createItem",
        "portal:user:shareToGroup",
      ])
    ).toBeTruthy();
  });

  it("returns false if user does not have all privileges", async () => {
    const user = { privileges: ["portal:user:createItem"] } as unknown as IUser;
    expect(
      userHasPrivileges(user, [
        "portal:user:createItem",
        "portal:user:shareToGroup",
      ])
    ).toBeFalsy();
  });

  it("returns false if user is undefined", async () => {
    const user = undefined as unknown as IUser;
    expect(userHasPrivileges(user, ["portal:user:createItem"])).toBeFalsy();
  });
});
