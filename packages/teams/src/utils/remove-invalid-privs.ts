import { IUser } from "@esri/arcgis-rest-auth";
import { cloneObject, includes, without } from "@esri/hub-common";

const ALLOWED_SUBSCRIPTION_TYPES = [
  "Demo & Marketing",
  "Organizational Plan",
  "Community",
  "In House",
  "ConnectED",
  "ELA",
  "Education Site License",
  "Education",
  "HUP Online"
];

/**
 * TODO: If/when AGO implements this logic or runs a script on their end we can remove
 * this logic, or simply return passed in user.
 * Returns a cloned copy of the user object with updated privileges
 * based on whether or not the user has a subscription type not in the
 * allowed list
 * @param {object} user
 * @param {string} subscriptionInfoType
 * @returns
 */
export function removeInvalidPrivs(
  user: IUser,
  subscriptionInfoType: string
): IUser {
  // Clone User
  const clonedUser = cloneObject(user);
  // Get allowed list of sub types
  const allowedSubscriptionTypes = ALLOWED_SUBSCRIPTION_TYPES;
  // If portal self has a sub type OTHER than one of the allowed ones...
  if (!includes(allowedSubscriptionTypes, subscriptionInfoType)) {
    clonedUser.privileges = without(
      clonedUser.privileges,
      "portal:user:addExternalMembersToGroup"
    );
  }
  return clonedUser;
}
