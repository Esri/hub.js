import { PostSort } from "../../../../src/discussions/api/enums/postSort";
import { SortOrder } from "../../../../src/discussions/api/enums/sortOrder";
import { processPostOptions } from "../../../../src/search/_internal/hubDiscussionsHelpers/processPostOptions";

describe("processPostOptions", () => {
  it("should support num", () => {
    let results = processPostOptions({} as any);
    expect(results.num).toBeUndefined();
    results = processPostOptions({ num: 5 } as any);
    expect(results.num).toEqual(5);
  });
  it("should support start", () => {
    let results = processPostOptions({} as any);
    expect(results.start).toBeUndefined();
    results = processPostOptions({ start: 11 } as any);
    expect(results.start).toEqual(11);
  });
  it("should support sortBy for allowed fields", () => {
    let results = processPostOptions({} as any);
    expect(results.sortBy).toBeUndefined();
    results = processPostOptions({ sortField: "body" } as any);
    expect(results.sortBy).toEqual(PostSort.BODY);
    results = processPostOptions({ sortField: "channelId" } as any);
    expect(results.sortBy).toEqual(PostSort.CHANNEL_ID);
    results = processPostOptions({ sortField: "created" } as any);
    expect(results.sortBy).toEqual(PostSort.CREATED_AT);
    results = processPostOptions({ sortField: "owner" } as any);
    expect(results.sortBy).toEqual(PostSort.CREATOR);
    results = processPostOptions({ sortField: "discussion" } as any);
    expect(results.sortBy).toEqual(PostSort.DISCUSSION);
    results = processPostOptions({ sortField: "editor" } as any);
    expect(results.sortBy).toEqual(PostSort.EDITOR);
    results = processPostOptions({ sortField: "id" } as any);
    expect(results.sortBy).toEqual(PostSort.ID);
    results = processPostOptions({ sortField: "parentId" } as any);
    expect(results.sortBy).toEqual(PostSort.PARENT_ID);
    results = processPostOptions({ sortField: "status" } as any);
    expect(results.sortBy).toEqual(PostSort.STATUS);
    results = processPostOptions({ sortField: "title" } as any);
    expect(results.sortBy).toEqual(PostSort.TITLE);
    results = processPostOptions({ sortField: "modified" } as any);
    expect(results.sortBy).toEqual(PostSort.UPDATED_AT);
  });
  it("should support explicit sortOrder only when provided and valid", () => {
    let results = processPostOptions({} as any);
    expect(results.sortOrder).toBeUndefined();
    results = processPostOptions({ sortOrder: "asc" } as any);
    expect(results.sortOrder).toEqual(SortOrder.ASC);
    results = processPostOptions({ sortOrder: "desc" } as any);
    expect(results.sortOrder).toEqual(SortOrder.DESC);
    results = processPostOptions({ sortOrder: "invalid" } as any);
    expect(results.sortOrder).toBeUndefined();
  });
});
