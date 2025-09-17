import type { IGroup } from "@esri/arcgis-rest-portal";
import { fetchGroupEnrichments } from "./_internal/enrichments";
import { getProp, setProp } from "../objects";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions } from "../hub-types";
import { unique } from "../util";
import { mapBy } from "../utils";
import {
  getGroup,
  removeGroup,
  createGroup,
  updateGroup,
  protectGroup,
} from "@esri/arcgis-rest-portal";
import { IHubGroup } from "../core/types/IHubGroup";
import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { DEFAULT_GROUP } from "./defaults";
import { convertHubGroupToGroup } from "./_internal/convertHubGroupToGroup";
import { convertGroupToHubGroup } from "./_internal/convertGroupToHubGroup";
import {
  fetchSettingV2,
  getDefaultEntitySettings,
  IEntitySetting,
  setDiscussableKeyword,
} from "../discussions";
import { IHubSearchResult } from "../search/types/IHubSearchResult";
import { computeLinks } from "./_internal/computeLinks";
import { getUniqueGroupTitle } from "./_internal/getUniqueGroupTitle";
import { createOrUpdateEntitySettings } from "../core/_internal/createOrUpdateEntitySettings";
import { IArcGISContext } from "../types";
import { checkPermission } from "../permissions/checkPermission";

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
  context: IArcGISContext
): Promise<IHubGroup> {
  // merge the incoming and default groups
  const hubGroup = { ...DEFAULT_GROUP, ...partialGroup } as IHubGroup;

  // ensure the group has a unique title
  const uniqueTitle = await getUniqueGroupTitle(
    hubGroup.name,
    context.userRequestOptions
  );
  hubGroup.name = uniqueTitle;

  hubGroup.typeKeywords = setDiscussableKeyword(
    hubGroup.typeKeywords,
    hubGroup.isDiscussable
  );

  const group = convertHubGroupToGroup(hubGroup);
  const opts = {
    group,
    authentication: context.userRequestOptions.authentication,
  };
  const result = await createGroup(opts);
  // createGroup does not set a protection value based on the value of 'protected'
  // so we have to make an additional call to protectGroup to set protection
  if (group.protected) {
    result.group.protected = (
      await protectGroup({
        id: result.group.id,
        authentication: context.userRequestOptions.authentication,
      })
    ).success;
  }

  const entity = convertGroupToHubGroup(
    result.group,
    null,
    context.userRequestOptions
  );

  // create or update entity settings
  if (checkPermission("hub:group:settings:discussions", context).access) {
    const entitySetting = await createOrUpdateEntitySettings(
      { ...hubGroup, id: entity.id },
      context.hubRequestOptions
    );
    entity.entitySettingsId = entitySetting.id;
    entity.discussionSettings = entitySetting.settings.discussions;
  }

  return entity;
}

/**
 * Get a Hub Group by id
 * we need to convert the IGroup we get to Hub Group
 * @param identifier
 * @param requestOptions
 */
export async function fetchHubGroup(
  identifier: string,
  context: IArcGISContext
): Promise<IHubGroup> {
  const group = await getGroup(identifier, context.hubRequestOptions);
  let entitySettings;
  if (checkPermission("hub:group:settings:discussions", context).access) {
    entitySettings = await fetchSettingV2({
      id: group.id,
      ...context.hubRequestOptions,
    }).catch(
      () =>
        ({
          id: null,
          ...getDefaultEntitySettings("group"),
        } as IEntitySetting)
    );
  } else {
    entitySettings = {
      id: null,
      ...getDefaultEntitySettings("group"),
    } as IEntitySetting;
  }
  const hubGroup = convertGroupToHubGroup(
    group,
    entitySettings,
    context.hubRequestOptions
  );
  return hubGroup;
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
  context: IArcGISContext
): Promise<IHubGroup> {
  // TODO: fetch the upstream group and convert to a HubGroup so we can compare props

  hubGroup.typeKeywords = setDiscussableKeyword(
    hubGroup.typeKeywords,
    hubGroup.isDiscussable
  );

  const group = convertHubGroupToGroup(hubGroup);

  const opts = {
    group,
    authentication: context.requestOptions.authentication,
  };
  // if we have a field we are trying to clear
  // We need to send clearEmptyFields: true to the updateGroup call
  if (group._clearEmptyFields) {
    setProp("params.clearEmptyFields", true, opts);
  }
  await updateGroup(opts);

  // create or update entity settings
  if (checkPermission("hub:group:settings:discussions", context).access) {
    const entitySetting = await createOrUpdateEntitySettings(
      hubGroup,
      context.hubRequestOptions
    );
    hubGroup.entitySettingsId = entitySetting.id;
    hubGroup.discussionSettings = entitySetting.settings.discussions;
  }

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
