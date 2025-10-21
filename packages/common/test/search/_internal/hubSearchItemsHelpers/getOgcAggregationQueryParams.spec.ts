import { getOgcAggregationQueryParams } from "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcAggregationQueryParams";

describe("getOgcAggregationQueryParams", () => {
  it("builds aggregations and returns expected fields", () => {
    const query = { filters: [], bbox: null } as any;
    const options = {
      aggFields: ["a", "b"],
      requestOptions: { authentication: { token: "T" } },
    } as any;

    const res = getOgcAggregationQueryParams(query, options);

    expect(res.aggregations).toContain("terms(fields=(");
    expect(res.bbox).toBeUndefined();
    expect(res.token).toBe("T");
  });
});
