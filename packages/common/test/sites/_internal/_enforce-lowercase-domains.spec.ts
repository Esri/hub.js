import { _enforceLowercaseDomains } from "../../../src/sites/_internal/_enforce-lowercase-domains";
import {
  describe,
  it,
  expect,
} from "vitest";

describe("_enforceLowercaseDomains", () => {
  it("runs without error", () => {
    const model: any = { item: { properties: {} }, data: { values: {} } };
    const result = _enforceLowercaseDomains(model);
    expect(result).toBeDefined();
    // schemaVersion should be set on the returned model
    expect(result.item.properties.schemaVersion).toBeDefined();
  });
});
