import * as guessTimeZoneUtils from "../../../src/utils/date/guessTimeZone";
import { getTimePickerTime } from "../../../src/utils/date/getTimePickerTime";

fdescribe("getTimePickerTime", () => {
  it("should return a time string in 24-hour format", () => {
    const guessTimeZoneSpy = spyOn(
      guessTimeZoneUtils,
      "guessTimeZone"
    ).and.returnValue("America/Denver");
    expect(
      getTimePickerTime("2024-03-29T17:00:00.000Z", "America/New_York")
    ).toEqual("13:00:00");
    expect(
      getTimePickerTime("2025-01-31T05:00:00.000Z", "America/New_York")
    ).toEqual("00:00:00");
    expect(
      getTimePickerTime("2025-02-01T04:59:59.000Z", "America/New_York")
    ).toEqual("23:59:59");
    expect(
      getTimePickerTime("2024-03-29T17:00:00.000Z", "America/Los_Angeles")
    ).toEqual("10:00:00");
    expect(guessTimeZoneSpy).not.toHaveBeenCalled();
    expect(getTimePickerTime("2024-03-29T17:00:00.000Z")).toEqual("11:00:00");
    expect(guessTimeZoneSpy).toHaveBeenCalledTimes(1);
  });

  // see my note in getTimePickerTime. Firefox and Chrome return different values for the hour for midnight.
  // specifically, FF returns "00" while Chrome returns "24". without this test, chrome computes 100% test
  // coverage, while FF computes < 100% test coverage. this sures things up so tests pass in CI
  it("should coerce an hour value of 24 to 00", () => {
    const formatToPartsSpy = spyOn(
      Intl.DateTimeFormat.prototype,
      "formatToParts"
    ).and.returnValue([
      { type: "hour", value: "24" },
      { type: "literal", value: ":" },
      { type: "minute", value: "00" },
      { type: "literal", value: ":" },
      { type: "second", value: "00" },
    ]);
    expect(
      getTimePickerTime("2025-01-31T05:00:00.000Z", "America/New_York")
    ).toEqual("00:00:00");
    expect(formatToPartsSpy).toHaveBeenCalledTimes(1);
    expect(formatToPartsSpy).toHaveBeenCalledWith(jasmine.any(Date));
  });
});
