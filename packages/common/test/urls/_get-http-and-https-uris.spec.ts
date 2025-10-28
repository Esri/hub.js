import { _getHttpAndHttpsUris } from "../../src/urls/_get-http-and-https-uris";
import { describe, it, expect } from "vitest";

describe("_getHttpAndHttpsUris", () => {
  it("returns the correct uris", () => {
    expect(_getHttpAndHttpsUris("https://foo.bar.com")).toEqual([
      "http://foo.bar.com",
      "https://foo.bar.com",
    ]);
  });

  it("returns empty array if no uri provided", () => {
    expect(_getHttpAndHttpsUris("")).toEqual([]);
  });
});
