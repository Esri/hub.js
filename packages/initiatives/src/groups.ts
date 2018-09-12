/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  createGroup,
  protectGroup,
  searchGroups,
  IGroupIdRequestOptions
} from "@esri/arcgis-rest-groups";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Create an initiative collaboration or ope data groups
 * Note: This does not ensure a group with the proposed name does not exist. Please use
 * `checkGroupExists
 *
 * @export
 * @param {string} name
 * @param {string} description
 * @param {*} options {isOpenData: boolean, isSharedEditing: boolean}
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IInitiativeModel>}
 */
export function createInitiativeGroup(
  name: string,
  description: string,
  options: any,
  requestOptions: IRequestOptions
): Promise<string> {
  const group = {
    title: name,
    description,
    access: "org",
    sortField: "title",
    sortOrder: "asc"
  } as any;

  if (options.isOpenData) {
    group.isOpenData = true;
    group.tags = ["Hub Initiative Group", "Open Data"];
    group.access = "public";
  }

  if (options.isSharedEditing) {
    group.capabilities = "updateitemcontrol";
    group._edit_privacy = "on";
    group._edit_contributors = "on";
    group.tags = ["Hub Initiative Group", "initiativeCollaborationGroup"];
  }

  const createOpts = {
    group,
    ...requestOptions
  };

  // The protect call does not return the groupId, but we need to return it
  // from this function, so we create a var in this scope to hold it...
  let groupId: string;

  // create the group
  return createGroup(createOpts)
    .then((result: any) => {
      groupId = result.group.id;
      // protect it
      const protectOpts = {
        id: groupId,
        ...requestOptions
      } as IGroupIdRequestOptions;
      return protectGroup(protectOpts);
    })
    .then(() => {
      return groupId;
    });
}

/**
 * Check if a group with a specific title exists in an org
 * If it does exist, and has the correct properties, we return the
 * @export
 * @param {string} title
 * @param {string} orgId
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<boolean>}
 */
export function checkGroupExists(
  title: string,
  orgId: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const searchForm = {
    q: `${title} AND orgid: ${orgId}`
  };
  return searchGroups(searchForm, requestOptions).then((response: any) => {
    const result = {
      exists: false
    } as any;
    if (response.total > 0) {
      result.exists = true;
      result.group = response.results[0];
    }
    return result;
  });
}

/**
 * Group names must be unique within an organization
 *
 * @export
 * @param {string} title
 * @param {string} orgId
 * @param {number} [step=0]
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<string>}
 */
export function getUniqueGroupName(
  title: string,
  orgId: string,
  step: number,
  requestOptions: IRequestOptions
): Promise<string> {
  let proposedName = title;
  if (step) {
    proposedName = `${title} - ${step}`;
  }
  return checkGroupExists(proposedName, orgId, requestOptions).then(result => {
    if (result.exists) {
      // increment the step...
      step = step + 1;
      return getUniqueGroupName(title, orgId, step, requestOptions);
    } else {
      return proposedName;
    }
  });
}

export function isSharedEditingGroup(group: any): boolean {
  return !!(group.capabilities.indexOf("updateitemcontrol") > -1);
}
