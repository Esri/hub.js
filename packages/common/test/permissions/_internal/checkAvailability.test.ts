import { IArcGISContext, IPermissionPolicy } from "../../../src";
import { checkAvailability } from "../../../src/permissions/_internal/checkAvailability";

describe("checkAvailability: ", () => {
  const policyAlpha: IPermissionPolicy = {
    permission: "hub:project",
    availability: ["alpha"],
  };

  const policyBeta: IPermissionPolicy = {
    permission: "hub:project",
    availability: ["beta"],
  };

  const policyGA: IPermissionPolicy = {
    permission: "hub:project",
    availability: ["general"],
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
    const checks = checkAvailability(policyAlpha, contextAlpha);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in alpha org");
    expect(checks[0].response).toBe("granted");
  });

  it("if gating matches, should return granted - beta ", () => {
    const checks = checkAvailability(policyBeta, contextBeta);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in beta org");
    expect(checks[0].response).toBe("granted");
  });

  it("if gating matches, should return granted - ga ", () => {
    const checks = checkAvailability(policyGA, contextGA);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in general org");
    expect(checks[0].response).toBe("granted");
  });

  it("fails check when policy is alpha, context is ga or beta", () => {
    const checks = checkAvailability(policyAlpha, contextBeta);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in alpha org");
    expect(checks[0].response).toBe("not-alpha-org");

    const checks2 = checkAvailability(policyBeta, contextAlpha);
    expect(checks2.length).toBe(1);
    expect(checks2[0].name).toBe("user in beta org");
    expect(checks2[0].response).toBe("not-beta-org");

    const checks3 = checkAvailability(policyBeta, contextGA);
    expect(checks3.length).toBe(1);
    expect(checks3[0].name).toBe("user in beta org");
    expect(checks3[0].response).toBe("not-beta-org");

    const checks4 = checkAvailability(policyAlpha, contextGA);
    expect(checks4.length).toBe(1);
    expect(checks4[0].name).toBe("user in alpha org");
    expect(checks4[0].response).toBe("not-alpha-org");
  });

  it("should return an empty array when available is not defined in the policy", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
    };
    const checks = checkAvailability(policy, contextGA);
    expect(checks.length).toBe(0);
  });
});
