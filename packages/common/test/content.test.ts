import { getCategory, getTypes } from "../src/content";

describe("getCategory", () => {
  it("can abort", () => {
    expect(getCategory()).toBe(undefined);
  });

  it("can retrieve a single category", () => {
    expect(getCategory("Feature Layer")).toBe("dataset");
  });

  it("can retrieve a single category (from cache)", () => {
    expect(getCategory("Feature Layer")).toBe("dataset");
  });
});

describe("getTypes", () => {
  it("can abort", () => {
    expect(getTypes()).toBe(undefined);
  });
  it("can get a list of types for a category", () => {
    expect(getTypes("site")).toEqual(["Hub Site Application"]);
  });
});
