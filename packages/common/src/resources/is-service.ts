const SERVICE_URL_REGEX = /\/[a-zA-Z]+server(\/|\/(\d+))?$/i;

/**
 * Tests if url string is a service (map, feature, image, etc)
 *
 * @param {string} url Url to test
 * @return {*}  {boolean}
 */
export function isService(url: string): boolean {
  return SERVICE_URL_REGEX.test(url);
}
