import { IUser } from "@esri/arcgis-rest-types";
import { getUser } from "@esri/arcgis-rest-portal";
import { fetchUserEnrichments } from "./_internal/enrichments";
import { SettableAccessLevel } from "../core/types";
import { IHubUser } from "../core/types/IHubUser";
import { getProp } from "../objects";
import { getUserThumbnailUrl } from "../search/utils";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions } from "../types";
import { getUserHomeUrl } from "../urls";
import { unique } from "../util";
import { mapBy } from "../utils";
import { IHubSearchResult } from "../search/types/IHubSearchResult";

export const convertUserToHubUser = (user: IUser): IHubUser => {
  // A private user will not have a description prop at all
  // thus we set it to undefined to differentiate from a empty description which would be null
  const description = user.hasOwnProperty("description")
    ? user.description
    : undefined;
  return {
    access: user.access as SettableAccessLevel,
    id: user.username,
    name: user.fullName,
    description,
    summary: description,
    createdDate: new Date(user.created),
    createdDateSource: "user.created",
    owner: user.username,
    updatedDate: new Date(user.modified),
    updatedDateSource: "user.modified",
    tags: user.tags,
    thumbnail: user.thumbnail,
    type: "User",
    typeKeywords: [],
    links: {
      // TODO: implement these
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: null,
    },
  };
};

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
  const hubUser = convertUserToHubUser(user);
  const result: IHubSearchResult = {
    ...hubUser,
    family: "people",
    rawResult: user,
  };
  // Group Memberships need these additional properties
  if (user.memberType) {
    result.memberType = user.memberType;
    result.isGroupOwner = user.isGroupOwner;
  }

  // Parse the includes into a valid set of enrichments
  const specs = include.filter(unique).map(parseInclude);
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

export const fetchHubUser = async (
  username: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubUser> => {
  const user = await getUser({
    ...requestOptions,
    username,
  });
  return convertUserToHubUser(user);
};
