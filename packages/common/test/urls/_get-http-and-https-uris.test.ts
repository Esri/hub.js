import { _getHttpAndHttpsUris } from "../../src";

describe("_getHttpAndHttpsUris", () => {
  it("returns the correct uris", () => {
    expect(_getHttpAndHttpsUris("https://foo.bar.com")).toEqual([
      "http://foo.bar.com",
      "https://foo.bar.com"
    ]);
  });

  it("returns empty array if no uri provided", () => {
    expect(_getHttpAndHttpsUris("")).toEqual([]);
  });
});
