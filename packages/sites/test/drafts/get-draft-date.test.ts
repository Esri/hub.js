import { getDraftDate } from "../../src/drafts";

describe("getDraftCreatedDate", () => {
  it("gets the created date", async () => {
    const date = getDraftDate("draft-1601501122.json");
    expect(date).toEqual(new Date(1601501122));
  });

  it("null if can't find it", async () => {
    const date = getDraftDate("asdf.json");
    expect(date).toBeNull();
  });
});
