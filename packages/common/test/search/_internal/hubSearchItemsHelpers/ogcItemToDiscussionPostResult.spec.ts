import { describe, it, expect } from "vitest";
import { ogcItemToDiscussionPostResult } from "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToDiscussionPostResult";

describe("ogcItemToDiscussionPostResult", () => {
  it("maps an ogc item to a discussion post search result", async () => {
    const ogc = {
      id: "p1",
      properties: {
        title: "T",
        body: "B",
        createdAt: "2020-01-01T00:00:00Z",
        updatedAt: "2020-02-01T00:00:00Z",
        creator: "me",
      },
    } as any;

    const res = await ogcItemToDiscussionPostResult(ogc);

    expect(res.id).toBe("p1");
    expect(res.name).toBe("T");
    expect(res.summary).toBe("B");
    expect(res.owner).toBe("me");
    expect(res.title).toBe("T");
  });
});
