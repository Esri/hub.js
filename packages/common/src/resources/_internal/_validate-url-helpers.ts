import {
  IExtent,
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-types";
import { ItemType } from "../../types";
import { Logger } from "../../utils";

const FEATURE_SERVICE_URL_REGEX = /(feature)server(\/|\/(\d+))?$/i;
const SERVICE_URL_REGEX = /\/[a-zA-Z]+server(\/|\/(\d+))?$/i;

/**
 * Feature service / Doc Links Should not have data urls. Let"s exclude them from that.
 *
 * @export
 * @param {string} itemType What type of item is it?
 * @return {*}  {boolean}
 */
export function shouldHaveDataUrl(itemType: string): boolean {
  // Specifically we want to avoid FS / DL from having a data url.
  return !["Feature Service", "Document Link"].includes(itemType);
}

/**
 * Get the file name out of a url. Will return either the
 * hostname, or the pathname if it exists
 *
 * @export
 * @param {string} url Url to get a file name out of
 * @return {*}  {string}
 */
export function getFileName(url: string): string {
  let filename: string;

  try {
    const parsed = new URL(url);

    // If the URL pathname exists, return its last segment,
    // otherwise return the hostname
    filename =
      parsed.pathname !== "/"
        ? parsed.pathname.split("/").pop()
        : parsed.hostname;
  } catch (e) {
    throw new Error(`Error getting file name from data url`);
  }

  return filename;
}

/**
 * Is this a valid url?
 *
 * @param {string} url Url to validate
 * @return {*}  {boolean}
 */
export function isUrl(url: string): boolean {
  // Use try / catch as a simple string "test" will cause new URL() to throw an error.
  try {
    const result = new URL(url);
    // Cast to bool.
    return !!result;
  } catch (e) {
    Logger.error(`Error parsing URL`);
    return false;
  }
}

/**
 * Tests if url string is a feature service / layer.
 *
 * @param {string} url URL to test
 * @return {*}  {boolean}
 */
export function isFeatureService(url: string): boolean {
  return FEATURE_SERVICE_URL_REGEX.test(url);
}

/**
 * Tests if url string is a service (map, feature, image, etc)
 *
 * @param {string} url Url to test
 * @return {*}  {boolean}
 */
export function isService(url: string): boolean {
  return SERVICE_URL_REGEX.test(url);
}

/**
 * Is the service a feature service AND is it a layer specifically
 *
 * @param {string} url
 * @return {*}  {boolean}
 */
export function isFeatureLayer(url: string): boolean {
  const results = url.match(FEATURE_SERVICE_URL_REGEX);
  return results && !!results[3];
}

/**
 * Gets item title from url as a fall back
 *
 * @param {string} url item url
 * @return {*}  {string}
 */
export function getFeatureServiceTitle(url: string): string {
  return url.match(/\/services\/(.+)\/(feature|map|image)server/i)[1];
}

/**
 * Gets item info out of a feature layer item.
 *
 * @export
 * @param url Item URL
 * @param body Item body.
 * @return Item info (title, description, extent, url)
 */
export function getFeatureLayerItem(
  url: string,
  body: Partial<ILayerDefinition>
): {
  title: string;
  description: string;
  extent: IExtent;
  url: string;
} {
  return {
    title: body.name,
    description: body.description,
    extent: body.extent,
    url,
  };
}

/**
 * Gets item info out of a feature service response (which is not a specific layer)
 *
 * @export
 * @param {*} url
 * @param {*} body
 * @return {*}
 */
export function getFeatureServiceItem(
  url: string,
  body: Partial<IFeatureServiceDefinition>
): {
  title: string;
  description: string;
  extent: IExtent;
  url: string;
} {
  const description = body.serviceDescription || body.description;
  const title = getFeatureServiceTitle(url);
  const extent: IExtent = body.fullExtent || body.initialExtent;

  return { title, description, extent, url };
}

/**
 * Ping a non FS url and return response status && headers
 *
 * @export
 * @param {string} url Non FS URL
 * @return {*}  {Promise<{ ok: boolean, headers: Headers }>}
 */
export async function pingUrl(
  url: string
): Promise<{ ok: boolean; headers?: Headers }> {
  const response = await fetch(url, { method: "HEAD" });

  return {
    ok: response.ok,
    headers: response.headers,
  };
}

/**
 * Ping a FS URL and handle matters such as "hidden" success failures.
 *
 * @export
 * @param {string} url
 * @return {*}  {Promise<{ ok: boolean, item?: any }>}
 */
export async function pingFeatureService(
  url: string
): Promise<{ ok: boolean; item?: any }> {
  // make sure the response is in json format
  const parsed = new URL(url);
  parsed.searchParams.set("f", "json");

  // Since the feature service can return a 200 response with error (e.g. for
  // non-existing layer), we can only request the full metadata by a GET, not HEAD
  // request
  const response = await fetch(parsed.href);

  if (!response.ok) {
    return { ok: false };
  }

  const body = await response.json();

  // Exit if the request returns an error
  if (body.error) {
    return { ok: false };
  }

  const getItem = isFeatureLayer(url)
    ? getFeatureLayerItem
    : getFeatureServiceItem;
  const item = getItem(url, body);

  return {
    ok: true,
    item,
  };
}

export function detectDataTypeFromHeader(headers: Headers): ItemType {
  let contentType = headers.get("Content-Type");
  let dataType: ItemType;

  if (!contentType) {
    return;
  }
  // Only get the "media-type"
  contentType = contentType.split(";").shift();

  if (contentType === "text/csv") {
    dataType = ItemType.CSV;
  } else if (
    contentType === "application/vnd.ms-excel" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    dataType = ItemType["Microsoft Excel"];
  } else if (contentType === "application/pdf") {
    dataType = ItemType.PDF;
  } else if (
    contentType === "image/jpeg" ||
    contentType === "image/jpg" ||
    contentType === "image/png"
  ) {
    dataType = ItemType.Image;
  } else if (contentType === "application/geo+json") {
    dataType = ItemType.GeoJson;
  }
  return dataType;
}

export function detectDataTypeFromExtension(url: string): ItemType {
  const contentType = url.toLowerCase().split(".").pop();
  let dataType;

  if (contentType === "csv") {
    dataType = ItemType.CSV;
  } else if (contentType === "xls" || contentType === "xlsx") {
    dataType = ItemType["Microsoft Excel"];
  } else if (contentType === "pdf") {
    dataType = ItemType.PDF;
  } else if (
    contentType === "jpeg" ||
    contentType === "jpg" ||
    contentType === "png"
  ) {
    dataType = ItemType.Image;
  } else if (contentType === "geojson") {
    dataType = ItemType.GeoJson;
  }
  return dataType;
}
