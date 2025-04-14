import {
  isNoCorsRequestRequired,
  sendNoCorsRequest,
} from "@esri/arcgis-rest-request";

/**
 * Given a url to an image, return it as a blob
 * @param {String} url Url to fetch the image from. Must have token if it's a non-publi item resource url
 * @param {Object} options additional optinos
 */
export async function fetchImageAsBlob(
  url: string,
  options: RequestInit = {}
): Promise<Blob> {
  if (!options.credentials) {
    options.credentials = "same-origin";
  }

  /* istanbul ignore next */
  if (isNoCorsRequestRequired(url)) {
    await sendNoCorsRequest(url);
  }
  // We use fetch intentionally as the url may or may not be for an item url, so we don't
  // want this to run thru the main request logic
  return fetch(url, options).then((response) => {
    return response.blob();
  });
}
