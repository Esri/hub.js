/**
 * @private
 * A utility method to aid in generating an ISO-8601 UTC date/time string from separate date & time
 * inputs for the client's current locale.
 *
 *   // a user in the America/New_York timeZone
 *   getTimeZoneISOStringFromLocalDateTime('2024-03-29', '13:00:00')
 *     // => `2024-03-29T17:00:00.000Z`
 *
 *   // a user in America/Los_Angeles timeZone
 *   getTimeZoneISOStringFromLocalDateTime('2024-03-29', '13:00:00')
 *     // => `2024-03-29T20:00:00.000Z`
 *
 * @param date A date string in the format of `2024-03-29`
 * @param time A time string in 24-hour format of `13:00:00`
 * @returns an ISO-8601 UTC date/time string, e.g. `2024-03-29T16:00:00.000Z`
 */
export function getISOStringFromClientDateTime(
  date: string,
  time: string
): string {
  const [yr, mon, day] = date
    .split("-")
    .map((segment) => parseInt(segment, 10));
  const [hr, min, sec] = time
    .split(":")
    .map((segment) => parseInt(segment, 10));
  const timeZoneDateTime = new Date(yr, mon - 1, day, hr, min, sec, 0);
  return timeZoneDateTime.toISOString();
}
