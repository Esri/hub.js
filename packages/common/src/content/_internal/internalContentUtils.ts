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
import { parseServiceUrl } from "@esri/arcgis-rest-feature-layer";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";
import {
  IExtent,
  ILayerDefinition,
  ISpatialReference,
  IUser,
} from "@esri/arcgis-rest-types";
import { IHubContent, IHubLocation, PublisherSource } from "../../core";
import {
  IHubGeography,
  GeographyProvenance,
  IHubRequestOptions,
} from "../../types";
import {
  GeoJSONPolygonToBBox,
  allCoordinatesPossiblyWGS84,
  bBoxToExtent,
  extentToBBox,
  extentToPolygon,
  getExtentCenter,
  isBBox,
} from "../../extent";
import { getFamily } from "../get-family";
import { getProp } from "../../objects";
import { IHubAdditionalResource } from "../../core/types/IHubAdditionalResource";
import { getItemHomeUrl, getPortalUrl } from "../../urls";
import { getEnvironmentFromPortalUrl } from "../../utils";
import { HubEnvironment } from "../../permissions";
import { _getHubUrlFromPortalHostname } from "../../urls/_get-hub-url-from-portal-hostname";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import { Polygon } from "geojson";

/**
 * Hashmap of Hub environment and application url surfix
 */
const envBases: Partial<Record<HubEnvironment, string>> = {
  devext: "dev",
  qaext: "qa",
  production: "",
};

/**
 * Create a new content with updated boundary properties
 * @param content original content
 * @param boundary boundary provenance
 * @returns
 * @private
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

/**
 * get a content's boundary based on the item's boundary property
 * @param item
 * @returns
 * @private
 */
export const getContentBoundary = (item: IItem): IHubGeography => {
  const bBox = item.extent;
  const isValidItemExtent = isBBox(bBox);
  // user specified provenance is stored in item.properties
  const provenance: GeographyProvenance =
    item.properties?.boundary ||
    // but we default to item if the item has an extent
    (isValidItemExtent ? "item" : undefined);
  const boundary: IHubGeography = {
    geometry: null,
    provenance,
  };
  if (provenance === "item" && isValidItemExtent) {
    const extent = bBoxToExtent(bBox);
    const center = getExtentCenter(extent);
    boundary.center = [center.x, center.y];
    boundary.geometry = {
      ...extentToPolygon(extent),
      type: "polygon",
    };
    boundary.spatialReference = boundary.geometry.spatialReference;
  }
  return boundary;
};

/**
 * Constructs IExtent from numeric item extent array
 * @param extent Raw item extent array
 * @returns IExtent
 */
export const getExtentObject = (extent: number[][]): IExtent => {
  return isBBox(extent)
    ? ({ ...bBoxToExtent(extent), type: "extent" } as unknown as IExtent)
    : undefined;
};

/**
 * Derives proper IHubLocation given an ArcGIS Item.  If no
 * location (item.properties.location) is present, one will be
 * constructed from the item's extent.
 * @param item ArcGIS Item
 * @returns IHubLocation
 */
export const deriveLocationFromItem = (item: IItem): IHubLocation => {
  const { properties, extent } = item;
  const location: IHubLocation = properties?.location;

  if (location) {
    // IHubLocation already exists, so return it
    return location;
  }

  if (properties?.boundary === "none") {
    // Per https://confluencewikidev.esri.com/display/Hub/Hub+Location+Management
    // bounds = 'none' -> specifies not to show on map.  If this is true and
    // no location is already present, opt to not generate location from item extent
    return { type: "none" };
  }

  // IHubLocation does not exist on item properties, so construct it
  // from item extent
  const geometry: any = getExtentObject(extent);
  if (geometry) {
    // geometry constructed from bbox
    return {
      type: "custom",
      extent,
      geometries: [geometry],
      spatialReference: geometry.spatialReference,
    };
  } else {
    // Could not construct extent object, attempt to construct from geojson
    try {
      // Item extent is supposed to be in WGS84 per item documentation:
      // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
      // But in many situations, this is not the case.  So we do out best to
      // determine the spatial reference of the extent.
      const bbox = GeoJSONPolygonToBBox(extent as any as Polygon);
      const defaultSpatialReference = { wkid: 4326 };
      const _geometry: Partial<__esri.Geometry> = {
        type: "polygon",
        ...geojsonToArcGIS(extent as any as Polygon),
        spatialReference: allCoordinatesPossiblyWGS84(bbox)
          ? defaultSpatialReference
          : (getItemSpatialReference(item) as any) || defaultSpatialReference,
      };
      return {
        type: "custom",
        extent: bbox,
        geometries: [_geometry],
        spatialReference: _geometry.spatialReference,
      };
    } catch {
      // Finally, exhausted all options and return a location of type none
      return { type: "none" };
    }
  }
};

/**
 * Determine if we are in an enterprise environment
 * NOTE: when no request options are provided, the underlying
 * request functions assume that we are online in production
 * so we only want use enterprise logic if isPortal is explicitly defined
 * @param requestOptions
 * @returns
 * @private
 */
export const isPortal = (requestOptions?: IHubRequestOptions) => {
  return requestOptions && requestOptions.isPortal;
};

/**
 * Determine if we can use the Hub API for an item, i.e.
 * the item is public and we are not in an enterprise environment
 * @param item
 * @param requestOptions
 * @returns
 * @private
 */
export const canUseHubApiForItem = (
  item: IItem,
  requestOptions?: IHubRequestOptions
) => {
  return !!item && item.access === "public" && !isPortal(requestOptions);
};

/**
 * Returns whether or not an item is a proxied csv
 *
 * @param item
 * @param requestOptions Hub Request Options (including whether we're in portal)
 * @returns
 * @private
 */
export const isProxiedCSV = (
  item: IItem,
  requestOptions?: IHubRequestOptions
) =>
  !isPortal(requestOptions) &&
  item.access === "public" &&
  item.type === "CSV" &&
  item.size <= 5000000;

/**
 * Get the relative URL to use for the item in a hub site
 * @param type
 * @param identifier
 * @param typeKeywords
 * @returns
 * @private
 */
export const getHubRelativeUrl = (
  type: string,
  identifier: string,
  typeKeywords?: string[]
): string => {
  // solution types have their own logic
  let contentUrl =
    getSolutionUrl(type, identifier, typeKeywords) ||
    getInitiativeTemplateUrl(type, identifier, typeKeywords);
  if (!contentUrl) {
    const family = getFamily(type);
    const familiesWithPluralizedRoute = [
      "app",
      "dataset",
      "document",
      "map",
      "template",
      "project",
      "discussion",
    ];
    // default to the catchall content route
    let path = "/content";
    if (family === "feedback") {
      // the exception
      path = "/feedback/surveys";
    } else if (isPageType(type, typeKeywords)) {
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

/**
 * Is this content type a page?
 * @param type
 * @returns
 * @private
 */
export const isPageType = (type: string, typeKeywords: string[] = []) =>
  ["Hub Page", "Site Page"].includes(type) || typeKeywords.includes("hubPage");

const getSolutionUrl = (
  type: string,
  identifier: string,
  typeKeywords?: string[]
): string => {
  let hubUrl;
  if (type === "Solution") {
    // solution types are now in the Template family
    // we send all except the deployed solution items to the route for initiative templates
    if (typeKeywords?.indexOf("Deployed") > -1) {
      // deployed solutions go to the generic content route
      hubUrl = `/content/${identifier}/about`;
    } else {
      hubUrl = `/templates/${identifier}/about`;
    }
  } else if (
    type === "Web Mapping Application" &&
    typeKeywords?.indexOf("hubSolutionTemplate") > -1
  ) {
    hubUrl = `/templates/${identifier}/about`;
  }
  return hubUrl;
};

const getInitiativeTemplateUrl = (
  type: string,
  identifier: string,
  typeKeywords?: string[]
): string => {
  if (
    (type === "Hub Initiative" &&
      typeKeywords?.indexOf("hubInitiativeTemplate") > -1) ||
    type === "Hub Initiative Template"
  ) {
    return `/initiatives/templates/${identifier}/about`;
  }
};

// metadata

/**
 * well known paths to formal metadata values
 */
export interface IMetadataPaths {
  updateFrequency: string;
  metadataUpdateFrequency: string;
  metadataUpdatedDate: string;
  reviseDate: string;
  pubDate: string;
  createDate: string;
}

/**
 * Get the path to a well known metadata value
 * @param identifier identifier for well known metadata value
 * @returns path to be used like get(metadata, path)
 * @private
 */
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

/**
 * Get a well known value from metadata
 * @param metadata
 * @param identifier identifier for well known metadata value
 * @returns
 * @private
 */
export function getValueFromMetadata(
  metadata: any,
  identifier: keyof IMetadataPaths
) {
  const path = getMetadataPath(identifier);
  return path && getProp(metadata, path);
}

/**
 * Date precisions
 */
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
 * @private
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

// NOTE: IItem has spatialRefernce: ISpatialReference, but
// the portal REST API returns spatialReference as as string
// that is always either WKID like "102100" or the name of a
// WKT like "NAD_1983_HARN_StatePlane_Hawaii_3_FIPS_5103_Feet".
// We only coerce WKIDs into a ISpatialReference objects since we
// can't easily lookup a complete WKT.
/**
 * Get the spatial reference as an object for an item
 * @param item
 * @returns spatial reference object
 * @private
 */
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
    ? // It looks like the portal api returns the name of a WKT, but we'd
      // need to perform a lookup to get the full WKT. Return null for now.
      null
    : //
      { wkid };
};

/**
 * Data model for additional resources that are extracted
 * directly from formal item metadata (with no transformation)
 */
interface IAGOAdditionalResource {
  orName?: string; // Name of the resource
  linkage: string; // URL to the resource
}

/**
 * Extracts additional resources from the provided metadata
 * and transforms them into a hub-friendly format.
 *
 * Returns null if no resources are available
 *
 * @param item
 * @param metadata formal metadata
 * @returns
 * @private
 */
export const getAdditionalResources = (
  item: IItem,
  metadata?: any,
  requestOptions?: IHubRequestOptions
): IHubAdditionalResource[] => {
  const rawResources: IAGOAdditionalResource[] = extractRawResources(metadata);
  return (
    rawResources &&
    rawResources.map(
      (resource: IAGOAdditionalResource): IHubAdditionalResource => ({
        name: resource.orName,
        url: getAdditionalResourceUrl(resource, item, requestOptions),
        isDataSource: isDataSourceOfItem(resource, item),
      })
    )
  );
};

/**
 * @private
 *
 * Extracts additional resources from formal item metadata.
 * If none are available, null is returned.
 *
 * @param metadata the formal item metadata
 * @returns an array of all additional resources, or null
 */
export const extractRawResources = (
  metadata?: any
): IAGOAdditionalResource[] => {
  const rawResources: IAGOAdditionalResource[] = [];

  // The property path to additional resources should be fairly simple.
  // In many cases, it's just `metadata.metadata.distInfo.distTranOps.onLineSrc`.
  // However, since `distInfo`, `distTranOps` and `onLineSrc` can be either
  // Objects OR Arrays, we have to do all this looping.
  castToArray(getProp(metadata, "metadata.distInfo") || []).forEach(
    (distInfo: any) => {
      castToArray(distInfo.distTranOps || []).forEach((distTranOps: any) => {
        castToArray(distTranOps.onLineSrc || []).forEach(
          (onLineSrc: IAGOAdditionalResource) => {
            rawResources.push(onLineSrc);
          }
        );
      });
    }
  );

  return rawResources.length ? rawResources : null;
};

/**
 * @private
 *
 * Arrays are returned as-is.
 * Objects are wrapped into a 1 element array.
 *
 * @param objectOrArray
 * @returns the casted array
 */
const castToArray = (objectOrArray: any) => {
  return Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
};

/**
 * Determines whether a raw additional resource (i.e. extracted out of formal
 * metadata with no transformation) references the underlying service that backs
 * the item.
 *
 * @param resource raw additional resource of an item
 * @param item
 * @returns
 * @private
 */
export const isDataSourceOfItem = (
  resource: IAGOAdditionalResource,
  item: IItem
) => {
  const serviceUrl = item.url && parseServiceUrl(item.url);
  return (
    serviceUrl && resource.linkage && resource.linkage.includes(serviceUrl)
  );
};

/**
 * Returns the url for an additional resource.
 *
 * Automatically appends auth token if token is available
 * and resource points to the backing service of an item.
 *
 * @param resource raw additional resource of an item
 * @param item
 * @param requestOptions IHubRequestOptions, including authentication
 * @returns
 * @private
 */
export const getAdditionalResourceUrl = (
  resource: IAGOAdditionalResource,
  item: IItem,
  requestOptions?: IHubRequestOptions
) => {
  let result = resource.linkage;
  const token = getProp(requestOptions, "authentication.token");
  if (token && isDataSourceOfItem(resource, item)) {
    const resUrl = new URL(resource.linkage);
    const params = new URLSearchParams(resUrl.search);
    params.set("token", token);
    resUrl.search = params.toString();
    result = resUrl.toString();
  }

  return result;
};

/**
 * @private
 *
 * Contains fallback logic for determining a content's extent.
 *
 * The fallback priority is as follows:
 * 1) item's extent (if valid bbox)
 * 2) extent enrichment from the hub api (if coordinates are valid bbox)
 * 3) layer's extent (if spatial reference is 4326)
 *
 * If none of these conditions are met, undefined is returned.
 *
 * @param item
 * @param layer
 * @param extentEnrichment
 * @returns the correct extent in a bbox format, or undefined
 */
export const determineExtent = (
  item: IItem,
  extentEnrichment?: any,
  layer?: ILayerDefinition
) => {
  const itemExtent = isBBox(item.extent) ? item.extent : undefined;
  const extentEnrichmentCoordinates = isBBox(extentEnrichment?.coordinates)
    ? extentEnrichment.coordinates
    : undefined;
  const layerExtent =
    getProp(layer, "extent.spatialReference.wkid") === 4326
      ? extentToBBox(layer.extent)
      : undefined;
  return itemExtent || extentEnrichmentCoordinates || layerExtent;
};

/**
 * @private
 *
 * Extracts the first contact from a given formal item metadata path.
 * This is particularly helpful if the contact path is either an object or an array.
 *
 * Note: the raw contact object must have the following properties:
 * - `rpIndName`: name of the individual
 * - `rpOrgName`: name of the individual's organization
 *
 * @param metadata formal item metadata
 * @param path path to the contact object/array
 * @returns
 */
export const extractFirstContact = (metadata: any, path: string) => {
  const rawContacts = getProp(metadata, path) || {};
  const { rpIndName, rpOrgName } = Array.isArray(rawContacts)
    ? rawContacts[0]
    : rawContacts;
  return { individualName: rpIndName, organizationName: rpOrgName };
};

/**
 * Determines the correct orgId for an item.
 * Note: it's undocumented, but the portal API will return orgId for items... sometimes.
 *
 * @param item
 * @param ownerUser item owner's hydrated user object
 */
export const getItemOrgId = (item: IItem, ownerUser?: IUser) =>
  item.orgId || ownerUser?.orgId;

/**
 * Calculates the Publisher display info for the given item.
 * Utilizes this fallback pattern:
 * 1) Formal Item Metadata > Resource > Citation > Contact
 * 2) Formal Item Metadata > Resource > Contact
 * 3) Item’s Owner and Org Name
 * 4) Undefined (Item Owner / Org are private and we can't access additional info)
 *
 * @param item
 * @param metadata
 * @param org portal info of the item's organization
 * @param ownerUser the item owner's hydrated user
 * @returns
 */
export const getPublisherInfo = (
  item: IItem,
  metadata?: any,
  org?: Partial<IPortal>,
  ownerUser?: IUser
) => {
  const result: any = {
    nameSource: PublisherSource.None,
    organizationSource: PublisherSource.None,
  };
  const citationContact = extractFirstContact(
    metadata,
    "metadata.dataIdInfo.idCitation.citRespParty"
  );
  const resourceContact = extractFirstContact(
    metadata,
    "metadata.dataIdInfo.idPoC"
  );
  const metadataContact = extractFirstContact(metadata, "metadata.mdContact");

  // Determine publisher name properties
  const ownerFullName = getProp(ownerUser, "fullName");

  if (citationContact.individualName) {
    result.name = citationContact.individualName;
    result.nameSource = PublisherSource.CitationContact;
  } else if (resourceContact.individualName) {
    result.name = resourceContact.individualName;
    result.nameSource = PublisherSource.ResourceContact;
  } else if (metadataContact.individualName) {
    result.name = metadataContact.individualName;
    result.nameSource = PublisherSource.MetadataContact;
  } else if (ownerFullName) {
    result.name = ownerFullName;
    result.username = ownerUser.username;
    result.nameSource = PublisherSource.ItemOwner;
  }

  // Determine publisher org properties
  const orgName = getProp(org, "name");

  if (citationContact.organizationName) {
    result.organization = citationContact.organizationName;
    result.organizationSource = PublisherSource.CitationContact;
  } else if (resourceContact.organizationName) {
    result.organization = resourceContact.organizationName;
    result.organizationSource = PublisherSource.ResourceContact;
  } else if (metadataContact.organizationName) {
    result.organization = metadataContact.organizationName;
    result.organizationSource = PublisherSource.MetadataContact;
  } else if (orgName) {
    result.organization = orgName;
    result.orgId = getItemOrgId(item, ownerUser);
    result.organizationSource = PublisherSource.ItemOwner;
  }

  // We assume the item belongs to external org if no org info is available and the item is private
  result.isExternal =
    result.organizationSource === PublisherSource.None &&
    item.access !== "public";

  return result;
};

/**
 * returns the last section of each category path.
 * Example: "/categories/parent/child" > "child"
 *
 * @param categories an item's categories
 */
export const getShortenedCategories = (categories: string[]) => {
  return categories.reduce((acc: string[], category: string) => {
    const segments = category.split("/");
    const shortenedCategory = segments[segments.length - 1];

    shortenedCategory && acc.push(shortenedCategory);
    return acc;
  }, []);
};

/**
 * Returns URL to edit content of application type
 *
 * TODO: implement logic to compute edit URL for
 * Dataset, project, document, templates
 *
 * Logic copied from getEditUrl()
 * https://github.com/ArcGIS/opendata-ui/blob/9442a7a26ddde117bdaa747f60e2ef61f5163896/packages/ember-arcgis-opendata-components/addon/services/solutions-service.js#L1340
 *
 * @param item
 * @param requestOptions
 */
export const getContentEditUrl = (
  item: IItem,
  requestOptions: IRequestOptions
) => {
  let contentEditUrl: string;
  // TODO: edit URL for Dataset, project, document, templates
  switch (getNormalizedAppItemType(item)) {
    case "Dashboard":
      contentEditUrl = getDashboardEditUrl(item, requestOptions);
      break;
    case "Insights Workbook":
      contentEditUrl = getInsightsEditUrl(item, requestOptions);
      break;
    case "Experience":
      contentEditUrl = getExperienceBuilderEditUrl(item, requestOptions);
      break;
    case "Web AppBuilder":
      contentEditUrl = getWebAppBuilderEditUrl(item, requestOptions);
      break;
    case "Form":
      contentEditUrl = getSurvey123EditUrl(item, requestOptions);
      break;
    case "StoryMap":
      contentEditUrl = getStoryMapEditUrl(item, requestOptions);
      break;
    case "Urban Model":
      contentEditUrl = getUrbanModelEditUrl(item, requestOptions);
      break;
    default:
      contentEditUrl = getItemHomeUrl(item.id, requestOptions);
  }
  return contentEditUrl;
};

/**
 * returns normalized application item type
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/842685ab715209a4793a7a4cb752bd37225c16ec/packages/ember-arcgis-hub-components/addon/utils/item-urls.js#L132
 *
 * @param item
 */
const getNormalizedAppItemType = (item: IItem) => {
  const typeKeywords = item.typeKeywords || [];
  let result = item.type;

  if (
    item.type === "StoryMap" ||
    (item.type === "Web Mapping Application" &&
      typeKeywords.includes("Story Map"))
  ) {
    result = "StoryMap";
  } else if (item.type === "Insights Page") {
    result = "Insights Page";
  } else if (item.type === "Insights Workbook") {
    result = "Insights Workbook";
  } else if (item.type && item.type.includes("Insights")) {
    result = "Insights";
  } else if (
    item.type === "Web Experience" ||
    (item.type === "Web Mapping Experience" &&
      typeKeywords.includes("EXB Experience"))
  ) {
    result = "Experience";
  } else if (typeKeywords.includes("Web AppBuilder")) {
    result = "Web AppBuilder";
  }
  return result;
};

/**
 * returns url to edit Story map application
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/842685ab715209a4793a7a4cb752bd37225c16ec/packages/ember-arcgis-opendata-components/addon/services/storymap-service.js#L289
 *
 * @param item
 * @param requestOptions
 */
const getStoryMapEditUrl = (item: IItem, requestOptions: IRequestOptions) => {
  const storyMapsBases: Partial<Record<HubEnvironment, string>> = {
    devext: "storymapsdev",
    qaext: "storymapsqa",
    production: "storymaps",
  };
  const portalUrl = getPortalUrl(requestOptions);
  const env = getEnvironmentFromPortalUrl(portalUrl);
  const storyMapUrl = `https://${storyMapsBases[env]}.arcgis.com`;

  return `${storyMapUrl}/stories/${item.id}/edit`;
};

/**
 * returns URL to edit Experience builder application
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/842685ab715209a4793a7a4cb752bd37225c16ec/packages/ember-arcgis-opendata-components/addon/services/experience-service.js#L227
 *
 * @param item
 * @param requestOptions
 */
const getExperienceBuilderEditUrl = (
  item: IItem,
  requestOptions: IRequestOptions
) => {
  const portalUrl = getPortalUrl(requestOptions);
  const env = getEnvironmentFromPortalUrl(portalUrl);
  const experienceBuilderUrl = `https://experience${envBases[env]}.arcgis.com`;

  return `${experienceBuilderUrl}/builder/?id=${item.id}`;
};

/**
 * returns URL to edit Dashboard application
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/842685ab715209a4793a7a4cb752bd37225c16ec/packages/ember-arcgis-opendata-components/addon/services/dashboard-service.js#L357
 *
 * @param item
 * @param requestOptions
 */
const getDashboardEditUrl = (item: IItem, requestOptions: IRequestOptions) => {
  const portalUrl = getPortalUrl(requestOptions);
  let url = `${portalUrl}/apps/opsdashboard/index.html#/${item.id}?mode=edit`;
  if (item.typeKeywords && item.typeKeywords.includes("ArcGIS Dashboards")) {
    url = `${portalUrl}/apps/dashboards/${item.id}#mode=edit`;
  }
  return url;
};

/**
 * returns URL to edit Web application builder
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/842685ab715209a4793a7a4cb752bd37225c16ec/packages/ember-arcgis-opendata-components/addon/services/webapp-service.js#L359
 *
 * @param item
 * @param requestOptions
 */
const getWebAppBuilderEditUrl = (
  item: IItem,
  requestOptions: IRequestOptions
) => {
  const portalUrl = getPortalUrl(requestOptions);
  // TODO: handle special cases for economic-development app and enterprise
  return `${portalUrl}/apps/webappbuilder/index.html?id=${item.id}`;
};

/**
 * returns edit URL for Survey123 application item
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/842685ab715209a4793a7a4cb752bd37225c16ec/packages/ember-arcgis-opendata-components/addon/services/survey-service.js#L1014
 *
 * @param item
 * @param requestOptions
 */
const getSurvey123EditUrl = (item: IItem, requestOptions: IRequestOptions) => {
  const portalUrl = getPortalUrl(requestOptions);
  const env = getEnvironmentFromPortalUrl(portalUrl);

  const survey123Url = `https://survey123${envBases[env]}.arcgis.com`;

  let surver123EditUrl;

  // TODO: handle cases for enterprise and Hub feedback relative URL
  if (item.typeKeywords.includes("Survey123 Connect")) {
    surver123EditUrl = getItemHomeUrl(item.id, portalUrl);
  } else {
    surver123EditUrl = `${survey123Url}/surveys/${item.id}/design?portalUrl=${portalUrl}`;
  }

  return surver123EditUrl;
};

/**
 * returns URL to edit Insights application
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/9442a7a26ddde117bdaa747f60e2ef61f5163896/packages/ember-arcgis-opendata-components/addon/services/solutions-service.js#L1366-L1369
 *
 * @param item
 * @param requestOptions
 */
const getInsightsEditUrl = (item: IItem, requestOptions: IRequestOptions) => {
  const portalUrl = getPortalUrl(requestOptions);
  const env = getEnvironmentFromPortalUrl(portalUrl);

  const insightsUrl = `https://insights${envBases[env]}.arcgis.com`;
  const itemHomeUrl = getItemHomeUrl(item.id, portalUrl);
  return isPortalFromUrl(portalUrl)
    ? itemHomeUrl
    : `${insightsUrl}/#/edit/${item.id}`;
};

/**
 * returns URL to edit Urban Model application
 *
 * Logic copied from
 * https://github.com/ArcGIS/opendata-ui/blob/9442a7a26ddde117bdaa747f60e2ef61f5163896/packages/ember-arcgis-opendata-components/addon/services/solutions-service.js#L1370-L1373
 *
 * @param item
 * @param requestOptions
 */
const getUrbanModelEditUrl = (item: IItem, requestOptions: IRequestOptions) => {
  const portalUrl = getPortalUrl(requestOptions);
  const env = getEnvironmentFromPortalUrl(portalUrl);
  const urbanModelUrl = `https://urban${envBases[env]}.arcgis.com`;
  const itemHomeUrl = getItemHomeUrl(item.id, portalUrl);
  return isPortalFromUrl(portalUrl)
    ? itemHomeUrl
    : `${urbanModelUrl}/?id=${item.id}`;
};

const isPortalFromUrl = (portalUrl: string): boolean => {
  return portalUrl.indexOf("arcgis.com") === -1;
};
