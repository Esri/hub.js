import { IArcGISContext, IPermissionPolicy } from "../../../src";
import { checkAvailabilityGating } from "../../../src/permissions/_internal/checkAvailabilityGating";

describe("checkAvailabilityGating:", () => {
  const policyAlpha: IPermissionPolicy = {
    permission: "hub:project",
    gatedAvailability: "alpha",
  };

  const policyBeta: IPermissionPolicy = {
    permission: "hub:project",
    gatedAvailability: "beta",
  };

  const contextAlpha: IArcGISContext = {
    isAlphaOrg: true,
  } as IArcGISContext;

  const contextBeta: IArcGISContext = {
    isBetaOrg: true,
  } as IArcGISContext;

  const contextGA: IArcGISContext = {
    isBetaOrg: false,
    isAlphaOrg: false,
  } as IArcGISContext;

  it("if gating matches, should return granted - alpha ", () => {
    const checks = checkAvailabilityGating(policyAlpha, contextAlpha);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in alpha org");
    expect(checks[0].response).toBe("granted");
  });

  it("if gating matches, should return granted - beta ", () => {
    const checks = checkAvailabilityGating(policyBeta, contextBeta);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in beta org");
    expect(checks[0].response).toBe("granted");
  });

  it("fails check when policy is alpha, context is ga or beta", () => {
    const checks = checkAvailabilityGating(policyAlpha, contextBeta);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in alpha org");
    expect(checks[0].response).toBe("not-alpha-org");

    const checks2 = checkAvailabilityGating(policyBeta, contextAlpha);
    expect(checks2.length).toBe(1);
    expect(checks2[0].name).toBe("user in beta org");
    expect(checks2[0].response).toBe("not-beta-org");

    const checks3 = checkAvailabilityGating(policyBeta, contextGA);
    expect(checks3.length).toBe(1);
    expect(checks3[0].name).toBe("user in beta org");
    expect(checks3[0].response).toBe("not-beta-org");

    const checks4 = checkAvailabilityGating(policyAlpha, contextGA);
    expect(checks4.length).toBe(1);
    expect(checks4[0].name).toBe("user in alpha org");
    expect(checks4[0].response).toBe("not-alpha-org");
  });

  it("should return an empty array when available is not defined in the policy", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
    };
    const checks = checkAvailabilityGating(policy, contextGA);
    expect(checks.length).toBe(0);
  });

  it("logs warning for ga gating", () => {
    const spy = spyOn(console, "warn").and.callThrough();
    const policyGA: IPermissionPolicy = {
      permission: "hub:project",
      gatedAvailability: "ga",
    };
    const context: IArcGISContext = {
      isBetaOrg: false,
      isAlphaOrg: false,
    } as IArcGISContext;

    const checks = checkAvailabilityGating(policyGA, context);
    expect(checks.length).toBe(0);
    expect(spy).toHaveBeenCalledWith(
      `PERMISSION WARNING: gatedAvailability: "ga" is not a valid on "hub:project" policy.`
    );
  });
});
