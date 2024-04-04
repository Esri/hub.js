/**
 * Attempts to guess the client's IANA time zone string
 * @returns an IANA time zone
 */
export function guessTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
