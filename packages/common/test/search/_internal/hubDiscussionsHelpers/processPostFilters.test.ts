import { processPostFilters } from "../../../../src/search/_internal/hubDiscussionsHelpers/processPostFilters";
import {
  SharingAccess,
  PostStatus,
  PostRelation,
} from "../../../../src/discussions/api/types";
import { IFilter } from "../../../../src/search/types";

describe("processPostFilters", () => {
  it("should return empty object for empty filters", () => {
    const result = processPostFilters([]);
    expect(result).toEqual({});
  });

  it("should process access values", () => {
    const filters: IFilter[] = [{ predicates: [{ access: "public" }] }];
    const result = processPostFilters(filters);
    expect(result.access).toEqual([SharingAccess.PUBLIC]);
  });

  it("should process status values", () => {
    const filters: IFilter[] = [{ predicates: [{ status: "pending" }] }];
    const result = processPostFilters(filters);
    expect(result.status).toEqual([PostStatus.PENDING]);
  });

  it("should process body, creator, editor, discussion, title", () => {
    const filters: IFilter[] = [
      {
        predicates: [
          { body: "foo" },
          { creator: "alice" },
          { editor: "bob" },
          { discussion: "d1" },
          { title: "bar" },
        ],
      },
    ];
    const result = processPostFilters(filters);
    expect(result.body).toBe("foo");
    expect(result.creator).toBe("alice");
    expect(result.editor).toBe("bob");
    expect(result.discussion).toBe("d1");
    expect(result.title).toBe("bar");
  });

  it("should process channels and parents arrays", () => {
    const filters: IFilter[] = [
      { predicates: [{ channel: "c1" }, { parentId: "p1" }] },
    ];
    const result = processPostFilters(filters);
    expect(result.channels).toEqual(["c1"]);
    expect(result.parents).toEqual(["p1"]);
  });

  it("should process relations", () => {
    const filters: IFilter[] = [{ predicates: [{ relation: "replies" }] }];
    const result = processPostFilters(filters);
    expect(result.relations).toEqual([PostRelation.REPLIES]);
  });
});
