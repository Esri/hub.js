import { IItem } from "@esri/arcgis-rest-types";
import { isMaster } from "cluster";
import { fetchItemEnrichments } from "../items/_enrichments";
import { getProp } from "../objects";
import { getItemThumbnailUrl } from "../resources";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions } from "../types";
import { getItemHomeUrl } from "../urls";
import { unique } from "../util";
import { mapBy } from "../utils";
import { getFamily } from "./get-family";
import { getHubRelativeUrl } from "./_internal";

/**
 * Enrich a generic search result
 * @param item
 * @param includes
 * @param requestOptions
 * @returns
 */
export async function enrichContentSearchResult(
  item: IItem,
  include: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Create the basic structure
  const result: IHubSearchResult = {
    access: item.access,
    id: item.id,
    type: item.type,
    name: item.title,
    owner: item.owner,
    summary: item.snippet || item.description,
    createdDate: new Date(item.created),
    createdDateSource: "item.created",
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified",
    family: getFamily(item.type),
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: "not-implemented",
    },
  };

  // default includes
  let DEFAULTS: string[] = [];

  // Type specific logic here
  // NOTE: This is currently just test logic
  if (["Map Service", "Feature Service"].includes(item.type)) {
    DEFAULTS = ["server.layers.length AS layerCount"];
  }

  if (item.type === "Web Map") {
    DEFAULTS = ["data.operationalLayers.length AS layerCount"];
  }

  // merge includes
  include = [...include, ...DEFAULTS].filter(unique);
  // Parse the includes into a valid set of enrichments
  const specs = include.map(parseInclude);
  // Extract out the low-level enrichments needed
  const enrichments = mapBy("enrichment", specs).map(unique);
  // fetch the enrichments
  let enriched = {};
  if (enrichments.length) {
    enriched = await fetchItemEnrichments(item, enrichments, requestOptions);
  }

  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  // Handle links
  // TODO: Link handling should be an enrichment
  result.links.thumbnail = getItemThumbnailUrl(item, requestOptions);
  result.links.self = getItemHomeUrl(result.id, requestOptions);
  result.links.siteRelative = getHubRelativeUrl(
    result.type,
    result.id,
    item.typeKeywords
  );

  return result;
}
