import { guessTimeZone } from "../date/guessTimeZone";

/**
 * A utility method to get a time-picker time string in 24-hour format from a Date object, timestamp in ms, or a
 * valid date/time string. By default, the time string will reflect the client's local time for the provided date.
 * An optional IANA timeZone string can be provided to adjust the resulting time string to reflect the local time
 * in the provided timeZone at that point in time.
 *
 *   getTimePickerTime('2024-03-29T17:00:00.000Z', 'America/New_York')
 *     // => `13:00:00` (eastern)
 *
 *   getTimePickerTime('2024-03-29T17:00:00.000Z', 'America/Los_Angeles')
 *     // => `10:00:00` (pacific)
 *
 * @param date A Date object, timestamp in ms, or valid date/time string (e.g. `2024-03-29T16:00:00.000Z`)
 * @param timeZone An optional IANA time zone string, e.g. `America/Los_Angeles`
 * @returns a time-picker time string in 24-hour format, e.g. `13:00:00`
 */
export function getTimePickerTime(
  date: string | number | Date,
  timeZone?: string
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
    timeZone: timeZone ?? guessTimeZone(),
  }).formatToParts(new Date(date));
  return [
    // as of 4/4/2024, FF 124.0.2 and Chrome 123.0.6312.87 for macos return different values for the hour part for midnight...
    // Specifically, Chrome returns "24" while FF returns "00", so we coerce "24" to "00" as that works with the time-picker
    // in both browsers.
    parts[0].value === "24" ? "00" : parts[0].value,
    parts[2].value,
    parts[4].value,
  ].join(":");
}
