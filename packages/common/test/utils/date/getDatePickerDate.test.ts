import * as guessTimeZoneUtils from "../../../src/utils/date/guessTimeZone";
import { getDatePickerDate } from "../../../src/utils/date/getDatePickerDate";

describe("getDatePickerDate", () => {
  it("should return a date string in the format YYYY-mm-dd", () => {
    const guessTimeZoneSpy = spyOn(guessTimeZoneUtils, "guessTimeZone");
    expect(
      getDatePickerDate("2024-03-29T17:00:00.000Z", "America/New_York")
    ).toEqual("2024-03-29");
    expect(
      getDatePickerDate("2024-03-29T17:00:00.000Z", "America/Los_Angeles")
    ).toEqual("2024-03-29");
    expect(guessTimeZoneSpy).not.toHaveBeenCalled();
    expect(getDatePickerDate("2024-03-29T17:00:00.000Z")).toEqual("2024-03-29");
    expect(guessTimeZoneSpy).toHaveBeenCalledTimes(1);
  });
});
