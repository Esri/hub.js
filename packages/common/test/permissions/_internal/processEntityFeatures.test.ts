import { IEntityFeatures } from "../../../src";
import { processEntityFeatures } from "../../../src/permissions/_internal/processEntityFeatures";

describe("processEntityFeatures:", () => {
  it("merged entity values with defaults", () => {
    const defaults = {
      "hub:project:events": true,
      "hub:project:metrics": false,
    } as IEntityFeatures;
    const entity = {} as IEntityFeatures;
    const chk = processEntityFeatures(entity, defaults);
    expect(chk["hub:project:events"]).toBe(true);
    expect(chk["hub:project:metrics"]).toBe(false);
  });
  it("removes values not in defaults", () => {
    const defaults = {
      "hub:project:events": true,
      "hub:project:metrics": false,
    } as IEntityFeatures;
    const entity = {
      "hub:project:events": false,
      "hub:project:metrics": true,
      "hub:project:overview": false,
    } as IEntityFeatures;
    const chk = processEntityFeatures(entity, defaults);
    expect(chk["hub:project:events"]).toBe(false);
    expect(chk["hub:project:metrics"]).toBe(true);
    expect(chk["hub:project:overview"]).not.toBeDefined();
  });
});
