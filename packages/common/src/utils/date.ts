import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * A utility method to convert a number to a zero-padded (start) string of the given length
 * @param num The number to convert to a string and zero pad
 * @param length The length to zero-pad the number to
 * @returns a string optionally padded with starting zeros
 */
export const zeroPadStart = (num: number, length: number) =>
  num.toString().padStart(length, "0");

/**
 * A utility method to aid in generating an ISO-8601 UTC date/time string from separate date & time
 * inputs that lack locale specifics. By default, the resulting UTC string will reflect the time in
 * the client server or browser's system time. An optional IANA time zone can be provided to adjust
 * the resulting date/time string to reflect the given date & time in a specific time zone rather
 * than the client's own. E.g.
 *
 * For a user in the US Eastern time zone
 *   getTimeZoneISOStringFromLocalDateTime('2024-03-29', '12:00:00')
 *     // => `2024-03-29T16:00:00.000Z` (3/29/2024 12:00pm eastern)
 *   getTimeZoneISOStringFromLocalDateTime('2024-03-29', '12:00:00', 'America/Los_Angeles')
 *     // => `2024-03-29T19:00:00.000Z` (3/29/2024 12:00pm pacific)
 * @param date A date string in the format of `2024-03-29`
 * @param time A time string in the format of `12:00:00`
 * @param timeZone An optional IANA time zone string, e.g. `America/Los_Angeles`
 * @returns an ISO-8601 UTC date/time string, e.g. `2024-03-29T19:00:00.000Z`
 */
export function getTimeZoneISOStringFromLocalDateTime(
  date: string,
  time: string,
  timeZone?: string
): string {
  const timeZoneDateTime = dayjs.tz([date, time].join(" "), timeZone);
  return timeZoneDateTime.toISOString();
}

/**
 * Attempts to guess the client's IANA time zone string
 * @returns an IANA time zone
 */
export function guessTimeZone(): string {
  return dayjs.tz.guess();
}

/**
 * A utility method to get a local time string in the format `13:00:00` from an ISO-8601 UTC date/time string.
 * By default, the resulting time string will reflect the time in the client server or browser's system time.
 * An optional IANA time zone can be provided to adjust the resulting time string to reflect the time in a
 * specific time zone rather than the client's own. E.g.
 *
 * For a user in the US Eastern time zone
 *   getLocalTime('2024-03-29T16:00:00.000Z')
 *     // => `12:00:00` (eastern)
 *   getLocalTime('2024-03-29T16:00:00.000Z', 'America/Los_Angeles')
 *     // => `9:00:00` (pacific)
 * @param date An ISO-8601 UTC date/time string, e.g. `2024-03-29T16:00:00.000Z`
 * @param timeZone An optional IANA time zone string, e.g. `America/Los_Angeles`
 * @returns a local time string, e.g. `12:00:00`
 */
export function getLocalTime(date: string, timeZone?: string): string {
  const localDate = dayjs.tz(date, timeZone);
  return [
    zeroPadStart(localDate.hour(), 2),
    zeroPadStart(localDate.minute(), 2),
    zeroPadStart(localDate.second(), 2),
  ].join(":");
}

/**
 * A utility method to get a local date string in the format `2024-04-03` from an ISO-8601 UTC date/time string.
 * By default, the resulting date string will reflect the date in the client server or browser's system time.
 * An optional IANA time zone can be provided to adjust the resulting date string to reflect the date in a
 * specific time zone rather than the client's own. E.g.
 *
 * For a user in the US Eastern time zone
 *   getLocalDate('2024-03-29T16:00:00.000Z')
 *     // => `2024-03-29` (eastern)
 *   getLocalDate('2024-03-29T16:00:00.000Z', 'America/Los_Angeles')
 *     // => `2024-03-29` (pacific)
 * @param date An ISO-8601 UTC date/time string, e.g. `2024-03-29T16:00:00.000Z`
 * @param timeZone An optional IANA time zone string, e.g. `America/Los_Angeles`
 * @returns a local date string, e.g. `2024-03-29`
 */
export function getLocalDate(date: string, timeZone?: string): string {
  const localDate = dayjs.tz(date, timeZone);
  return [
    localDate.year(),
    zeroPadStart(localDate.month() + 1, 2),
    zeroPadStart(localDate.date(), 2),
  ].join("-");
}
