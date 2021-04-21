import { IUser } from "@esri/arcgis-rest-portal";
import { _isOrgAdmin } from "../../../src/utils/_add-users-to-group/_is-org-admin";

describe("_is_org_admin", () => {
  it("Returns false if user does not have org_admin role", () => {
    const user: IUser = {
      username: "Wolverine",
      role: "org_user"
    };
    expect(_isOrgAdmin(user)).toEqual(false);
  });
  it("Returns false if user does not have org_admin role", () => {
    const user: IUser = {
      username: "Wolverine",
      role: "org_user"
    };
    expect(_isOrgAdmin(user)).toEqual(false);
  });
  it("Returns false if user has org_admin role but has a role id", () => {
    const user: IUser = {
      username: "Wolverine",
      role: "org_admin",
      roleId: "not a real admin"
    };
    expect(_isOrgAdmin(user)).toEqual(false);
  });
  it("Returns false if user has org_admin role and no role id", () => {
    const user: IUser = {
      username: "Wolverine",
      role: "org_admin"
    };
    expect(_isOrgAdmin(user)).toEqual(true);
  });
});
