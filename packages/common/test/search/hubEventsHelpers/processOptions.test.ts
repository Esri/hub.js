import {
  EventSort,
  SortOrder,
} from "../../../src/events/api/orval/api/orval-events";
import { processOptions } from "../../../src/search/_internal/hubEventsHelpers/processOptions";

describe("processOptions", () => {
  it("should process num", () => () => {
    expect(processOptions({})).toEqual({});
    expect(processOptions({ num: -1 })).toEqual({});
    expect(processOptions({ num: 2 })).toEqual({ num: "2" });
  });
  it("should process start", () => () => {
    expect(processOptions({})).toEqual({});
    expect(processOptions({ start: 0 })).toEqual({});
    expect(processOptions({ start: 2 })).toEqual({ start: "2" });
  });
  it("should process sortField", () => () => {
    expect(processOptions({})).toEqual({});
    expect(processOptions({ sortField: "created" })).toEqual({});
    expect(processOptions({ sortField: "created" })).toEqual({
      sortBy: "created" as EventSort,
    });
  });
  it("should process sortOrder", () => () => {
    expect(processOptions({})).toEqual({});
    expect(processOptions({ sortOrder: "desc" })).toEqual({});
    expect(processOptions({ sortOrder: "desc" })).toEqual({
      sortOrder: "desc" as SortOrder,
    });
  });
});
