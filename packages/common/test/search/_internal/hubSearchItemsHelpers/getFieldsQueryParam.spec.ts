import { getFieldsQueryParam } from "../../../../src/search/_internal/hubSearchItemsHelpers/getFieldsQueryParam";

describe("getFieldsQueryParam", () => {
  it("returns undefined when no fields predicate present", () => {
    const res = getFieldsQueryParam({ filters: [] } as any);
    expect(res).toBeUndefined();
  });

  it("extracts fields from top-level predicate", () => {
    const res = getFieldsQueryParam({
      filters: [{ predicates: [{ fields: "a,b" }] }],
    } as any);
    expect(res).toBe("a,b");
  });
});
