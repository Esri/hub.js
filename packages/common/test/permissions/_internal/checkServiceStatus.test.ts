import { IPermissionPolicy } from "../../../src/permissions/types/IPermissionPolicy";
import { checkServiceStatus } from "../../../src/permissions/_internal/checkServiceStatus";
import { IArcGISContext } from "../../../src/ArcGISContext";
describe("checkServiceStatus:", () => {
  it("returns not checks if policy does not specify services", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
    };
    const context: IArcGISContext = {
      serviceStatus: {
        portal: "online",
      },
    } as IArcGISContext;
    const checks = checkServiceStatus(policy, context);
    expect(checks.length).toBe(0);
  });
  it("returns granted if service online", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      services: ["portal"],
    };
    const context: IArcGISContext = {
      serviceStatus: {
        portal: "online",
      },
    } as IArcGISContext;
    const checks = checkServiceStatus(policy, context);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("service portal online");
    expect(checks[0].response).toBe("granted");
  });
  it("does not return granted if service offline", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      services: ["portal"],
    };
    const context: IArcGISContext = {
      serviceStatus: {
        portal: "offline",
      },
    } as IArcGISContext;
    const checks = checkServiceStatus(policy, context);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("service portal online");
    expect(checks[0].response).toBe("service-offline");
  });
  it("does not return granted if service maintainance", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      services: ["portal"],
    };
    const context: IArcGISContext = {
      serviceStatus: {
        portal: "maintenance",
      },
    } as IArcGISContext;
    const checks = checkServiceStatus(policy, context);
    expect(checks.length).toBe(1);
    expect(checks[0].name).toBe("service portal online");
    expect(checks[0].response).toBe("service-maintenance");
  });
  it("does not return granted if service not-available", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:project",
      services: ["portal", "domains"],
    };
    const context: IArcGISContext = {
      serviceStatus: {
        portal: "online",
        domains: "not-available",
      },
    } as IArcGISContext;
    const checks = checkServiceStatus(policy, context);
    expect(checks.length).toBe(2);
    expect(checks[0].name).toBe("service portal online");
    expect(checks[0].response).toBe("granted");
    expect(checks[1].name).toBe("service domains online");
    expect(checks[1].response).toBe("service-not-available");
  });
  it("returns granted if multiple services online", () => {
    const policy: IPermissionPolicy = {
      permission: "hub:site",
      services: ["portal", "domains"],
    };
    const context: IArcGISContext = {
      serviceStatus: {
        portal: "online",
        domains: "online",
      },
    } as IArcGISContext;
    const checks = checkServiceStatus(policy, context);
    expect(checks.length).toBe(2);
    expect(checks[0].name).toBe("service portal online");
    expect(checks[0].response).toBe("granted");
    expect(checks[1].name).toBe("service domains online");
    expect(checks[1].response).toBe("granted");
  });
});
