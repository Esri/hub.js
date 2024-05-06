import {
  EventSort,
  SortOrder,
} from "../../../../src/events/api/orval/api/orval-events";
import { processOptions } from "../../../../src/search/_internal/hubEventsHelpers/processOptions";

describe("processOptions", () => {
  it("should process num", () => {
    expect(processOptions({})).toEqual({ sortOrder: SortOrder.asc });
    expect(processOptions({ num: -1 })).toEqual({ sortOrder: SortOrder.asc });
    expect(processOptions({ num: 2 })).toEqual({
      num: "2",
      sortOrder: SortOrder.asc,
    });
  });
  it("should process start", () => {
    expect(processOptions({})).toEqual({ sortOrder: SortOrder.asc });
    expect(processOptions({ start: 0 })).toEqual({ sortOrder: SortOrder.asc });
    expect(processOptions({ start: 2 })).toEqual({
      start: "2",
      sortOrder: SortOrder.asc,
    });
  });
  it("should process sortField", () => {
    expect(processOptions({})).toEqual({ sortOrder: SortOrder.asc });
    expect(processOptions({ sortField: "other" })).toEqual({
      sortOrder: SortOrder.asc,
    });
    expect(processOptions({ sortField: "created" })).toEqual({
      sortBy: EventSort.createdAt,
      sortOrder: SortOrder.asc,
    });
    expect(processOptions({ sortField: "modified" })).toEqual({
      sortBy: EventSort.updatedAt,
      sortOrder: SortOrder.asc,
    });
    expect(processOptions({ sortField: "title" })).toEqual({
      sortBy: EventSort.title,
      sortOrder: SortOrder.asc,
    });
  });
  it("should process sortOrder", () => {
    expect(processOptions({ sortOrder: "desc" })).toEqual({
      sortOrder: SortOrder.desc,
    });
    expect(processOptions({ sortOrder: "asc" })).toEqual({
      sortOrder: SortOrder.asc,
    });
  });
});
