import { IUser } from "@esri/arcgis-rest-types";
import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { getProp } from "../../objects/get-prop";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { autoAddUsers } from "../autoAddUsers";
import { processEmailUsers } from "./processEmailUsers";
import { autoAddUsersAsAdmins } from "./autoAddUsersAsAdmins";

/**
 * @private
 * Governs logic for automatically adding N users to a group.
 * Users are added as either a regular user OR as an administrator of the group
 * depending on the addUserAsGroupAdmin prop on the IAddOrInviteContext.
 * If there is an email object on the IAddOrInviteContext, then email notifications are sent.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @param {string} userType what type of user is it: org | world | community
 * @param {boolean} [shouldEmail=false] should the user be emailed?
 * @return {IAddOrInviteResponse} response object
 */
export async function processAutoAddUsers(
  context: IAddOrInviteContext,
  userType:
    | "world"
    | "org"
    | "community"
    | "partnered"
    | "collaborationCoordinator",
  shouldEmail: boolean = false
): Promise<IAddOrInviteResponse> {
  // fetch users out of context object
  const users: IUser[] = getProp(context, userType);
  let autoAddResponse;
  let emailResponse;
  let notAdded: string[] = [];
  let errors: ArcGISRequestError[] = [];
  // fetch addUserAsGroupAdmin out of context
  const { addUserAsGroupAdmin } = context;

  if (addUserAsGroupAdmin) {
    // if is core group we elevate user to admin
    autoAddResponse = await autoAddUsersAsAdmins(
      getProp(context, "groupId"),
      users,
      getProp(context, "primaryRO")
    );
  } else {
    // if not then we are just auto adding them
    autoAddResponse = await autoAddUsers(
      getProp(context, "groupId"),
      users,
      getProp(context, "primaryRO")
    );
  }
  // handle notAdded users
  if (autoAddResponse.notAdded) {
    notAdded = notAdded.concat(autoAddResponse.notAdded);
  }
  // Merge errors into empty array
  if (autoAddResponse.errors) {
    errors = errors.concat(autoAddResponse.errors);
  }
  // run email process
  if (shouldEmail) {
    emailResponse = await processEmailUsers(context);
    // merge errors in to overall errors array to keep things flat
    if (emailResponse.errors && emailResponse.errors.length > 0) {
      errors = errors.concat(emailResponse.errors);
    }
  }
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  return {
    users: users.map((u) => u.username),
    notAdded,
    errors,
    notEmailed: emailResponse?.notEmailed || [],
    notInvited: [],
  };
}
