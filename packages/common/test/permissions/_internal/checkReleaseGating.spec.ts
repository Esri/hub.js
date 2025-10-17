import { checkReleaseGating } from "../../../src/permissions/_internal/checkReleaseGating";
import { IPermissionPolicy } from "../../../src/permissions/types/IPermissionPolicy";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("checkReleaseGating", () => {
  const baseContext: IArcGISContext = {
    environment: "production",
  } as IArcGISContext;

  it("grants access if environment is not production", () => {
    const context = {
      ...baseContext,
      environment: "qa",
    } as unknown as IArcGISContext;
    const policy: IPermissionPolicy = {
      releaseAfter: "2023-01-01T00:00:00Z",
      retireAfter: "2024-01-01T00:00:00Z",
    } as IPermissionPolicy;

    const result = checkReleaseGating(policy, context);
    expect(result.length).toBe(1);
    expect(result[0].response).toBe("granted");
    expect(result[0].name).toBe("release gating only applies to production");
  });

  it("returns release-date-not-reached if releaseAfter is in the future", () => {
    const futureDate = new Date(Date.now() + 1000000).toISOString();
    const policy: IPermissionPolicy = {
      releaseAfter: futureDate,
    } as IPermissionPolicy;

    const result = checkReleaseGating(policy, baseContext);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("feature released");
    expect(result[0].response).toBe("release-date-not-reached");
  });

  it("returns granted if releaseAfter is in the past", () => {
    const pastDate = new Date(Date.now() - 1000000).toISOString();
    const policy: IPermissionPolicy = {
      releaseAfter: pastDate,
    } as IPermissionPolicy;

    const result = checkReleaseGating(policy, baseContext);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("feature released");
    expect(result[0].response).toBe("granted");
  });

  it("returns retire-date-not-reached if retireAfter is in the future", () => {
    const futureDate = new Date(Date.now() + 1000000).toISOString();
    const policy: IPermissionPolicy = {
      retireAfter: futureDate,
    } as IPermissionPolicy;

    const result = checkReleaseGating(policy, baseContext);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("feature retired");
    expect(result[0].response).toBe("retire-date-not-reached");
  });

  it("returns granted if retireAfter is in the past", () => {
    const pastDate = new Date(Date.now() - 1000000).toISOString();
    const policy: IPermissionPolicy = {
      retireAfter: pastDate,
    } as IPermissionPolicy;

    const result = checkReleaseGating(policy, baseContext);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("feature retired");
    expect(result[0].response).toBe("granted");
  });

  it("handles both releaseAfter and retireAfter together", () => {
    const pastDate = new Date(Date.now() - 1000000).toISOString();
    const futureDate = new Date(Date.now() + 1000000).toISOString();
    const policy: IPermissionPolicy = {
      releaseAfter: pastDate,
      retireAfter: futureDate,
    } as IPermissionPolicy;

    const result = checkReleaseGating(policy, baseContext);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("feature released");
    expect(result[0].response).toBe("granted");
    expect(result[1].name).toBe("feature retired");
    expect(result[1].response).toBe("retire-date-not-reached");
  });

  it("returns empty checks if no releaseAfter or retireAfter in production", () => {
    const policy: IPermissionPolicy = {} as IPermissionPolicy;
    const result = checkReleaseGating(policy, baseContext);
    expect(result.length).toBe(0);
  });
});
