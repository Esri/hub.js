import { getTypeByIdsQuery } from "../../../src/associations/internal/getTypeByIdsQuery";

describe("getTypeByIdsQuery:", () => {
  it("returns a valid IQuery structure", () => {
    const chk = getTypeByIdsQuery("Hub Project", ["a", "b"]);

    expect(chk.targetEntity).toBe("item");
    expect(chk.filters.length).toBe(1);
    expect(chk.filters[0].predicates.length).toBe(1);
  });
  it("constructs a query when no ids are provided", () => {
    const chk = getTypeByIdsQuery("Hub Project", []);

    expect(chk.filters[0].predicates[0].type).toBe("Hub Project");
    expect(chk.filters[0].operation).toBeUndefined();
    expect(chk.filters[0].predicates[0].id).toBeUndefined();
  });
  it("constructs a query for a single type and multiple ids", () => {
    const chk = getTypeByIdsQuery("Hub Project", ["a", "b"]);

    expect(chk.filters[0].predicates[0].type).toBe("Hub Project");
    expect(chk.filters[0].predicates[0].id).toEqual(["a", "b"]);
  });
  it("constructs a query for multiple types and multiple ids", () => {
    const chk = getTypeByIdsQuery(
      ["Hub Project", "Hub Initiative"],
      ["a", "b"]
    );

    expect(chk.filters[0].predicates[0].type).toEqual([
      "Hub Project",
      "Hub Initiative",
    ]);
    expect(chk.filters[0].predicates[0].id).toEqual(["a", "b"]);
  });
});
