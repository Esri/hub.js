import { IPermissionPolicy, IArcGISContext } from "../../../src";
import { checkEnvironmentGating } from "../../../src/permissions/_internal/checkEnvironmentGating";

describe("checkEnvironmentGating", () => {
  it("should return a policy check with granted response when context environment matches gated environment", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      gatedEnvironment: "qaext",
    };

    const context: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironmentGating(policy, context);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in qaext org");
    expect(checks[0].response).toBe("granted");
  });

  it("should return a policy check with not-qaext-org response when context environment does not match gated environment and gated environment is qaext", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      gatedEnvironment: "qaext",
    };
    const contextDev: IArcGISContext = {
      environment: "devext",
    } as IArcGISContext;
    const checks = checkEnvironmentGating(policy, contextDev);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in qaext org");
    expect(checks[0].response).toBe("not-qaext-org");
  });

  it("should return a policy check with not-devext-org response when context environment does not match gated environment and gated environment is devext", () => {
    const policyDev: IPermissionPolicy = {
      permission: "hub:project",
      gatedEnvironment: "devext",
    };

    const contextQa: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironmentGating(policyDev, contextQa);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in devext org");
    expect(checks[0].response).toBe("not-devext-org");
  });

  it("should returns an empty array when gatedEnvironment is not defined in the policy", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      licenses: ["hub-premium"],
    };

    const context: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironmentGating(policy, context);
    expect(checks.length).toBe(0);
  });
});
