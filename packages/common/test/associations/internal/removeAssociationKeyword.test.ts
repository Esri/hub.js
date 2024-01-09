import { removeAssociationKeyword } from "../../../src/associations/internal/removeAssociationKeyword";

describe("setAssociationKeyword:", () => {
  it("removes an association keyword", () => {
    const chk = removeAssociationKeyword(
      ["someKeyword", "ref|initiative|123"],
      "initiative",
      "123"
    );
    expect(chk.length).toBe(1);
  });
});
