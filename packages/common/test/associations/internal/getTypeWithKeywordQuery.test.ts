import { getTypeWithKeywordQuery } from "../../../src/associations/internal/getTypeWithKeywordQuery";

describe("getTypeWithKeywordQuery:", () => {
  it("verify structure", () => {
    const chk = getTypeWithKeywordQuery("Hub Project", "foo|00c");

    expect(chk.targetEntity).toBe("item");
    expect(chk.filters.length).toBe(1);
    expect(chk.filters[0].predicates.length).toBe(1);
    expect(chk.filters[0].predicates[0].type).toBe("Hub Project");
    expect(chk.filters[0].predicates[0].typekeywords).toEqual("foo|00c");
  });
});
