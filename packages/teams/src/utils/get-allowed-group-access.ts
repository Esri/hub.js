import type { IUser } from "@esri/arcgis-rest-portal";
import { hasAllPrivileges } from "./has-all-privileges";
import { GROUP_ACCESS_PRIVS } from "./group-access-privs";
import { AGOAccess } from "../types";
import { IPortal } from "@esri/arcgis-rest-portal";
import { getProp } from "@esri/hub-common";

/**
 * Returns the allowed group access based on a user's privileges
 * and org level settings
 * @param requestedAccess public || org || private
 * @param user User object w/ privileges array
 * @param portal optional
 */
export function getAllowedGroupAccess(
  requestedAccess: AGOAccess,
  user: IUser,
  portal?: IPortal
): AGOAccess {
  // portal-wide flag takes presidence, and is not sync'd with privs
  const portalWideCanSharePublic = getProp(portal, "canSharePublic") || false;
  // compute what access level the current user can create the group with
  const canCreatePublic =
    portalWideCanSharePublic &&
    hasAllPrivileges(user, GROUP_ACCESS_PRIVS.public);
  const canCreateOrg = hasAllPrivileges(user, GROUP_ACCESS_PRIVS.org);
  // default to the requested access...
  let result = requestedAccess;
  // if they requested public, but can't make public...
  if (requestedAccess === "public" && !canCreatePublic) {
    // step down to org...
    result = "org";
    // but if they can't do that...
    if (!canCreateOrg) {
      // then do private
      result = "private";
    }
  } else {
    // if the requsted access was not public, it's either org or private
    // and if they can't create do org...
    if (requestedAccess === "org" && !canCreateOrg) {
      // must be private
      result = "private";
    }
  }
  return result;
}
