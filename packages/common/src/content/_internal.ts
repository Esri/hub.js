/**
 * Use this module for functions that do not need to be used by consumers (yet),
 * but may be shared between hub.js modules, and/or need to be tested
 * to get 100% coverage w/o writing cumbersome tests of higher level functions.
 *
 * Consuming will not be able to import these functions.
 *
 * It's probably a good pattern to add functions here first and then
 * move them to index.ts only when they are needed by a consumer.
 */
import {
  ILayerDefinition,
  IFeatureServiceDefinition,
} from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { ISpatialReference } from "@esri/arcgis-rest-types";
import { IHubContent } from "../core";
import {
  BBox,
  IHubGeography,
  GeographyProvenance,
  IHubRequestOptions,
} from "../types";
import { bBoxToPolygon, isBBox } from "../extent";
import { getFamily } from "./get-family";
import { getProp } from "../objects";

/**
 * Create a new content with updated boundary properties
 * @param content original content
 * @param boundary boundary provenance
 * @returns
 */
export const setContentBoundary = (
  content: IHubContent,
  boundary: GeographyProvenance
) => {
  // update content's item and boundary
  const properties = { ...(content.item.properties || {}), boundary };
  const item = { ...content.item, properties };
  const updated = { ...content, item };
  return { ...updated, boundary: getContentBoundary(item) };
};

// TODO: this needs to be able to handle "automatic"
export const getContentBoundary = (item: IItem): IHubGeography => {
  const extent = item.extent;
  const isValidItemExtent = isBBox(extent);
  // user specified provenance is stored in item.properties
  const provenance: GeographyProvenance =
    item.properties?.boundary ||
    // but we default to item if the item has an extent
    (isValidItemExtent ? "item" : undefined);
  let geometry;
  switch (provenance) {
    case "item":
      geometry = isValidItemExtent ? bBoxToPolygon(extent) : null;
      break;
    case "none":
      geometry = null;
      break;
    // TODO: handle other provenances
  }
  // TODO: derive and return center
  return {
    provenance,
    geometry,
  };
};

// when no request options are provided, the underlying
// request functions assume that we are online in production
// so we only want use enterprise logic if isPortal is explicitly defined
export const isPortal = (requestOptions?: IHubRequestOptions) => {
  return requestOptions && requestOptions.isPortal;
};

/**
 * Returns whether or not an item is a proxied csv
 *
 * @param item
 * @param requestOptions Hub Request Options (including whether we're in portal)
 * @returns
 */
export const isProxiedCSV = (
  item: IItem,
  requestOptions?: IHubRequestOptions
) =>
  !isPortal(requestOptions) &&
  item.access === "public" &&
  item.type === "CSV" &&
  item.size <= 5000000;

export const getHubRelativeUrl = (
  type: string,
  identifier: string,
  typeKeywords?: string[]
): string => {
  // solution types have their own logic
  let contentUrl = getSolutionUrl(type, identifier, typeKeywords);
  if (!contentUrl) {
    const family = getFamily(type);
    const familiesWithPluralizedRoute = [
      "app",
      "dataset",
      "document",
      "map",
      "template",
    ];
    // default to the catchall content route
    let path = "/content";
    if (family === "feedback") {
      // the exception
      path = "/feedback/surveys";
    } else if (isPageType(type)) {
      // pages are in the document family,
      // but instead of showing the page's metadata on /documents/about
      // but we render the page on the pages route
      path = "/pages";
    } else if (familiesWithPluralizedRoute.indexOf(family) > -1) {
      // the rule: route name is plural of family name
      path = `/${family}s`;
    }
    contentUrl = `${path}/${identifier}`;
  }
  return contentUrl;
};

export const isPageType = (type: string) =>
  ["Hub Page", "Site Page"].includes(type);

const getSolutionUrl = (
  type: string,
  identifier: string,
  typeKeywords?: string[]
): string => {
  let hubUrl;
  if (type === "Solution") {
    // NOTE: as per the above spreadsheet,
    // solution types are now in the Template family
    // but we don't send them to the route for initiative templates
    if (typeKeywords?.indexOf("Deployed") > 0) {
      // deployed solutions go to the generic content route
      hubUrl = `/content/${identifier}`;
    }
    // others go to the solution about route
    hubUrl = `/templates/${identifier}/about`;
  }
  return hubUrl;
};

// metadata
export interface IMetadataPaths {
  updateFrequency: string;
  metadataUpdateFrequency: string;
  metadataUpdatedDate: string;
  reviseDate: string;
  pubDate: string;
  createDate: string;
}

export function getMetadataPath(identifier: keyof IMetadataPaths) {
  // NOTE: i have verified that this will work regardless of the "Metadata Style" set on the org
  const metadataPaths: IMetadataPaths = {
    updateFrequency:
      "metadata.dataIdInfo.resMaint.maintFreq.MaintFreqCd.@_value",
    reviseDate: "metadata.dataIdInfo.idCitation.date.reviseDate",
    pubDate: "metadata.dataIdInfo.idCitation.date.pubDate",
    createDate: "metadata.dataIdInfo.idCitation.date.createDate",
    metadataUpdateFrequency: "metadata.mdMaint.maintFreq.MaintFreqCd.@_value",
    metadataUpdatedDate: "metadata.mdDateSt",
  };
  return metadataPaths[identifier];
}

export function getValueFromMetadata(
  metadata: any,
  identifier: keyof IMetadataPaths
) {
  const path = getMetadataPath(identifier);
  return path && getProp(metadata, path);
}

export enum DatePrecision {
  Year = "year",
  Month = "month",
  Day = "day",
  Time = "time",
}

/**
 * Parses an ISO8601 date string into a date and a precision.
 * This is because a) if somone entered 2018, we want to respect that and not treat it as the same as 2018-01-01
 * and b) you cannot naively call new Date with an ISO 8601 string that does not include time information
 * For example, when I, here in mountain time, do new Date('2018').getFullYear() I get "2017".
 * This is because when you do not provide time or timezone info, UTC is assumed, so new Date('2018') is 2018-01-01T00:00:00 in UTC
 * which is actually 7 hours earlier here in mountain time.
 *
 * @param {string} isoString
 * @return { date: Date, precision: DatePrecision }
 */
export function parseISODateString(isoString: string) {
  isoString = `${isoString}`;
  let date;
  let precision;
  if (/^\d{4}$/.test(isoString)) {
    // yyyy
    date = new Date(+isoString, 0, 1);
    precision = DatePrecision.Year;
  } else if (/^\d{4}-\d{1,2}$/.test(isoString)) {
    // yyyy-mm
    const parts = isoString.split("-");
    date = new Date(+parts[0], +parts[1] - 1, 1);
    precision = DatePrecision.Month;
  } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(isoString)) {
    // yyyy-mm-dd
    const parts = isoString.split("-");
    date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    precision = DatePrecision.Day;
  } else if (!Number.isNaN(Date.parse(isoString))) {
    // any other string parsable to a valid date
    date = new Date(isoString);
    precision = isoString.includes("T")
      ? DatePrecision.Time
      : DatePrecision.Day;
  }
  return date && precision && { date, precision };
}

export const getServerSpatialReference = (
  server: Partial<IFeatureServiceDefinition>,
  layer?: ILayerDefinition
) => {
  const layerSpatialReference = layer?.extent?.spatialReference;
  return layerSpatialReference || server?.spatialReference;
};

// NOTE: IItem has spatialRefernce: ISpatialReference, but
// the portal REST API returns spatialReference as as string
// that is always either WKID like "102100" or
// WKT like "NAD_1983_HARN_StatePlane_Hawaii_3_FIPS_5103_Feet"
// so we coerce those string into a ISpatialReference object
export const getItemSpatialReference = (item: IItem): ISpatialReference => {
  const spatialReference = item.spatialReference as unknown;
  if (!spatialReference || typeof spatialReference === "object") {
    // no need to try and transform this into an ISpatialReference
    return spatialReference;
  }
  // otherwise it _should_ be a string (if coming form the REST API)
  // but we force it in case it was set to a number somewhere outside of TS
  const spatialReferenceString = spatialReference + "";
  const wkid = parseInt(spatialReferenceString, 10);
  return isNaN(wkid)
    ? // string is not a number, assume it is WKT
      { wkt: spatialReferenceString }
    : //
      { wkid };
};
