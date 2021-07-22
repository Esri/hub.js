/**
 * Parse a response object, and throw if it contains an error.
 * Just a wrapper to hide some platform idiosyncracies
 * @param {Response} response Response object to parse
 * @private
 */
export async function _checkStatusAndParseJson(
  response: Response
): Promise<any> {
  if (response.status >= 200 && response.status < 300) {
    // don't try to parse the body if it's empty
    // if (response.body) { // the fetch polyfill for IE... does not expose a body property... :(
    return response.json();
    // }
  } else {
    // we're gonna throw, but we need to construct the error
    return response.json().then((json) => {
      if (json.error) {
        const error = new Error(
          `${json.error.title} :: ${json.error.detail} :: ${response.status}`
        );
        throw error;
      } else {
        throw new Error(`Got ${response.status} ${response.statusText}`);
      }
    });
  }
}
