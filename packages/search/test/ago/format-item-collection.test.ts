import { agoFormatItemCollection } from "../../src/ago/format-item-collection";
import { searchResults } from "./mocks/ago-response";

describe("agoFormatItemCollection test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("it format item collection correctly", () => {
    const params = {
      q: "blah",
      tags: "all(a,b)",
      agg: { fields: "tags,collection" },
      start: 1,
      num: 10,
    };
    const facets = { a: 1 };
    const formatted = agoFormatItemCollection(searchResults, facets, params);
    expect(formatted.data.length).toBe(10);
    formatted.data.forEach((result: any) => {
      expect(result.id).toBeDefined();
      expect(result.attributes).toBeDefined();
    });
    expect(formatted.meta.queryParameters).toEqual(params);
    expect(formatted.meta.stats.aggs).toEqual(facets);
    expect(formatted.meta.page).toEqual({ start: 1, size: 10, nextStart: 11 });
  });

  it("it format item collection correctly with undefined facets", () => {
    const params = {
      q: "blah",
      tags: "all(a,b)",
      agg: { fields: "tags,collection" },
      start: 1,
      num: 10,
    };
    const formatted = agoFormatItemCollection(searchResults, undefined, params);
    expect(formatted.data.length).toBe(10);
    formatted.data.forEach((result: any) => {
      expect(result.id).toBeDefined();
      expect(result.attributes).toBeDefined();
    });
    expect(formatted.meta.queryParameters).toEqual(params);
    expect(formatted.meta.stats.aggs).toEqual({});
    expect(formatted.meta.page).toEqual({ start: 1, size: 10, nextStart: 11 });
  });
});
