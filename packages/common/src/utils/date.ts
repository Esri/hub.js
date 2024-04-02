import { zonedTimeToUtc } from "date-fns-tz";

/**
 * A utility method to convert a number to a zero-padded (start) string of the given length
 * @param num The number to convert to a string and zero pad
 * @param length The length to zero-pad the number to
 * @returns a string padded with starting zeros
 */
export const zeroPadStart = (num: number, length: number) =>
  num.toString().padStart(length, "0");

/**
 * A utility method to aid in generating an ISO-8601 UTC date/time string from separate date & time
 * inputs for the given time zone.
 *
 *   getTimeZoneISOStringFromLocalDateTime('2024-03-29', '12:00:00', 'America/Los_Angeles')
 *     // => `2024-03-29T19:00:00.000Z` (3/29/2024 12:00pm pacific)
 * @param date A date string in the format of `2024-03-29`
 * @param time A time string in the format of `12:00:00`
 * @param timeZone An IANA time zone string, e.g. `America/Los_Angeles`
 * @returns an ISO-8601 UTC date/time string, e.g. `2024-03-29T19:00:00.000Z`
 */
export function getTimeZoneISOStringFromLocalDateTime(
  date: string,
  time: string,
  timeZone: string
): string {
  const timeZoneDateTime = zonedTimeToUtc([date, time].join(" "), timeZone);
  return timeZoneDateTime.toISOString();
}

/**
 * Attempts to guess the client's IANA time zone string
 * @returns an IANA time zone
 */
export function guessTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * A utility method to get a local time string in the format `13:00:00` from an ISO-8601 UTC date/time string
 * for the given time zone.
 *
 *   getLocalTime('2024-03-29T16:00:00.000Z', 'America/Los_Angeles')
 *     // => `09:00:00` (pacific)
 * @param date An ISO-8601 UTC date/time string, e.g. `2024-03-29T16:00:00.000Z`
 * @param timeZone An IANA time zone string, e.g. `America/Los_Angeles`
 * @returns a local time string, e.g. `12:00:00`
 */
export function getLocalTime(date: string, timeZone: string): string {
  const localDate = zonedTimeToUtc(date, timeZone);
  return [
    zeroPadStart(localDate.getHours(), 2),
    zeroPadStart(localDate.getMinutes(), 2),
    zeroPadStart(localDate.getSeconds(), 2),
  ].join(":");
}

/**
 * A utility method to get a local date string in the format `2024-04-03` from an ISO-8601 UTC date/time string
 * for the given time zone.
 *
 *   getLocalDate('2024-03-29T16:00:00.000Z', 'America/Los_Angeles')
 *     // => `2024-03-29` (pacific)
 * @param date An ISO-8601 UTC date/time string, e.g. `2024-03-29T16:00:00.000Z`
 * @param timeZone An IANA time zone string, e.g. `America/Los_Angeles`
 * @returns a local date string, e.g. `2024-03-29`
 */
export function getLocalDate(date: string, timeZone: string): string {
  const localDate = zonedTimeToUtc(date, timeZone);
  return [
    localDate.getFullYear(),
    zeroPadStart(localDate.getMonth() + 1, 2),
    zeroPadStart(localDate.getDate(), 2),
  ].join("-");
}
