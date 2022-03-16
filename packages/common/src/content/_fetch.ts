import { IItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubContent } from "../core";
import {
  fetchItemEnrichments,
  ItemOrServerEnrichment,
} from "../items/_enrichments";
import { hubApiRequest } from "../request";
import { BBox, IHubRequestOptions, IHubGeography } from "../types";
import { isMapOrFeatureServerUrl } from "../urls";
import { cloneObject } from "../util";
import { includes } from "../utils";
import { normalizeItemType } from "./compose";
import { getFamily } from "./get-family";
import { parseDatasetId } from "./slugs";
import { DatasetResource } from "./types";

// TODO: need to fetch data for client-side layer views as well
// determine if we should fetch data for an item
const shouldFetchData = (item: IItem) => {
  const type = normalizeItemType(item);
  const family = getFamily(type);
  const dataFamilies = ["template", "solution"];
  const dataTypes = ["Web Map", "Web Scene"];
  return includes(dataFamilies, family) || includes(dataTypes, type);
};

/**
 * get the default list of enrichments to fetch for content
 * @param item
 * @returns the default list of enrichments to fetch for content
 * @private
 */
export const getContentEnrichments = (item: IItem) => {
  // we fetch these enrichments for all content types
  const enrichments: ItemOrServerEnrichment[] = [
    "groupIds",
    "metadata",
    "ownerUser",
    "org",
  ];
  // we only fetch data for certain content
  if (shouldFetchData(item)) {
    enrichments.push("data");
  }
  // we fetch server and layers for map and feature services
  return isMapOrFeatureServerUrl(item.url)
    ? enrichments.concat("server", "layers")
    : enrichments;
};

/**
 * The extent returned by the Hub API
 */
export interface IHubExtent {
  coordinates?: BBox;
}

/**
 * The set of enrichments that we fetch from the Hub API
 */
export interface IDatasetEnrichments {
  itemId: string;
  layerId?: number;
  slug?: string;
  // TODO: move these to a common interface shared w/ IHubContentEnrichments
  /**
   * boundary will default to the item extent
   * but can be overwritten by enrichments from the Hub API (inline)
   * or fetched from a location such as /resources/boundary.json
   */
  boundary?: IHubGeography;

  /**
   * Either the item's extent, or the item's
   * layer or server's extent converted to a lat/lng coordinate pair
   */
  extent?: IHubExtent;

  /**
   * The appropriate summary to show for the item, coming from either
   * the item's data (for pages or initiatives) or the item's description
   */
  searchDescription?: string;

  // TODO: a better type than any
  /**
   * Pre-computed field statistics (min, max, average, etc)
   */
  statistics?: any;
}

// build up request options to only include the above enrichments
// that we fetch from the Hub API, and to optionally filter by slug
const getHubEnrichmentsOptions = (
  requestOptions: IHubRequestOptions,
  slug?: string
) => {
  const opts = cloneObject(requestOptions);
  opts.params = {
    ...opts.params,
    "fields[datasets]": "slug,boundary,extent,searchDescription,statistics",
  };
  if (slug) {
    opts.params["filter[slug]"] = slug;
  }
  return opts;
};

// extract the ids and enrichments from the Hub API response
const getDatasetEnrichments = (dataset: DatasetResource) => {
  const { itemId, layerId: layerIdString } = parseDatasetId(dataset.id);
  const layerId = layerIdString && parseInt(layerIdString, 10);
  const { slug, boundary, extent, searchDescription, statistics } =
    dataset.attributes;
  return {
    itemId,
    layerId,
    slug,
    boundary,
    extent,
    searchDescription,
    statistics,
  } as IDatasetEnrichments;
};

/**
 * fetch enrichment from the Hub API by slug
 * @param slug
 * @param requestOptions
 * @returns enrichments from the Hub API (slug, boundary, statistic, etc)
 * @private
 */
export const fetchHubEnrichmentsBySlug = async (
  slug: string,
  requestOptions: IHubRequestOptions
) => {
  const response = await hubApiRequest(
    `/datasets`,
    getHubEnrichmentsOptions(requestOptions, slug)
  );
  return getDatasetEnrichments(response.data[0]);
};

/**
 * fetch enrichment from the Hub API by id
 * @param slug
 * @param requestOptions
 * @returns enrichments from the Hub API (slug, boundary, statistic, etc)
 * @private
 */
export const fetchHubEnrichmentsById = async (
  hubId: string,
  requestOptions: IHubRequestOptions
) => {
  const response = await hubApiRequest(
    `/datasets/${hubId}`,
    getHubEnrichmentsOptions(requestOptions)
  );
  return getDatasetEnrichments(response.data);
};
