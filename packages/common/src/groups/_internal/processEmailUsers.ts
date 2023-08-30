import { IUser } from "@esri/arcgis-rest-types";
import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { getProp } from "../../objects/get-prop";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { emailOrgUsers } from "../emailOrgUsers";

/**
 * @private
 * Governs the logic for emailing N users. It acts under the assumption
 * that all the 'community' users are the ones being emailed (this is due to platform rules we conform to)
 * Function is called upstream depending on if an email object is attached to the context.
 * Email object contains its own auth as it'll require the community admin to send the email itself.
 * An individual email call goes out for each user due to how the response of multiple users in a single call works.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function processEmailUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // Fetch users out of context. We only email community users so we are
  // explicit about that
  const users: IUser[] = getProp(context, "community");
  const notEmailed: string[] = [];
  let errors: ArcGISRequestError[] = [];
  // iterate through users as we want a distinct email call per user due to how
  // batch email will only respond with success: true/false
  // and if there is an error then it gets priority even though successes do still go through
  for (const user of users) {
    // Make email call...
    const emailResponse = await emailOrgUsers(
      [user],
      getProp(context, "email.message"),
      getProp(context, "email.auth"),
      true
    );
    // If it's just a failed email
    // then add username to notEmailed array
    if (!emailResponse.success) {
      notEmailed.push(user.username);
      // If there was a legit error
      // Then only the error returns from
      // online. Add error AND include username in notEmailed array.
      if (emailResponse.errors) {
        errors = errors.concat(emailResponse.errors);
      }
    }
  }
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  return {
    users: users.map((u) => u.username),
    notEmailed,
    errors,
    notInvited: [],
    notAdded: [],
  };
}
