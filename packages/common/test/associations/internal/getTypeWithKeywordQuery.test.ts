import { getTypeWithKeywordQuery } from "../../../src/associations/internal/getTypeWithKeywordQuery";

describe("getTypeWithKeywordQuery:", () => {
  it("returns a valid IQuery structure", () => {
    const chk = getTypeWithKeywordQuery("Hub Project", "foo|00c");

    expect(chk.targetEntity).toBe("item");
    expect(chk.filters.length).toBe(1);
    expect(chk.filters[0].predicates.length).toBe(1);
  });
  it("constructs a query for a single type and a single typeKeyword", () => {
    const chk = getTypeWithKeywordQuery("Hub Project", "foo|00c");

    expect(chk.filters[0].predicates[0].type).toBe("Hub Project");
    expect(chk.filters[0].predicates[0].typekeywords).toEqual("foo|00c");
  });
  it("constructs a query for multiple types and a single typeKeyword", () => {
    const chk = getTypeWithKeywordQuery(
      ["Hub Project", "Hub Initiative"],
      "foo|00c"
    );

    expect(chk.filters[0].predicates[0].type).toEqual([
      "Hub Project",
      "Hub Initiative",
    ]);
    expect(chk.filters[0].predicates[0].typekeywords).toEqual("foo|00c");
  });
});
