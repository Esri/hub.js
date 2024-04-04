import * as guessTimeZoneUtils from "../../../src/utils/date/guessTimeZone";
import { getTimePickerTime } from "../../../src/utils/date/getTimePickerTime";

describe("getTimePickerTime", () => {
  it("should return a time string in 24-hour format", () => {
    const guessTimeZoneSpy = spyOn(
      guessTimeZoneUtils,
      "guessTimeZone"
    ).and.returnValue("America/Denver");
    expect(
      getTimePickerTime("2024-03-29T17:00:00.000Z", "America/New_York")
    ).toEqual("13:00:00");
    expect(
      getTimePickerTime("2024-03-29T17:00:00.000Z", "America/Los_Angeles")
    ).toEqual("10:00:00");
    expect(guessTimeZoneSpy).not.toHaveBeenCalled();
    expect(getTimePickerTime("2024-03-29T17:00:00.000Z")).toEqual("11:00:00");
    expect(guessTimeZoneSpy).toHaveBeenCalledTimes(1);
  });
});
