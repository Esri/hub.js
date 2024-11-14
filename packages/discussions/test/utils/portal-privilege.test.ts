import { IDiscussionsUser } from "@esri/hub-common";
import {
  hasOrgAdminDeleteRights,
  hasOrgAdminUpdateRights,
  hasOrgAdminViewRights,
} from "../../src/utils/portal-privilege";
import { IUser } from "@esri/arcgis-rest-request";

describe("hasOrgAdminViewRights", () => {
  it("should return false if user is undefined", () => {
    const user = undefined as unknown as IUser;
    const orgId = "aaa";
    expect(hasOrgAdminViewRights(user, orgId)).toEqual(false);
  });

  it("should return false if user is not in the org", () => {
    const user = {} as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminViewRights(user, orgId)).toEqual(false);
  });

  it("should return true if user is org_admin in the org", () => {
    const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminViewRights(user, orgId)).toEqual(true);
  });

  it("should return false if user is org_admin but not in the org", () => {
    const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
    const orgId = "zzz";
    expect(hasOrgAdminViewRights(user, orgId)).toEqual(false);
  });

  it("should return true if user has portal:admin:viewItems privilege and is in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems"],
    } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminViewRights(user, orgId)).toEqual(true);
  });

  it("should return false if user has portal:admin:viewItems privilege but not in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems"],
    } as IDiscussionsUser;
    const orgId = "zzz";
    expect(hasOrgAdminViewRights(user, orgId)).toEqual(false);
  });
});

describe("hasOrgAdminUpdateRights", () => {
  it("should return false if user is undefined", () => {
    const user = undefined as unknown as IUser;
    const orgId = "aaa";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(false);
  });

  it("should return false if user is not in the org", () => {
    const user = {} as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(false);
  });

  it("should return true if user is org_admin in the org", () => {
    const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(true);
  });

  it("should return false if user is org_admin but not in the org", () => {
    const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
    const orgId = "zzz";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(false);
  });

  it("should return true if user has portal:admin:viewItems && portal:admin:updateItems privilege and is in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems", "portal:admin:updateItems"],
    } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(true);
  });

  it("should return false if user has portal:admin:viewItems && portal:admin:updateItems privilege but not in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems", "portal:admin:updateItems"],
    } as IDiscussionsUser;
    const orgId = "zzz";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(false);
  });

  it("should return false if user has portal:admin:viewItems but not portal:admin:updateItems privilege and is in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems"],
    } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminUpdateRights(user, orgId)).toEqual(false);
  });
});

describe("hasOrgAdminDeleteRights", () => {
  it("should return false if user is undefined", () => {
    const user = undefined as unknown as IUser;
    const orgId = "aaa";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(false);
  });

  it("should return false if user is not in the org", () => {
    const user = {} as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(false);
  });

  it("should return true if user is org_admin in the org", () => {
    const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(true);
  });

  it("should return false if user is org_admin but not in the org", () => {
    const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
    const orgId = "zzz";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(false);
  });

  it("should return true if user has portal:admin:viewItems && portal:admin:deleteItems privilege and is in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems", "portal:admin:deleteItems"],
    } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(true);
  });

  it("should return false if user has portal:admin:viewItems && portal:admin:deleteItems privilege but not in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems", "portal:admin:deleteItems"],
    } as IDiscussionsUser;
    const orgId = "zzz";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(false);
  });

  it("should return false if user has portal:admin:viewItems but not portal:admin:deleteItems privilege and is in the org", () => {
    const user = {
      orgId: "aaa",
      privileges: ["portal:admin:viewItems"],
    } as IDiscussionsUser;
    const orgId = "aaa";
    expect(hasOrgAdminDeleteRights(user, orgId)).toEqual(false);
  });
});
