import { failSafe } from "../utils";
import {
  unprotectGroup,
  removeGroup,
  IUserGroupOptions
} from "@esri/arcgis-rest-portal";

/**
 * Unprotect and Remove a Group.
 * Assumed caller has checked that the current user should be able
 * to unprotect and remove the group. Underlying calls are failsafe
 * so a failure to unprotect or remove the group will not reject
 * @param {IUserGroupOptions} userGroupOptions id and authentication
 */
export function _unprotectAndRemoveGroup(userGroupOptions: IUserGroupOptions) {
  const failSafeUnprotect = failSafe(unprotectGroup, { success: true });
  const failSafeRemove = failSafe(removeGroup, { success: true });
  return failSafeUnprotect(userGroupOptions)
    .then(() => {
      return failSafeRemove(userGroupOptions);
    })
    .catch((err: Error) => {
      throw Error(`unprotectAndRemoveGroup: Error removing Group: ${err}`);
    });
}
