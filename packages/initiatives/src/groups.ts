/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  createGroup,
  protectGroup,
  searchGroups,
  removeGroup,
  unprotectGroup,
  getSelf,
  IUserGroupOptions,
  IPortal
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Create all of the groups needed for activating an initiative, provided the user has the
 * correct privs; simply does not create a group if the proper priv not present (rather than
 * throwing an error)
 *
 * @export
 * @param {string} collaborationGroupName name of the collaboration group to be created
 * @param {string} dataGroupName name of the content group to be created
 * @param {IRequestOptions} ro
 * @returns {Promise<any>} object containing the groupIds
 */
export function createInitiativeGroups(
  collaborationGroupName: string,
  dataGroupName: string,
  ro: IRequestOptions
): Promise<any> {
  const state = {} as any;
  return getSelf(ro)
    .then((portal: IPortal) => {
      state.canCreateCollabGroup = portal.user.privileges.includes(
        "portal:admin:createUpdateCapableGroup"
      );
      state.canCreateContentGroup = portal.user.privileges.includes(
        "opendata:user:designateGroup"
      ); // TODO remove this guard when no longer creating open data groups
      const namePromises: any[] = [];
      if (state.canCreateCollabGroup) {
        namePromises.push(
          getUniqueGroupName(collaborationGroupName, portal.id, 0, ro).then(
            name => {
              state.collabGroupName = name;
            }
          )
        );
      }
      if (state.canCreateContentGroup) {
        namePromises.push(
          getUniqueGroupName(dataGroupName, portal.id, 0, ro).then(name => {
            state.dataGroupName = name;
          })
        );
      }
      return Promise.all(namePromises).then(() => {
        return true;
      });
    })
    .then(() => {
      const createPromises = [];
      const result: any = {};
      if (state.collabGroupName) {
        createPromises.push(
          createInitiativeGroup(
            state.collabGroupName,
            state.collabGroupName,
            { isSharedEditing: true },
            ro
          ).then(groupId => {
            result.collabGroupId = groupId;
          })
        );
      }
      if (state.dataGroupName) {
        createPromises.push(
          createInitiativeGroup(
            state.dataGroupName,
            state.dataGroupName,
            { isOpenData: true }, // TODO remove this
            ro
          ).then(groupId => {
            result.dataGroupId = groupId;
          })
        );
      }
      return Promise.all(createPromises).then(() => {
        return result;
      });
    });
}

/**
 * Create an initiative collaboration or open data group
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
      } as IUserGroupOptions;
      return protectGroup(protectOpts);
    })
    .then(() => {
      return groupId;
    });
}

/**
 * Remove an Initiative group.
 * This assumes the group is protected
 *
 * @export
 * @param {string} id
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<any>}
 */
export function removeInitiativeGroup(
  id: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const opts = {
    id,
    ...requestOptions
  } as IUserGroupOptions;
  return unprotectGroup(opts).then(
    () => {
      return removeGroup(opts);
    },
    ex => {
      // check if the failure is b/c the group does not exist...
      if (ex.messageCode === "COM_0003" && ex.code === 400) {
        return Promise.resolve({ success: true });
      } else {
        throw ex;
      }
    }
  );
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
  const options = {
    q: `${title} AND orgid: ${orgId}`,
    ...requestOptions
  };

  return searchGroups(options).then((response: any) => {
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
