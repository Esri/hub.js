import { stripProtocol } from "../../src/urls/strip-protocol";
import { describe, it, expect } from "vitest";

describe("stripProtocol", function () {
  it("strips the protocol when present", function () {
    const url = "https://foo.baR";
    expect(stripProtocol(url)).toBe("foo.bar");
  });

  it("just lowercases when not present", function () {
    const url = "foo.baR";
    expect(stripProtocol(url)).toBe("foo.bar");
  });
});
