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
    minute: "2-digit",
    second: "2-digit",
    timeZone: timeZone ?? guessTimeZone(),
    // see https://support.google.com/chrome/thread/29828561?hl=en
    // chrome computes the hour part as "24" for midnight while other browsers compute it as "00"
    // setting hourCycle to "h23" normalizes this across browser implementations
    // ts flags this property as an error, despite this working in chrome, ff & node envs
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hourCycle: "h23",
  }).formatToParts(new Date(date));
  return [parts[0].value, parts[2].value, parts[4].value].join(":");
}
