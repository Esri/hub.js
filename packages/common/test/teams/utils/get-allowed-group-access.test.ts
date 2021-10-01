import { IPortal } from "@esri/arcgis-rest-portal";
import { getAllowedGroupAccess } from "../../../src/teams/utils/get-allowed-group-access";

describe("getAllowedGroupAccess", () => {
  it("retuns public if all privs present", () => {
    const user = {
      privileges: ["portal:user:createGroup", "portal:user:shareGroupToPublic"],
    };
    const portal = {
      canSharePublic: true,
    } as unknown as IPortal;
    expect(getAllowedGroupAccess("public", user, portal)).toBe(
      "public",
      "should return public if all privs present"
    );
  });

  it("retuns org if missing public privs", () => {
    const user = {
      privileges: ["portal:user:createGroup", "portal:user:shareGroupToOrg"],
    };
    const portal = {
      canSharePublic: true,
    } as unknown as IPortal;
    expect(getAllowedGroupAccess("public", user, portal)).toBe(
      "org",
      "should downgrade to org if missing priv"
    );
  });

  it("retruns org if org level public sharing is disabled", () => {
    const user = {
      privileges: [
        "portal:user:createGroup",
        "portal:user:shareGroupToPublic",
        "portal:user:shareGroupToOrg",
      ],
    };
    const portal = {
      canSharePublic: false,
    } as unknown as IPortal;
    expect(getAllowedGroupAccess("public", user, portal)).toBe(
      "org",
      "should downgrade to org if portal public sharing disabled"
    );
  });
  it("retruns org if org level is portal not passed", () => {
    const user = {
      privileges: [
        "portal:user:createGroup",
        "portal:user:shareGroupToPublic",
        "portal:user:shareGroupToOrg",
      ],
    };
    expect(getAllowedGroupAccess("public", user)).toBe(
      "org",
      "should downgrade to org if portal public sharing disabled"
    );
  });

  it("retuns private if missing org privs", () => {
    const user = {
      privileges: ["portal:user:createGroup"],
    };
    const portal = {
      canSharePublic: true,
    } as unknown as IPortal;
    expect(getAllowedGroupAccess("public", user, portal)).toBe(
      "private",
      "should downgrade to private if missing priv"
    );
  });

  it("retuns private if org requested but no org privs", () => {
    const user = {
      privileges: ["portal:user:createGroup"],
    };
    const portal = {
      canSharePublic: true,
    } as unknown as IPortal;
    expect(getAllowedGroupAccess("org", user, portal)).toBe(
      "private",
      "should downgrade to private if missing priv"
    );
  });
});
