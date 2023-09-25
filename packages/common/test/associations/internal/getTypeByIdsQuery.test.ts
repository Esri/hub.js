import { getTypeByIdsQuery } from "../../../src/associations/internal/getTypeByIdsQuery";

describe("getTypeByIdsQuery:", () => {
  it("verify structure", () => {
    const chk = getTypeByIdsQuery("Hub Project", ["a", "b"]);

    expect(chk.targetEntity).toBe("item");
    expect(chk.filters.length).toBe(1);
    expect(chk.filters[0].predicates.length).toBe(1);
    expect(chk.filters[0].predicates[0].type).toBe("Hub Project");
    expect(chk.filters[0].predicates[0].id).toEqual(["a", "b"]);
  });
});
