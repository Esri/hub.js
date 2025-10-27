import {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { getDefaultEventDatesAndTimes } from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import * as getDatePickerDateUtils from "../../../src/utils/date/getDatePickerDate";
import * as getTimePickerTimeUtils from "../../../src/utils/date/getTimePickerTime";
import * as guessTimeZoneUtils from "../../../src/utils/date/guessTimeZone";

describe("getDefaultEventDatesAndTimes", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1711987200000));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return an object containing start & end dates & times and the timeZone", () => {
    const guessTimeZoneSpy = vi
      .spyOn(guessTimeZoneUtils, "guessTimeZone")
      .mockReturnValue("America/New_York");
    const getDatePickerDateSpy = vi
      .spyOn(getDatePickerDateUtils, "getDatePickerDate")
      .mockReturnValue("2024-04-01");
    const getTimePickerTimeUtilsSpy = vi
      .spyOn(getTimePickerTimeUtils, "getTimePickerTime")
      .mockImplementation((...args: any[]) =>
        args[0] === "2024-04-01T17:00:00.000Z" ? "13:00:00" : "14:00:00"
      );
    expect(getDefaultEventDatesAndTimes()).toEqual({
      startDate: "2024-04-01",
      endDate: "2024-04-01",
      startTime: "13:00:00",
      endTime: "14:00:00",
      startDateTime: new Date("2024-04-01T17:00:00.000Z"),
      endDateTime: new Date("2024-04-01T18:00:00.000Z"),
      timeZone: "America/New_York",
    });
    expect(guessTimeZoneSpy).toHaveBeenCalledTimes(1);
    expect(getDatePickerDateSpy).toHaveBeenCalledTimes(2);
    expect(getDatePickerDateSpy).toHaveBeenCalledWith(
      "2024-04-01T17:00:00.000Z",
      "America/New_York"
    );
    expect(getDatePickerDateSpy).toHaveBeenCalledWith(
      "2024-04-01T18:00:00.000Z",
      "America/New_York"
    );
    expect(getTimePickerTimeUtilsSpy).toHaveBeenCalledTimes(2);
    expect(getTimePickerTimeUtilsSpy).toHaveBeenCalledWith(
      "2024-04-01T17:00:00.000Z",
      "America/New_York"
    );
    expect(getTimePickerTimeUtilsSpy).toHaveBeenCalledWith(
      "2024-04-01T18:00:00.000Z",
      "America/New_York"
    );
  });
});
