import { IArcGISContext, IPermissionPolicy } from "../../../src";
import { checkLicense } from "../../../src/permissions/_internal/checkLicense";

describe("checkLicense:", () => {
  it("returns not-available if user has enterprise-sites but premium required", () => {
    const ctx = {
      hubLicense: "enterprise-sites",
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium"],
    } as unknown as IPermissionPolicy;

    const chks = checkLicense(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("not-available");
  });
  it("returns not-licensed if user has basic but premium required", () => {
    const ctx = {
      hubLicense: "hub-basic",
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium"],
    } as unknown as IPermissionPolicy;

    const chks = checkLicense(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("not-licensed");
  });
  it("returns granted if users license is in list", () => {
    const ctx = {
      hubLicense: "hub-basic",
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium", "hub-basic"],
    } as unknown as IPermissionPolicy;

    const chks = checkLicense(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
  it("does not return check if licenses not defined", () => {
    const ctx = {
      hubLicense: "hub-basic",
    } as unknown as IArcGISContext;
    const policy = {} as unknown as IPermissionPolicy;

    const chks = checkLicense(policy, ctx);
    expect(chks.length).toBe(0);
  });
});
