import {
  describe,
  it,
  expect,
} from "vitest";
import { applyPermissionMigration } from "../../../src/sites/_internal/applyPermissionMigration";

describe("applyPermissionMigration", () => {
  it("returns input when called", () => {
    const model: any = { item: { properties: {} }, data: {} };
    const result = applyPermissionMigration(model);
    // migration adds a permissions array (possibly empty)
    expect(result).toBeDefined();
    expect(Array.isArray(result.data.permissions)).toBe(true);
  });
});
