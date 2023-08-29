import { IGroup } from "@esri/arcgis-rest-types";
import { fetchGroupEnrichments } from "./_internal/enrichments";
import { getProp, setProp } from "../objects";
import { getGroupThumbnailUrl, IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions, IModel } from "../types";
import { getGroupHomeUrl } from "../urls";
import { unique } from "../util";
import { mapBy } from "../utils";
import {
  getGroup,
  removeGroup,
  createGroup,
  updateGroup,
} from "@esri/arcgis-rest-portal";
import {
  ArcGISRequestError,
  IAuthenticationManager,
  IRequestOptions,
} from "@esri/arcgis-rest-request";
import { IHubGroup } from "../core/types/IHubGroup";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { DEFAULT_GROUP } from "./defaults";
import { convertHubGroupToGroup } from "./_internal/convertHubGroupToGroup";
import { convertGroupToHubGroup } from "./_internal/convertGroupToHubGroup";
import {
  IAddOrInviteContext,
  IAddOrInviteEmail,
  IAddOrInviteToGroupResult,
  IUserOrgRelationship,
  IUserWithOrgType,
} from "./types";
import {
  addOrInviteCollaborationCoordinators,
  addOrInviteCommunityUsers,
  addOrInviteOrgUsers,
  addOrInvitePartneredUsers,
  addOrInviteWorldUsers,
  groupUsersByOrgRelationship,
} from "./_internal/AddOrInviteUsersToGroupMethods";

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

/**
 * Add or invite N users to a single group
 * Org|community|world logic flows are run even if there are no users applicable for that particular path.
 * Results from each path are consolidated and surfaced in the return object as failures and errors are of
 * more importance than successes.
 *
 * @export
 * @param {string} groupId Group we are adding users to
 * @param {IUserWithOrgType[]} users array of users to add
 * @param {IAuthenticationManager} primaryRO primary requestOptions
 * @param {boolean} canAutoAddUser Can we automatically add a user to the group?
 * @param {boolean} addUserAsGroupAdmin Should the user be added as a group administrator
 * @param {IAddOrInviteEmail} email Email object
 * @return {IAddOrInviteToGroupResult} Result object
 */
export async function addOrInviteUsersToGroup(
  groupId: string,
  users: IUserWithOrgType[],
  primaryRO: IAuthenticationManager,
  canAutoAddUser: boolean,
  addUserAsGroupAdmin: boolean,
  email: IAddOrInviteEmail
): Promise<IAddOrInviteToGroupResult> {
  // Group users by their org relationship
  const parsedUsers: IUserOrgRelationship = groupUsersByOrgRelationship(users);
  // build up params for the context
  const inputParams = {
    groupId, // The group ID that the users shall be added/invited to.
    primaryRO, // requestOptions required to auth for all the various add/invite logic except email
    allUsers: users, // All users.
    canAutoAddUser, // can the user be automatically added to the group rather than just invited?
    addUserAsGroupAdmin, // Should they be added to the group as a group Admin vs a normal group member
    email, // Either undefined or an object that contains both message/subject of the email and the auth for the email request
  };
  // create context from params and parsed users
  const context: IAddOrInviteContext = Object.assign(inputParams, parsedUsers);
  // result obj by org relationship
  const result: IAddOrInviteToGroupResult = {
    community: await addOrInviteCommunityUsers(context),
    org: await addOrInviteOrgUsers(context),
    world: await addOrInviteWorldUsers(context),
    partnered: await addOrInvitePartneredUsers(context),
    collaborationCoordinator: await addOrInviteCollaborationCoordinators(
      context
    ),
    notAdded: [],
    notInvited: [],
    notEmailed: [],
    errors: [],
    groupId,
  };
  // Bring not added / invited / emailed / errors up to the top level
  result.notAdded = [
    ...result.community.notAdded,
    ...result.org.notAdded,
    ...result.world.notAdded,
  ];
  result.notInvited = [
    ...result.community.notInvited,
    ...result.org.notInvited,
    ...result.world.notInvited,
  ];
  result.notEmailed = [
    ...result.community.notEmailed,
    ...result.org.notEmailed,
    ...result.world.notEmailed,
  ];
  result.errors = [
    ...result.community.errors,
    ...result.org.errors,
    ...result.world.errors,
  ];
  return result;
}

/**
 * addOrInviteUsersToGroups adds/invites N users to N groups
 * Initial entry point function for add/invite members flow
 * when dealing with multiple groups.
 * Responses from each group are then consolidated into the final returned object.
 *
 * @export
 * @param {string[]} groupIds array of groups we are adding users to
 * @param {IUserWithOrgType[]} users array of users to add to those groups
 * @param {IAuthenticationManager} primaryRO primary requestOptions
 * @param {boolean} [canAutoAddUser=false] Can we automatically add a user to the group?
 * @param {boolean} [addUserAsGroupAdmin=false] Can the user be added to a group as an administrator of that group?
 * @param {IAddOrInviteEmail} [email] Email object contains auth for the email && the email object itself
 * @return {*}  {Promise<{
 *   notAdded: string[];
 *   notInvited: string[];
 *   notEmailed: string[];
 *   errors: ArcGISRequestError[];
 *   responses: IAddOrInviteToGroupResult[];
 * }>} Results object
 */
export async function addOrInviteUsersToGroups(
  groupIds: string[],
  users: IUserWithOrgType[],
  primaryRO: IAuthenticationManager,
  canAutoAddUser: boolean = false,
  addUserAsGroupAdmin: boolean = false,
  email?: IAddOrInviteEmail
): Promise<{
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
  errors: ArcGISRequestError[];
  responses: IAddOrInviteToGroupResult[];
}> {
  let notAdded: string[] = [];
  let notInvited: string[] = [];
  let notEmailed: string[] = [];
  let errors: ArcGISRequestError[] = [];
  const responses: IAddOrInviteToGroupResult[] = [];
  // need to for..of loop this as a reduce will overwrite promises during execution
  // this way we get an object of each group id nicely.
  for (const groupId of groupIds) {
    // For each group we'll add the users to them.
    const result = await addOrInviteUsersToGroup(
      groupId,
      users,
      primaryRO,
      canAutoAddUser,
      addUserAsGroupAdmin,
      email
    );
    // attach each groups results
    responses.push(result);
    // surface results to the top of the stack...
    notAdded = notAdded.concat(result.notAdded);
    errors = errors.concat(result.errors);
    notInvited = notInvited.concat(result.notInvited);
    notEmailed = notEmailed.concat(result.notEmailed);
  }
  // Return built up result object.
  return {
    notAdded,
    notInvited,
    notEmailed,
    errors,
    responses,
  };
}
