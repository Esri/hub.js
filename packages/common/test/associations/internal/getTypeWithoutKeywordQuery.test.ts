import { getTypeWithoutKeywordQuery } from "../../../src/associations/internal/getTypeWithoutKeywordQuery";

describe("getTypeWithoutKeywordQuery:", () => {
  it("verify structure", () => {
    const chk = getTypeWithoutKeywordQuery("Hub Project", "foo|00c");

    expect(chk.targetEntity).toBe("item");
    expect(chk.filters.length).toBe(1);
    expect(chk.filters[0].predicates.length).toBe(1);
    expect(chk.filters[0].predicates[0].type).toBe("Hub Project");
    expect(chk.filters[0].predicates[0].typekeywords).toEqual({
      not: ["foo|00c"],
    });
  });
});
