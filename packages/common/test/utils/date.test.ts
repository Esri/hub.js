import {
  getTimeZoneISOStringFromLocalDateTime,
  guessTimeZone,
  getLocalDate,
  getLocalTime,
} from "../../src";

describe("date", () => {
  describe("getTimeZoneISOStringFromLocalDateTime", () => {
    it("it returns the expected UTC strings", () => {
      // daylight savings
      expect(
        getTimeZoneISOStringFromLocalDateTime(
          "2024-03-29",
          "12:00:00",
          "America/Los_Angeles"
        )
      ).toEqual("2024-03-29T19:00:00.000Z");

      // standard time
      expect(
        getTimeZoneISOStringFromLocalDateTime(
          "2024-11-15",
          "12:00:00",
          "America/Los_Angeles"
        )
      ).toEqual("2024-11-15T20:00:00.000Z");
    });
  });

  describe("guessTimeZone", () => {
    it("returns an IANA timezone string", () => {
      expect(guessTimeZone()).toEqual(jasmine.any(String));
    });
  });

  describe("getLocalDate", () => {
    it("should return a date", () => {
      expect(
        getLocalDate("2024-03-29T16:00:00.000Z", "America/Los_Angeles")
      ).toEqual("2024-03-29");
    });
  });

  describe("getLocalTime", () => {
    it("should return a date", () => {
      expect(
        getLocalTime("2024-03-29T16:00:00.000Z", "America/Los_Angeles")
      ).toEqual("15:00:00");
    });
  });
});
