import { incrementString } from "../../src/utils/increment-string";
import { describe, it, expect } from "vitest";

describe("incrementString", () => {
  it("increments a string", async () => {
    expect(incrementString("abc")).toBe("abc - 1");
    expect(incrementString("abc - 1")).toBe("abc - 2");
    expect(incrementString("abc - 2")).toBe("abc - 3");
  });
});
