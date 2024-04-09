import { getDefaultEventDatesAndTimes } from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import * as getDatePickerDateUtils from "../../../src/utils/date/getDatePickerDate";
import * as getTimePickerTimeUtils from "../../../src/utils/date/getTimePickerTime";
import * as guessTimeZoneUtils from "../../../src/utils/date/guessTimeZone";

describe("getDefaultEventDatesAndTimes", () => {
  beforeAll(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(1711987200000));
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it("should return an object containing start & end dates & times and the timeZone", () => {
    const guessTimeZoneSpy = spyOn(
      guessTimeZoneUtils,
      "guessTimeZone"
    ).and.returnValue("America/New_York");
    const getDatePickerDateSpy = spyOn(
      getDatePickerDateUtils,
      "getDatePickerDate"
    ).and.returnValue("2024-04-01");
    const getTimePickerTimeUtilsSpy = spyOn(
      getTimePickerTimeUtils,
      "getTimePickerTime"
    ).and.callFake((arg: string) =>
      arg === "2024-04-01T17:00:00.000Z" ? "13:00:00" : "14:00:00"
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
