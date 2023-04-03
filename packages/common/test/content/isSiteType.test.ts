import { isSiteType } from "../../src/content/isSiteType";

describe("isSiteType", () => {
  it("Should return false for web mapping application with no type keywords", () => {
    expect(isSiteType("Web Mapping Application")).toBeFalsy();
  });
  it("Should return true for a Hub Site Application", () => {
    expect(isSiteType("Hub Site Application")).toBeTruthy();
  });
});
