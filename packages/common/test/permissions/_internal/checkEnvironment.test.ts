import { IPermissionPolicy, IArcGISContext } from "../../../src";
import { checkEnvironment } from "../../../src/permissions/_internal/checkEnvironment";

describe("checkEnvironment: ", () => {
  it("should return a policy check with granted response when context environment matches gated environment", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      environments: ["qaext"],
    };

    const context: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironment(policy, context);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in qaext org");
    expect(checks[0].response).toBe("granted");
  });

  it("should return a policy check with not-qaext-org response when context environment does not match gated environment and gated environment is qaext", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      environments: ["qaext"],
    };
    const contextDev: IArcGISContext = {
      environment: "devext",
    } as IArcGISContext;
    const checks = checkEnvironment(policy, contextDev);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in qaext org");
    expect(checks[0].response).toBe("not-in-environment");
  });

  it("should return a policy check with not-devext-org response when context environment does not match gated environment and gated environment is devext", () => {
    const policyDev: IPermissionPolicy = {
      permission: "hub:project",
      environments: ["devext"],
    };

    const contextQa: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironment(policyDev, contextQa);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in devext org");
    expect(checks[0].response).toBe("not-in-environment");
  });
  it("should return a policy check for each env", () => {
    const policyBoth: IPermissionPolicy = {
      permission: "hub:project",
      environments: ["devext", "qaext"],
    };

    const contextQa: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironment(policyBoth, contextQa);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("user in devext,qaext org");
    expect(checks[0].response).toBe("granted");
  });

  it("should returns an empty array when environment is not defined in the policy", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      licenses: ["hub-premium"],
    };

    const context: IArcGISContext = {
      environment: "qaext",
    } as IArcGISContext;

    const checks = checkEnvironment(policy, context);
    expect(checks.length).toBe(0);
  });
});
