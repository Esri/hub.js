import { getAllowedGroupAccess } from "../../src";

describe("getAllowedGroupAccess", () => {
  it("retuns public if all privs present", () => {
    const user = {
      privileges: ["portal:user:createGroup", "portal:user:shareGroupToPublic"]
    };
    expect(getAllowedGroupAccess("public", user)).toBe(
      "public",
      "should return public if all privs present"
    );
  });

  it("retuns org if missing public privs", () => {
    const user = {
      privileges: ["portal:user:createGroup", "portal:user:shareGroupToOrg"]
    };
    expect(getAllowedGroupAccess("public", user)).toBe(
      "org",
      "should downgrade to org if missing priv"
    );
  });

  it("retuns private if missing org privs", () => {
    const user = {
      privileges: ["portal:user:createGroup"]
    };
    expect(getAllowedGroupAccess("public", user)).toBe(
      "private",
      "should downgrade to private if missing priv"
    );
  });

  it("retuns private if org requested but no org privs", () => {
    const user = {
      privileges: ["portal:user:createGroup"]
    };
    expect(getAllowedGroupAccess("org", user)).toBe(
      "private",
      "should downgrade to private if missing priv"
    );
  });
});
