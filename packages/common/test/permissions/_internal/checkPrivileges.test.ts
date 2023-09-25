import { HubEntity, IArcGISContext } from "../../../src";
import { IPermissionPolicy } from "../../../src/permissions/types";
import { checkPrivileges } from "../../../src/permissions/_internal/checkPrivileges";

describe("checkPrivileges:", () => {
  it("returns empty array if privs not specified", () => {
    const ctx = {
      currentUser: {
        username: "test-user",
        privileges: [],
      },
    } as unknown as IArcGISContext;
    const policy = {
      entityOwner: true,
    } as unknown as IPermissionPolicy;

    const chks = checkPrivileges(policy, ctx);
    expect(chks.length).toBe(0);
  });
  it("returns check for each priv", () => {
    const ctx = {
      isAuthenticated: true,
      currentUser: {
        username: "test-user",
        privileges: ["priv2"],
      },
    } as unknown as IArcGISContext;
    const policy = {
      privileges: ["priv1", "priv2"],
    } as unknown as IPermissionPolicy;

    const chks = checkPrivileges(policy, ctx);
    expect(chks.length).toBe(2);
    expect(chks[0].response).toBe("privilege-required");
    expect(chks[0].value).toBe("privilege missing");
    expect(chks[1].response).toBe("granted");
    expect(chks[1].value).toBe("privilege present");
  });
  it("returns unauthed message", () => {
    const ctx = {
      isAuthenticated: false,
    } as unknown as IArcGISContext;
    const policy = {
      privileges: ["priv1", "priv2"],
    } as unknown as IPermissionPolicy;

    const chks = checkPrivileges(policy, ctx);
    expect(chks.length).toBe(2);
    expect(chks[0].response).toBe("not-authenticated");
    expect(chks[0].value).toBe("not authenticated");
    expect(chks[1].response).toBe("not-authenticated");
    expect(chks[1].value).toBe("not authenticated");
  });
});
