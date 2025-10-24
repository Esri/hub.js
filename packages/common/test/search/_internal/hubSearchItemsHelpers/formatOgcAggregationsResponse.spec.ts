import { describe, it, expect } from "vitest";
import { formatOgcAggregationsResponse } from "../../../../src/search/_internal/hubSearchItemsHelpers/formatOgcAggregationsResponse";

describe("formatOgcAggregationsResponse", () => {
  it("formats ogc aggregations into hub aggregations", () => {
    const response = {
      aggregations: {
        aggregations: [
          {
            field: "f1",
            aggregations: [
              { label: "L1", value: 10 },
              { label: "L2", value: 5 },
            ],
          },
        ],
      },
    } as any;

    const res = formatOgcAggregationsResponse(response);

    expect(res.aggregations).toHaveLength(1);
    expect(res.aggregations[0].field).toBe("f1");
    expect(res.aggregations[0].values.map((v: any) => v.value)).toEqual([
      "L1",
      "L2",
    ]);
    expect(res.aggregations[0].values.map((v: any) => v.count)).toEqual([
      10, 5,
    ]);
    expect(res.next()).toBeNull();
  });
});
