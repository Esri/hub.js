import { describe, it, expect } from "vitest";
import { compareAccess } from "../../src/access/compareAccess";
import { AccessLevel } from "../../src/core/types/types";

describe("compareAccess", () => {
  it("returns access1 when both levels are equal", () => {
    const levels: AccessLevel[] = ["private", "shared", "org", "public"];
    levels.forEach((level) => {
      expect(compareAccess(level, level)).toBe(level);
    });
  });

  it("returns access1 when access1 is less or equally permissive than access2", () => {
    const cases: Array<[AccessLevel, AccessLevel]> = [
      ["private", "shared"],
      ["private", "org"],
      ["private", "public"],
      ["shared", "org"],
      ["shared", "public"],
      ["org", "public"],
    ];
    cases.forEach(([a, b]) => {
      expect(compareAccess(a, b)).toBe(a);
    });
  });

  it("returns 'private' when access1 is more permissive than access2", () => {
    const downgradeCases: Array<[AccessLevel, AccessLevel]> = [
      ["shared", "private"],
      ["org", "private"],
      ["org", "shared"],
      ["public", "private"],
      ["public", "shared"],
      ["public", "org"],
    ];
    downgradeCases.forEach(([a, b]) => {
      expect(compareAccess(a, b)).toBe("private");
    });
  });

  it("does not downgrade when access1 is already 'private'", () => {
    const targets: AccessLevel[] = ["private", "shared", "org", "public"];
    targets.forEach((target) => {
      expect(compareAccess("private", target)).toBe("private");
    });
  });
});
