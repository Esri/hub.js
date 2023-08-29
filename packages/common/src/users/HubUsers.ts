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
  user: IUser & Record<string, any>,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Create the basic structure
  const result: IHubSearchResult = {
    access: user.access as AccessLevel,
    id: user.username,
    type: "User",
    /**
     * We need to return a valid IHubSearchResult, so we store
     * IUser information where it makes the most sense - e.g.
     * we store the user's full name under the "name" property,
     * and since users don't have an owner, we fill that property
     * with the user's username
     */
    name: user.fullName,
    owner: user.username,
    // A private user will not have a description prop at all
    // thus we set it to undefined to differentiate from a empty description which would be null
    summary: user.hasOwnProperty("description") ? user.description : undefined,
    createdDate: new Date(user.created),
    createdDateSource: "user.created",
    updatedDate: new Date(user.modified),
    updatedDateSource: "user.modified",
    family: "people",
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: null,
    },
  };
  // Group Memberships need these additional properties
  if (user.memberType) {
    result.memberType = user.memberType;
    result.isGroupOwner = user.isGroupOwner;
  }

  // Informal Enrichments - basically adding type-specific props
  // derived directly from the entity

  // default includes
  const DEFAULTS: string[] = ["org.name AS orgName"];

  // merge includes
  include = [...DEFAULTS, ...include].filter(unique);
  // Parse the includes into a valid set of enrichments
  const specs = include.map(parseInclude);
  // Extract out the low-level enrichments needed
  const enrichments = mapBy("enrichment", specs).filter(unique);
  // fetch the enrichments
  let enriched = {};
  // Ignoring the else, because we currently have defaults, but want the guards
  // so if we remove that in the future, we don't call the fn
  /* istanbul ignore else */
  if (enrichments.length) {
    enriched = await fetchUserEnrichments(user, enrichments, requestOptions);
  }

  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  const token = requestOptions.authentication?.token;

  // only construct thumbnail url if we have a thumbnail value
  // ui layer can decide how to handle a null thumbnail
  if (user.thumbnail) {
    result.links.thumbnail = getUserThumbnailUrl(
      requestOptions.portal,
      user,
      token
    );
  }
  result.links.self = getUserHomeUrl(result.id, requestOptions);
  result.links.siteRelative = `/people/${result.id}`;

  return result;
}
