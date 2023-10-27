import { flattenCategories } from "../../../../src/ago/helpers/aggs/categories";

describe("categories aggs test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });

  it("works on undefined categories", () => {
    expect(flattenCategories()).toEqual([]);
  });

  it("correctly flattens categories while ignoring blank and 'categories' keys", () => {
    const categoriesAggs = [
      { key: "", docCount: 2 },
      { key: "/categories", docCount: 2 },
      { key: "/categories/economy", docCount: 2 },
      { key: "/categories/economy/business", docCount: 2 },
    ];
    const expected = [
      { key: "economy", docCount: 4 },
      { key: "business", docCount: 2 },
    ];
    expect(flattenCategories(categoriesAggs)).toEqual(expected);
  });
});
