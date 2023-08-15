import { IPermissionPolicy } from "../../../src";
import { IArcGISContext } from "../../../src/ArcGISContext";
import { checkEntityFeature } from "../../../src/permissions/_internal/checkEntityFeature";

describe("checkEntityFeatures:", () => {
  it("no check if entity not passed", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      licenses: ["hub-premium"],
    } as unknown as IPermissionPolicy;

    const chks = checkEntityFeature(policy, ctx);
    expect(chks.length).toBe(0);
  });
  it("no check added if policy is not configurable", () => {
    const ctx = {
      isAlphaOrg: true,
    } as unknown as IArcGISContext;
    const policy = {
      permission: "hub:events",
      isEntityConfigurable: false,
      licenses: ["hub-premium"],
    } as IPermissionPolicy;

    const entity = {
      features: {
        "hub:events": false,
      },
    };

    const chks = checkEntityFeature(policy, ctx, entity);
    expect(chks.length).toBe(0);
  });
  it("check returns if disabled on entity", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      permission: "hub:project:events",
      entityConfigurable: true,
      licenses: ["hub-premium"],
    } as IPermissionPolicy;
    const entity = {
      features: {
        "hub:project:events": false,
      },
    };

    const chks = checkEntityFeature(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].name).toBe("entity feature enabled");
    expect(chks[0].response).toBe("feature-disabled");
  });
  it("check returns if enabled on entity", () => {
    const ctx = {} as unknown as IArcGISContext;
    const policy = {
      permission: "hub:project:events",
      entityConfigurable: true,
      licenses: ["hub-premium"],
    } as IPermissionPolicy;
    const entity = {
      features: {
        "hub:project:events": true,
      },
    };

    const chks = checkEntityFeature(policy, ctx, entity);
    expect(chks.length).toBe(1);
    expect(chks[0].name).toBe("entity feature enabled");
    expect(chks[0].response).toBe("feature-enabled");
  });
});
