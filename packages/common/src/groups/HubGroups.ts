import { IGroup } from "@esri/arcgis-rest-types";
import { fetchGroupEnrichments } from "./_internal/enrichments";
import { getProp, setProp } from "../objects";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions } from "../types";
import { unique } from "../util";
import { mapBy } from "../utils";
import {
  getGroup,
  removeGroup,
  createGroup,
  updateGroup,
  protectGroup,
  unprotectGroup,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubGroup } from "../core/types/IHubGroup";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { DEFAULT_GROUP } from "./defaults";
import { convertHubGroupToGroup } from "./_internal/convertHubGroupToGroup";
import { convertGroupToHubGroup } from "./_internal/convertGroupToHubGroup";
import { setDiscussableKeyword } from "../discussions";
import { IHubSearchResult } from "../search/types/IHubSearchResult";
import { computeLinks } from "./_internal/computeLinks";
import { getUniqueGroupTitle } from "./_internal/getUniqueGroupTitle";

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
    rawResult: group,
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
  result.links = computeLinks(group, requestOptions);

  return result;
}

/**
 * Create a new Hub Group
 * we are creating an IGroup with the createGroup call
 * so we need to convert the Hub Group to IGroup first
 * then convert it back to Hub Group and return it
 * @param partialGroup
 * @param requestOptions
 */
export async function createHubGroup(
  partialGroup: Partial<IHubGroup>,
  requestOptions: IUserRequestOptions
): Promise<IHubGroup> {
  // merge the incoming and default groups
  const hubGroup = { ...DEFAULT_GROUP, ...partialGroup } as IHubGroup;

  // ensure the group has a unique title
  const uniqueTitle = await getUniqueGroupTitle(hubGroup.name, requestOptions);
  hubGroup.name = uniqueTitle;

  hubGroup.typeKeywords = setDiscussableKeyword(
    hubGroup.typeKeywords,
    hubGroup.isDiscussable
  );
  const group = convertHubGroupToGroup(hubGroup);
  const opts = {
    group,
    authentication: requestOptions.authentication,
  };
  const createdGroup = await createGroup(opts).then(async (res) => {
    // protecting the group requires a separate call
    if (group.protected) {
      res.group.protected = (
        await protectGroup({
          id: res.group.id,
          authentication: requestOptions.authentication,
        })
      ).success;
    }
    return res.group;
  });

  return convertGroupToHubGroup(createdGroup, requestOptions);
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
  const group = await getGroup(identifier, requestOptions);
  return convertGroupToHubGroup(group, requestOptions);
}

/**
 * @private
 * Update a Hub Group and return it
 * we need to convert the incoming Hub Group to IGroup
 * before sending it to the API
 * @param hubGroup
 * @param requestOptions
 */
export async function updateHubGroup(
  hubGroup: IHubGroup,
  requestOptions: IRequestOptions
): Promise<IHubGroup> {
  // TODO: fetch the upstream group and convert to a HubGroup so we can compare props

  hubGroup.typeKeywords = setDiscussableKeyword(
    hubGroup.typeKeywords,
    hubGroup.isDiscussable
  );
  const group = convertHubGroupToGroup(hubGroup);

  const opts = {
    group,
    authentication: requestOptions.authentication,
  };
  // if we have a field we are trying to clear
  // We need to send clearEmptyFields: true to the updateGroup call
  if (group._clearEmptyFields) {
    setProp("params.clearEmptyFields", true, opts);
  }
  await updateGroup(opts);
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
