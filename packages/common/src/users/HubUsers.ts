import { IUser } from "@esri/arcgis-rest-types";
import { fetchUserEnrichments } from "./_internal/enrichments";
import { getProp } from "../objects";
import { getUserThumbnailUrl, IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions } from "../types";
import { getUserHomeUrl } from "../urls";
import { unique } from "../util";
import { mapBy } from "../utils";
import { AccessLevel } from "../core";

/**
 * Enrich a User object
 * @param user
 * @param includes
 * @param requestOptions
 * @returns
 */
export async function enrichUserSearchResult(
  user: IUser,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Create the basic structure
  const result: IHubSearchResult = {
    access: user.access as AccessLevel,
    id: user.username,
    type: "User",
    name: user.fullName,
    owner: user.username,
    summary: user.description,
    createdDate: new Date(user.created),
    createdDateSource: "user.created",
    updatedDate: new Date(user.modified),
    updatedDateSource: "user.modified",
    family: "people",
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: "not-implemented",
    },
  };

  // Informal Enrichments - basically adding type-specific props
  // derived directly from the entity

  // default includes
  const DEFAULTS: string[] = [];

  // merge includes
  include = [...DEFAULTS, ...include].filter(unique);
  // Parse the includes into a valid set of enrichments
  const specs = include.map(parseInclude);
  // Extract out the low-level enrichments needed
  const enrichments = mapBy("enrichment", specs).filter(unique);
  // fetch the enrichments
  let enriched = {};
  if (enrichments.length) {
    enriched = await fetchUserEnrichments(user, enrichments, requestOptions);
  }

  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  const token = requestOptions.authentication.token;

  // Handle links
  result.links.thumbnail = getUserThumbnailUrl(
    requestOptions.portal,
    user,
    token
  );
  result.links.self = getUserHomeUrl(result.id, requestOptions);
  result.links.siteRelative = `/people/${result.id}`;

  return result;
}
