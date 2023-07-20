import { IGroup } from "@esri/arcgis-rest-types";
import { fetchGroupEnrichments } from "./_internal/enrichments";
import { getProp } from "../objects";
import { getGroupThumbnailUrl, IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions, IModel } from "../types";
import { getGroupHomeUrl } from "../urls";
import { unique } from "../util";
import { mapBy } from "../utils";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import {
  getGroup,
  removeGroup,
  createGroup,
  updateGroup,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubGroup } from "../core/types/IHubGroup";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { DEFAULT_GROUP } from "./defaults";

/**
 * Enrich a generic search result
 * @param group
 * @param includes
 * @param requestOptions
 * @returns
 */
export async function enrichGroupSearchResult(
  group: IGroup,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Create the basic structure
  const result: IHubSearchResult = {
    access: group.access,
    id: group.id,
    type: "Group",
    name: group.title,
    owner: group.owner,
    summary: group.snippet || group.description,
    createdDate: new Date(group.created),
    createdDateSource: "group.created",
    updatedDate: new Date(group.modified),
    updatedDateSource: "group.modified",
    family: "team",
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: "not-implemented",
    },
  };

  // Informal Enrichments - basically adding type-specific props
  // derived directly from the entity
  result.isSharedUpdate = (group.capabilities || []).includes(
    "updateitemcontrol"
  );
  result.membershipAccess = group.membershipAccess;
  result.isOpenData = !!group.isOpenData;

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
    enriched = await fetchGroupEnrichments(group, enrichments, requestOptions);
  }

  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  // Handle links
  result.links.thumbnail = getGroupThumbnailUrl(requestOptions.portal, group);
  result.links.self = getGroupHomeUrl(result.id, requestOptions);
  result.links.siteRelative = `/teams/${result.id}`;

  return result;
}

/**
 * Create a new Hub Group
 * we are fetching the IGroup so we need to convert
 * the Hub Group to IGroup first, then convert them
 * back to Hub Group and return them
 * @param partialGroup
 * @param requestOptions
 */
export async function createHubGroup(
  partialGroup: Partial<IHubGroup>,
  requestOptions: IUserRequestOptions
): Promise<IHubGroup> {
  // merge the incoming and default groups
  const hubGroup = { ...DEFAULT_GROUP, ...partialGroup } as IHubGroup;
  const group = convertHubGroupToGroup(hubGroup);
  const opts = {
    group,
    authentication: requestOptions.authentication,
  };
  const result = await createGroup(opts);
  return convertGroupToHubGroup(result.group, requestOptions);
}

/**
 * Get a Hub Group by id
 * we need to convert the IGroup we get to Hub Group
 * @param identifier
 * @param requestOptions
 */
export async function fetchHubGroup(
  identifier: string,
  requestOptions: IUserRequestOptions
): Promise<IHubGroup> {
  const getPrms = getGroup(identifier, requestOptions);
  return getPrms.then((group: IGroup) => {
    if (!group) return null;
    return convertGroupToHubGroup(group, requestOptions);
  });
}

/**
 * @private
 * Update a Hub Group and return it
 * we need to convert the incoming Hub Group to Igroup
 * before sending it to the API
 * @param hubGroup
 * @param requestOptions
 */
export async function updateHubGroup(
  hubGroup: IHubGroup,
  requestOptions: IRequestOptions
): Promise<IHubGroup> {
  let group = await getGroup(hubGroup.id, requestOptions);
  group = convertHubGroupToGroup(hubGroup);
  await updateGroup({ group, authentication: requestOptions.authentication });
  return hubGroup;
}

/**
 * @private
 * Remove a Hub Group
 * @param id
 * @param requestOptions
 */
export async function deleteHubGroup(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } };
  await removeGroup(ro);
}

/**
 * Convert an IGroup to a Hub Group
 * @param group
 * @param requestOptions
 */
function convertGroupToHubGroup(
  group: IGroup,
  requestOptions: IUserRequestOptions
): IHubGroup {
  const mapper = new PropertyMapper<Partial<IHubGroup>, IGroup>(
    getPropertyMap()
  );
  const hubGroup = mapper.storeToEntity(group, {}) as IHubGroup;
  return computeProps(group, hubGroup, requestOptions);
}

/**
 * Convert a Hub Group to an IGroup
 * @param hubGroup
 */
function convertHubGroupToGroup(hubGroup: IHubGroup): IGroup {
  const mapper = new PropertyMapper<Partial<IHubGroup>, IGroup>(
    getPropertyMap()
  );
  const group = mapper.entityToStore(
    hubGroup,
    {} as unknown as IGroup
  ) as IGroup;
  return group;
}
