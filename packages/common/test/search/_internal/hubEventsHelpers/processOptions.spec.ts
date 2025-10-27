import { describe, it, expect } from "vitest";
import {
  EventSort,
  EventSortOrder,
} from "../../../../src/events/api/orval/api/orval-events";
import { processOptions } from "../../../../src/search/_internal/hubEventsHelpers/processOptions";

describe("processOptions", () => {
  it("should process num", () => {
    expect(processOptions({})).toEqual({ sortOrder: EventSortOrder.asc });
    expect(processOptions({ num: -1 })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processOptions({ num: 2 })).toEqual({
      num: 2,
      sortOrder: EventSortOrder.asc,
    });
  });
  it("should process start", () => {
    expect(processOptions({})).toEqual({ sortOrder: EventSortOrder.asc });
    expect(processOptions({ start: 0 })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processOptions({ start: 2 })).toEqual({
      start: 2,
      sortOrder: EventSortOrder.asc,
    });
  });
  it("should process sortField", () => {
    expect(processOptions({})).toEqual({ sortOrder: EventSortOrder.asc });
    expect(processOptions({ sortField: "other" })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processOptions({ sortField: "created" })).toEqual({
      sortBy: EventSort.createdAt,
      sortOrder: EventSortOrder.asc,
    });
    expect(processOptions({ sortField: "modified" })).toEqual({
      sortBy: EventSort.updatedAt,
      sortOrder: EventSortOrder.asc,
    });
    expect(processOptions({ sortField: "title" })).toEqual({
      sortBy: EventSort.title,
      sortOrder: EventSortOrder.asc,
    });
    expect(processOptions({ sortField: "startDate" })).toEqual({
      sortBy: EventSort.startDateTime,
      sortOrder: EventSortOrder.asc,
    });
  });
  it("should process sortOrder", () => {
    expect(processOptions({ sortOrder: "desc" })).toEqual({
      sortOrder: EventSortOrder.desc,
    });
    expect(processOptions({ sortOrder: "asc" })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
  });
});
