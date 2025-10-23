import { upgradeProtocol } from "../../src/urls/upgrade-protocol";
import { describe, it, expect } from "vitest";

describe("upgradeProtocol", function () {
  it("adds the protocol when not present", function () {
    const url = "foo.bar";
    expect(upgradeProtocol(url)).toBe("https://foo.bar");
  });

  it("replaces http with https", function () {
    const url = "http://foo.bar";
    expect(upgradeProtocol(url)).toBe("https://foo.bar");
  });

  it("replaces http with https", function () {
    const url = "https://foo.bar";
    expect(upgradeProtocol(url)).toBe("https://foo.bar");
  });
});
