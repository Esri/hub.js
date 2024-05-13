import {
  EventSort,
  RegistrationSort,
  SortOrder,
} from "../../../../src/events/api/orval/api/orval-events";
import { processAttendeeOptions } from "../../../../src/search/_internal/hubEventsHelpers/processAttendeeOptions";

describe("processAttendeeOptions", () => {
  it("should process num", () => {
    expect(processAttendeeOptions({})).toEqual({ sortOrder: SortOrder.asc });
    expect(processAttendeeOptions({ num: -1 })).toEqual({
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ num: 2 })).toEqual({
      num: "2",
      sortOrder: SortOrder.asc,
    });
  });
  it("should process start", () => {
    expect(processAttendeeOptions({})).toEqual({ sortOrder: SortOrder.asc });
    expect(processAttendeeOptions({ start: 0 })).toEqual({
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ start: 2 })).toEqual({
      start: "2",
      sortOrder: SortOrder.asc,
    });
  });
  it("should process sortField", () => {
    expect(processAttendeeOptions({})).toEqual({ sortOrder: SortOrder.asc });
    expect(processAttendeeOptions({ sortField: "other" })).toEqual({
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "created" })).toEqual({
      sortBy: RegistrationSort.createdAt,
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "modified" })).toEqual({
      sortBy: RegistrationSort.updatedAt,
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "firstName" })).toEqual({
      sortBy: RegistrationSort.firstName,
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "lastName" })).toEqual({
      sortBy: RegistrationSort.lastName,
      sortOrder: SortOrder.asc,
    });
    expect(processAttendeeOptions({ sortField: "username" })).toEqual({
      sortBy: RegistrationSort.username,
      sortOrder: SortOrder.asc,
    });
  });
  it("should process sortOrder", () => {
    expect(processAttendeeOptions({ sortOrder: "desc" })).toEqual({
      sortOrder: SortOrder.desc,
    });
    expect(processAttendeeOptions({ sortOrder: "asc" })).toEqual({
      sortOrder: SortOrder.asc,
    });
  });
});
