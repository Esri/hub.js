import { processPostFilters } from "../../../../src/search/_internal/hubDiscussionsHelpers/processPostFilters";
import { IFilter } from "../../../../src/search/types/IHubCatalog";
import * as bboxStringToGeoJSONPolygonModule from "../../../../src/search/_internal/bboxStringToGeoJSONPolygon";
import { BBOX, GEOMETRY_FIXTURE } from "../fixtures";
import { SharingAccess } from "../../../../src/discussions/api/enums/sharingAccess";
import { PostStatus } from "../../../../src/discussions/api/enums/postStatus";
import { PostType } from "../../../../src/discussions/api/enums/postType";

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

  it("should process body, owner->creator, editor, discussion, title", () => {
    const filters: IFilter[] = [
      {
        predicates: [
          { body: "foo" },
          { owner: "alice" },
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

  it("should ignore title and body when term is provided", () => {
    const filters: IFilter[] = [
      {
        predicates: [{ body: "foo" }, { title: "bar" }, { term: "hello" }],
      },
    ];
    const result = processPostFilters(filters);
    expect(result.body).toBeUndefined();
    expect(result.title).toBeUndefined();
    expect(result.term).toBe("hello");
  });

  it("should process channels and parents arrays", () => {
    const filters: IFilter[] = [
      { predicates: [{ channel: "c1" }, { parentId: "p1" }] },
    ];
    const result = processPostFilters(filters);
    expect(result.channels).toEqual(["c1"]);
    expect(result.parents).toEqual(["p1"]);
  });

  it("should process groups array", () => {
    const filters: IFilter[] = [{ predicates: [{ groups: ["g1", "g2"] }] }];
    const result = processPostFilters(filters);
    expect(result.groups).toEqual(["g1", "g2"]);
  });

  it("should process bbox", () => {
    const bboxStringToGeoJSONPolygonSpy = spyOn(
      bboxStringToGeoJSONPolygonModule,
      "bboxStringToGeoJSONPolygon"
    ).and.returnValue(GEOMETRY_FIXTURE);
    const result = processPostFilters([{ predicates: [{ bbox: BBOX }] }]);
    expect(bboxStringToGeoJSONPolygonSpy).toHaveBeenCalledTimes(1);
    expect(bboxStringToGeoJSONPolygonSpy).toHaveBeenCalledWith(BBOX);
    expect(result.geometry).toEqual(GEOMETRY_FIXTURE);
  });

  it("should process postType", () => {
    const filters: IFilter[] = [{ predicates: [{ postType: "text" }] }];
    const result = processPostFilters(filters);
    expect(result.postType).toEqual(PostType.Text);
  });

  it("should process created range", () => {
    const filters: IFilter[] = [
      { predicates: [{ created: { from: 1, to: 2 } }] },
    ];
    const result = processPostFilters(filters);
    expect(result.createdAfter).toEqual(new Date(1));
    expect(result.createdBefore).toEqual(new Date(2));
  });

  it("should process modified range", () => {
    const filters: IFilter[] = [
      { predicates: [{ modified: { from: 3, to: 4 } }] },
    ];
    const result = processPostFilters(filters);
    expect(result.updatedAfter).toEqual(new Date(3));
    expect(result.updatedBefore).toEqual(new Date(4));
  });
});
