import {
  getCategory,
  getTypes,
  getTypeCategories,
  getType
} from "../src/content";

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
    expect(getTypes("site")).toEqual([
      "Hub Site Application",
      "Site Application"
    ]);
  });
});

describe("getType", () => {
  it("can get type from item.type if typeKeywords is not defined", () => {
    expect(getType({ type: "type from item" })).toEqual("type from item");
  });
  it("can get type from item.type without typeKeywords", () => {
    expect(getType({ type: "Web Mapping Application" })).toEqual(
      "Web Mapping Application"
    );
  });
  it("can get type from item.typeKeywords", () => {
    expect(
      getType({ type: "Web Mapping Application", typeKeywords: ["hubSite"] })
    ).toEqual("Hub Site Application");
    expect(
      getType({ type: "Web Mapping Application", typeKeywords: ["hubPage"] })
    ).toEqual("Hub Page");
  });
  it("can work with blank inputs", () => {
    expect(getType()).toBe(undefined);
  });
});

describe("getTypeCategories", () => {
  it("should return Other if category is undefined", () => {
    expect(getTypeCategories({ type: "unknown type" })).toEqual(["Other"]);
  });
  it("should return correct typeCategory if category is defined", () => {
    expect(
      getTypeCategories({
        type: "Web Mapping Application",
        typeKeywords: ["hubSite"]
      })
    ).toEqual(["Site"]);
  });
  it("can work with blank inputs", () => {
    expect(getTypeCategories()).toEqual(["Other"]);
  });
});
