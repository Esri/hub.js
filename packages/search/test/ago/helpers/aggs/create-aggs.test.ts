import { createAggs } from "../../../../src/ago/helpers/aggs/create-aggs";

describe("createAggs test", () => {
  it("returns an object of countFields and countSize", () => {
    const facets = "tags,collection,hasApi,downloadable,access";
    const actual = createAggs(facets);
    const expected = { countFields: "tags,access,type", countSize: 200 };
    expect(actual).toEqual(expected);
  });
});
