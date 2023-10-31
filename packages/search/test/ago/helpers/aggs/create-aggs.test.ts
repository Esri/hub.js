import { createAggs } from "../../../../src/ago/helpers/aggs/create-aggs";

describe("createAggs test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("returns an object of countFields and countSize", () => {
    const facets = "tags,collection,hasApi,downloadable,access";
    const actual = createAggs(facets);
    const expected = { countFields: "tags,access,type", countSize: 200 };
    expect(actual).toEqual(expected);
  });

  it("returns an object of countFields and countSize without aggs alias", () => {
    const facets = "tags,access";
    const actual = createAggs(facets);
    const expected = { countFields: "tags,access", countSize: 200 };
    expect(actual).toEqual(expected);
  });
});
