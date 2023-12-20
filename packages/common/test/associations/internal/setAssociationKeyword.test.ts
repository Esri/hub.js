import { setAssociationKeyword } from "../../../src/associations/internal/setAssociationKeyword";

describe("setAssociationKeyword:", () => {
  it("adds association keyword", () => {
    const chk = setAssociationKeyword(["someKeyword"], "initiative", "123");
    expect(chk[1]).toBe("ref|initiative|123");
  });
  it("does not add duplicate association keywords", () => {
    const chk = setAssociationKeyword(
      ["someKeyword", "ref|initiative|123"],
      "initiative",
      "123"
    );
    expect(chk.length).toBe(2);
  });
});
