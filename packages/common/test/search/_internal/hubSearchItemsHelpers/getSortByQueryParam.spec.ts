import { getSortByQueryParam } from "../../../../src/search/_internal/hubSearchItemsHelpers/getSortByQueryParam";

describe("getSortByQueryParam", () => {
  it("returns undefined when no sort specified", () => {
    const res = getSortByQueryParam({} as any);
    expect(res).toBeUndefined();
  });

  it("returns asc properties string", () => {
    const res = getSortByQueryParam({
      sortField: "name",
      sortOrder: "asc",
    } as any);
    expect(res).toBe("properties.name");
  });

  it("returns desc properties string when order is desc", () => {
    const res = getSortByQueryParam({
      sortField: "date",
      sortOrder: "desc",
    } as any);
    expect(res).toBe("-properties.date");
  });
});
