import { ChannelSort, SortOrder } from "../../../../src/discussions/api/types";
import { processChannelOptions } from "../../../../src/search/_internal/hubDiscussionsHelpers/processChannelOptions";

describe("processChannelOptions", () => {
  it("should support num", () => {
    let results = processChannelOptions({});
    expect(results.num).toBeUndefined();
    results = processChannelOptions({ num: 5 });
    expect(results.num).toEqual(5);
  });
  it("should support start", () => {
    let results = processChannelOptions({});
    expect(results.start).toBeUndefined();
    results = processChannelOptions({ start: 11 });
    expect(results.start).toEqual(11);
  });
  it("should support sortBy", () => {
    let results = processChannelOptions({});
    expect(results.sortBy).toBeUndefined();
    results = processChannelOptions({ sortField: "access" });
    expect(results.sortBy).toEqual(ChannelSort.ACCESS);
    results = processChannelOptions({ sortField: "created" });
    expect(results.sortBy).toEqual(ChannelSort.CREATED_AT);
    results = processChannelOptions({ sortField: "modified" });
    expect(results.sortBy).toEqual(ChannelSort.UPDATED_AT);
    results = processChannelOptions({ sortField: "owner" });
    expect(results.sortBy).toEqual(ChannelSort.CREATOR);
  });
  it("should support sortOrder", () => {
    let results = processChannelOptions({});
    expect(results.sortOrder).toBeUndefined();
    results = processChannelOptions({ sortOrder: "asc" });
    expect(results.sortOrder).toEqual(SortOrder.ASC);
    results = processChannelOptions({ sortOrder: "desc" });
    expect(results.sortOrder).toEqual(SortOrder.DESC);
  });
});
