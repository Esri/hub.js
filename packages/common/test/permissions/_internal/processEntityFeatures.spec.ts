import { processEntityFeatures } from "../../../src/permissions/_internal/processEntityFeatures";
import { IFeatureFlags } from "../../../src/permissions/types/IPermissionPolicy";

describe("processEntityFeatures:", () => {
  it("merged entity values with defaults", () => {
    const defaults: IFeatureFlags = {
      "hub:project:events": true,
      "hub:project:view": false,
    };
    const entity: IFeatureFlags = {};
    const chk = processEntityFeatures(entity, defaults);
    expect(chk["hub:project:events"]).toBe(true);
    expect(chk["hub:project:view"]).toBe(false);
  });
  it("removes values not in defaults", () => {
    const defaults: IFeatureFlags = {
      "hub:project:events": true,
      "hub:project:view": false,
    };
    const entity: IFeatureFlags = {
      "hub:project:events": false,
      "hub:project:view": true,
      "hub:project:associations": false,
    };
    const chk = processEntityFeatures(entity, defaults);
    expect(chk["hub:project:events"]).toBe(false);
    expect(chk["hub:project:view"]).toBe(true);
    expect(chk["hub:project:associations"]).not.toBeDefined();
  });
});
