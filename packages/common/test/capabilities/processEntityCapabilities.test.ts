import {
  EntityCapabilities,
  getProp,
  processEntityCapabilities,
} from "../../src/index";

describe("processEntityCapabilities:", () => {
  it("merges entity values with defaults", () => {
    const defaults = {
      details: true,
      settings: false,
    } as EntityCapabilities;
    const entity = {} as EntityCapabilities;
    const chk = processEntityCapabilities(entity, defaults);
    expect(chk.details).toBe(true);
    expect(chk.settings).toBe(false);
  });
  it("removes values not defined for type", () => {
    const defaults = {
      details: true,
      settings: false,
    } as EntityCapabilities;
    const entity = {
      details: false,
      settings: true,
      other: false,
    } as EntityCapabilities;
    const chk = processEntityCapabilities(entity, defaults);
    expect(chk.details).toBe(false);
    expect(chk.settings).toBe(true);
    expect(getProp(chk, "other")).toBeUndefined();
  });
});
