import { getCollection, getCollectionTypes } from "../src/collections";

describe("collections", () => {
  describe("getCollections", () => {
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

  describe("getTypesFromCollection", () => {
    it("can abort", () => {
      expect(getCollectionTypes()).toBe(undefined);
    });

    it("can retrieve types from a collection", () => {
      expect(getCollectionTypes("feedback")).toEqual([
        "Form",
        "Quick Capture Project",
      ]);
    });

    it("returns undefined with unknown collection", () => {
      expect(getCollectionTypes("dummy")).toBe(undefined);
    });
  });
});
