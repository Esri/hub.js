import { IArcGISContext, IPermissionPolicy } from "../../../src";
import { checkAlphaGating } from "../../../src/permissions/_internal/checkAlphaGating";

describe("checkAlphaGating:", () => {
  it("no check if alpha not specified in policy", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium"],
    } as unknown as IPermissionPolicy;

    const chks = checkAlphaGating(policy, ctx);
    expect(chks.length).toBe(0);
  });
  it("returns not-alpha-org if not alpha org", () => {
    const ctx = {
      isAlphaOrg: false,
    } as unknown as IArcGISContext;
    const policy = {
      alpha: true,
    } as unknown as IPermissionPolicy;

    const chks = checkAlphaGating(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("not-alpha-org");
  });
  it("returns granted if alpha org", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      alpha: true,
    } as unknown as IPermissionPolicy;

    const chks = checkAlphaGating(policy, ctx);
    expect(chks.length).toBe(1);
    expect(chks[0].response).toBe("granted");
  });
});
