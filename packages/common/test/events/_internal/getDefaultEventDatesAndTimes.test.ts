import { getDefaultEventDatesAndTimes } from "../../../src/events/_internal/getDefaultEventDatesAndTimes";
import * as dateUtils from "../../../src/utils/date";

describe("getDefaultEventDatesAndTimes", () => {
  beforeAll(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(1711987200000));
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it("should return an object containing start & end dates & times and the timeZone", () => {
    const guessTimeZoneSpy = spyOn(dateUtils, "guessTimeZone").and.returnValue(
      "America/New_York"
    );
    const getLocalDateSpy = spyOn(dateUtils, "getLocalDate").and.returnValue(
      "2024-04-01"
    );
    const getLocalTimeSpy = spyOn(dateUtils, "getLocalTime").and.callFake(
      (arg: string) =>
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
    expect(getLocalDateSpy).toHaveBeenCalledTimes(2);
    expect(getLocalDateSpy).toHaveBeenCalledWith(
      "2024-04-01T17:00:00.000Z",
      "America/New_York"
    );
    expect(getLocalDateSpy).toHaveBeenCalledWith(
      "2024-04-01T18:00:00.000Z",
      "America/New_York"
    );
    expect(getLocalTimeSpy).toHaveBeenCalledTimes(2);
    expect(getLocalTimeSpy).toHaveBeenCalledWith(
      "2024-04-01T17:00:00.000Z",
      "America/New_York"
    );
    expect(getLocalTimeSpy).toHaveBeenCalledWith(
      "2024-04-01T18:00:00.000Z",
      "America/New_York"
    );
  });
});
