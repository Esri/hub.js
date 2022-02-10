import { getCollection } from "../src/collections";

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
