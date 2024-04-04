import { guessTimeZone } from "../date/guessTimeZone";

/**
 * A utility method to get a date-picker date string in the format `2024-04-03` from a Date object, timestamp in ms,
 * or a valid date/time string. By default, the date string will reflect the client's local date for the provided date.
 * An optional IANA timeZone string can be provided to adjust the resulting date string to reflect the local date
 * in the provided timeZone at that point in time.
 *
 *   getDatePickerDate('2024-03-29T16:00:00.000Z', 'America/New_York')
 *     // => `2024-03-29` (eastern)
 *
 *   getDatePickerDate('2024-03-29T16:00:00.000Z', 'America/Los_Angeles')
 *     // => `2024-03-29` (pacific)
 *
 * @param date A Date object, timestamp in ms, or valid date/time string (e.g. `2024-03-29T16:00:00.000Z`)
 * @param timeZone An optional IANA time zone string, e.g. `America/Los_Angeles`
 * @returns a date-picker date string, e.g. `2024-03-29`
 */
export function getDatePickerDate(
  date: string | number | Date,
  timeZone?: string
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timeZone ?? guessTimeZone(),
  }).formatToParts(new Date(date));
  return [parts[4].value, parts[0].value, parts[2].value].join("-");
}
