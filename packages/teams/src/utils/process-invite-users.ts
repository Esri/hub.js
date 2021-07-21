import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";
import { getProp, inviteUsers } from "@esri/hub-common";
import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";

/**
 * @private
 * Process invite of users
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @param {string} userType what type of user is it: org | world | community
 * @return {IAddOrInviteResponse} response object
 */
export async function processInviteUsers(
  context: IAddOrInviteContext,
  userType: string
): Promise<IAddOrInviteResponse> {
  // Fetch users out of context based on userType
  const users: IUser[] = getProp(context, userType);
  const notInvited: string[] = [];
  let errors: ArcGISRequestError[] = [];
  // iterate through users as we want a distinct invite call per user due to how
  // batch invites will only respond with success: true/false
  // and if there is an error then it gets priority even though successes do still go through
  for (const user of users) {
    // Invite users call
    const inviteResponse = await inviteUsers(
      getProp(context, "groupId"),
      [user],
      getProp(context, "primaryRO")
    );
    // If it's just a failed invite then
    // add username to notInvited array
    if (!inviteResponse.success) {
      notInvited.push(user.username);
      // If there was a legit error
      // Then only the error returns from
      // online. Add error AND include username in notInvited array.
      if (inviteResponse.errors) {
        errors = errors.concat(inviteResponse.errors);
      }
    }
  }
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  return {
    users: users.map((u) => u.username),
    notInvited,
    errors,
    notEmailed: [],
    notAdded: [],
  };
}
