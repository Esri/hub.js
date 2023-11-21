import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { isOrgAdmin, reduceByGroupMembership } from "../../src/utils/platform";

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
