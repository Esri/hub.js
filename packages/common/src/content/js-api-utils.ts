// ALL taken from js-api
// -- utils: https://devtopia.esri.com/WebGIS/arcgis-js-api/blob/7b493793958948a2b32eb53ef6c7e4b355d0f74d/esri/core/urlUtils.ts
// -- isHostedAgolService: https://devtopia.esri.com/WebGIS/arcgis-js-api/blob/7b493793958948a2b32eb53ef6c7e4b355d0f74d/esri/layers/support/arcgisLayerUrl.ts#L158-L177
const protocolRegex = /^\s*[a-z][a-z0-9-+.]*:(?![0-9])/i;

/**
 * Get the origin of a URL
 * @param url the URL to get the origin from
 * @returns the origin of the URL
 */
export function getOrigin(
  url: string,
  removeProtocolAndSlashes = false
): string | null {
  if (url == null || isBlobProtocol(url) || isDataProtocol(url)) {
    return null;
  }

  let protocolEndPos = url.indexOf("://");

  if (protocolEndPos === -1 && isProtocolRelative(url)) {
    protocolEndPos = 2;
  } else if (protocolEndPos !== -1) {
    protocolEndPos += 3;
  } else {
    return null;
  }

  const originEndPos = url.indexOf("/", protocolEndPos);

  if (originEndPos !== -1) {
    url = url.slice(0, originEndPos);
  }

  if (removeProtocolAndSlashes) {
    url = removeProtocol(url, true);
  }

  return url;
}

/**
 * Tests whether a url uses the blob protocol.
 *
 * This will test positive if the url starts with blob:.
 *
 * @param {string} url - the url to test.
 *
 * @ignore
 *
 * @return {boolean} true if the url uses the blob protocol, false otherwise.
 */
export function isBlobProtocol(url: string): boolean {
  // NOTE: .slice seems to be fastest generally
  return url != null && url.slice(0, 5) === "blob:";
}

/**
 * Tests whether a url uses the data protocol.
 *
 * This will test positive if the url starts with data:.
 *
 * @param {string} url - the url to test.
 *
 * @ignore
 *
 * @return {boolean} true if the url uses the data protocol, false otherwise.
 */
export function isDataProtocol(url: string): boolean {
  // NOTE: .slice seems to be fastest generally
  return url != null && url.slice(0, 5) === "data:";
}

/**
 * Tests whether a url is a protocol relative url (//static.arcgis.com).
 *
 * @param {string} url - the url to test.
 *
 * @ignore
 *
 * @return {boolean} true if the url is a protocol relative url, false otherwise.
 */
export function isProtocolRelative(url: string): boolean {
  return url != null && url[0] === "/" && url[1] === "/";
}

/**
 * Remove the protocol from the url.
 *
 * @param {string} url - the url.
 * @param {boolean} [removeLeadingSlashes] - remove `//` if true
 *
 * @ignore
 *
 * @return {string} the url without its protocol.
 */
function removeProtocol(url: string, removeLeadingSlashes = false): string {
  if (isProtocolRelative(url)) {
    return url.slice(2);
  }
  url = url.replace(protocolRegex, "");

  if (
    removeLeadingSlashes &&
    url.length > 1 &&
    url[0] === "/" &&
    url[1] === "/"
  ) {
    url = url.slice(2);
  }

  return url;
}

// stolen from js-api -- https://devtopia.esri.com/WebGIS/arcgis-js-api/blob/7b493793958948a2b32eb53ef6c7e4b355d0f74d/esri/layers/support/arcgisLayerUrl.ts#L158-L177
// no tests needed for this
export function isHostedAgolService(url: string): boolean {
  let origin = getOrigin(url, true); // -> www.esri.com

  if (!origin) {
    return false;
  }

  origin = origin.toLowerCase();

  // unfortunately, when a service is proxied and requires credentials, we have no way of knowing if it's hosted or not
  // ... meaning that we are returning false for all services that are proxied
  return (
    origin.endsWith(".arcgis.com") &&
    (origin.startsWith("services") ||
      origin.startsWith("tiles") ||
      origin.startsWith("features"))
  );
}
