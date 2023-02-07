/**
 * Converts an object with simple key value pairs into a query string
 *
 * @param queryParams hash to transform into a query string
 * @returns query string
 */
export function getQueryString(queryParams: Record<string, any>) {
  const result = Object.entries(queryParams)
    .filter(([_key, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return result && `?${result}`;
}
