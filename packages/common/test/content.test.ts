import {
  getCategory,
  getCollection,
  getTypes,
  getTypeCategories,
  normalizeItemType,
  isFeatureService,
  getLayerIdFromUrl,
  getItemLayerId,
  getItemHubId
} from "../src/content";

describe("getCollection", () => {
  it("can abort", () => {
    expect(getCollection()).toBe(undefined);
  });

  it("can retrieve a single category", () => {
    expect(getCollection("Feature Layer")).toBe("dataset");
  });

  it("can retrieve a single category (from cache)", () => {
    expect(getCollection("Feature Layer")).toBe("dataset");
  });
});

describe("getCategory", () => {
  it("returns 'app' for forms", () => {
    expect(getCategory("Form")).toBe("app");
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

describe("normalizeItemType", () => {
  it("can get type from item.type if typeKeywords is not defined", () => {
    expect(normalizeItemType({ type: "type from item" })).toEqual(
      "type from item"
    );
  });
  it("can get type from item.type without typeKeywords", () => {
    expect(normalizeItemType({ type: "Web Mapping Application" })).toEqual(
      "Web Mapping Application"
    );
  });
  it("normalizes sites", () => {
    expect(
      normalizeItemType({
        type: "Web Mapping Application",
        typeKeywords: ["hubSite"]
      })
    ).toEqual("Hub Site Application");
    expect(
      normalizeItemType({ type: "Site Application", typeKeywords: [] })
    ).toEqual("Hub Site Application");
  });
  it("normalizes pages", () => {
    expect(
      normalizeItemType({
        type: "Web Mapping Application",
        typeKeywords: ["hubPage"]
      })
    ).toEqual("Hub Page");
    expect(
      normalizeItemType({ type: "Site Page", typeKeywords: ["hubPage"] })
    ).toEqual("Hub Page");
  });
  it("normalizes initiative templates", () => {
    expect(
      normalizeItemType({
        type: "Hub Initiative",
        typeKeywords: ["hubInitiativeTemplate"]
      })
    ).toEqual("Hub Initiative Template");
  });
  it("normalizes solution templates", () => {
    expect(
      normalizeItemType({
        type: "Web Mapping Application",
        typeKeywords: ["hubSolutionTemplate"]
      })
    ).toEqual("Solution");
  });
  it("can work with blank inputs", () => {
    expect(normalizeItemType()).toBe(undefined);
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

describe("isFeatureService", () => {
  it("returns true when the type is Feature Service", () => {
    expect(isFeatureService("Feature Service")).toBe(true);
    expect(isFeatureService("feature service")).toBe(true);
  });
  it("returns false when the type is not Feature Service", () => {
    expect(isFeatureService("Map Service")).toBe(false);
  });
});

describe("getLayerIdFromUrl", () => {
  it("returns layerId when present", () => {
    expect(
      getLayerIdFromUrl(
        "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer/0"
      )
    ).toBe("0");
  });
  it("returns undefined when not present", () => {
    expect(
      getLayerIdFromUrl(
        "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer"
      )
    ).toBe(null);
  });
});

describe("getLayerIdFromItem", () => {
  it("returns '0' when typeKeywords includes 'Singlelayer'", () => {
    const item: any = {
      type: "Feature Service",
      url:
        "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer",
      typeKeywords: [
        "ArcGIS Server",
        "Data",
        "Feature Access",
        "Feature Service",
        "Metadata",
        "Service",
        "Singlelayer",
        "Hosted Service"
      ]
    };
    expect(getItemLayerId(item)).toBe("0");
  });
});

describe("getItemHubId", () => {
  let layerItem: any;
  beforeEach(() => {
    layerItem = {
      id: "4ef",
      access: "shared",
      type: "Feature Service",
      url:
        "https://services9.arcgis.com/BH6j7VrWdIXhhNYw/arcgis/rest/services/Befolkning_efter_k%C3%B6n/FeatureServer/42"
    };
  });
  it("returns undefined when not public", () => {
    expect(getItemHubId(layerItem)).toBeFalsy();
  });
  it("returns itemId_layerId when public layer", () => {
    layerItem.access = "public";
    expect(getItemHubId(layerItem)).toBe("4ef_42");
  });
  it("returns item id when public non-layer", () => {
    const item: any = {
      id: "3ec",
      access: "public"
    };
    expect(getItemHubId(item)).toBe("3ec");
  });
});
