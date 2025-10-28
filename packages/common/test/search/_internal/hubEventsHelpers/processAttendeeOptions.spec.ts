import { describe, it, expect } from "vitest";
import {
  RegistrationSort,
  EventSortOrder,
} from "../../../../src/events/api/orval/api/orval-events";
import { processAttendeeOptions } from "../../../../src/search/_internal/hubEventsHelpers/processAttendeeOptions";

describe("processAttendeeOptions", () => {
  it("should process num", () => {
    expect(processAttendeeOptions({})).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ num: -1 })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ num: 2 })).toEqual({
      num: "2",
      sortOrder: EventSortOrder.asc,
    });
  });
  it("should process start", () => {
    expect(processAttendeeOptions({})).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ start: 0 })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ start: 2 })).toEqual({
      start: "2",
      sortOrder: EventSortOrder.asc,
    });
  });
  it("should process sortField", () => {
    expect(processAttendeeOptions({})).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "other" })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "created" })).toEqual({
      sortBy: RegistrationSort.createdAt,
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "modified" })).toEqual({
      sortBy: RegistrationSort.updatedAt,
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "firstName" })).toEqual({
      sortBy: RegistrationSort.firstName,
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "lastName" })).toEqual({
      sortBy: RegistrationSort.lastName,
      sortOrder: EventSortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "username" })).toEqual({
      sortBy: RegistrationSort.username,
      sortOrder: EventSortOrder.asc,
    });
  });
  it("should process sortOrder", () => {
    expect(processAttendeeOptions({ sortOrder: "desc" })).toEqual({
      sortOrder: EventSortOrder.desc,
    });
    expect(processAttendeeOptions({ sortOrder: "asc" })).toEqual({
      sortOrder: EventSortOrder.asc,
    });
  });
});
