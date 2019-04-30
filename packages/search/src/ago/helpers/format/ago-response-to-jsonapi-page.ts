/*
 * This util function take in a JSON object response from /sharing/rest/search
 * and return JSONAPI-format page parameters
 *
 * example AGO API response
 * {
 *   nextStart: 31,
 *   num: 10,
 *   query: '(group:aa9b3013b77141cca147ac540139b353 OR group:3b8014ff38a9422ea99303979fa4d539)',
 *   results: [ array of items ],
 *   start: 21,
 *   total: 147
 * }
 *
 * should return =>
 * {
 *   number: 3,
 *   size: 10
 * }
 */

export function convertAgoPages(
  response: any
): { number: number; size: number } {
  return {
    number: Math.floor(response.start / response.num) + 1,
    size: response.num
  };
}
