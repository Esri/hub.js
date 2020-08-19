import { IAddGroupUsersResult } from "@esri/arcgis-rest-portal";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { getProp } from "../../../objects/get-prop";
import { includes } from "../../../utils";
import { IAddMemberContext } from "../interfaces";

/**
 * @private
 *
 * Coerce autoAdd response into a more similar interface as
 * the other rest calls.
 *
 * If any users are not auto added, an error is added to the response
 * and unadded users are placed into the invitation list
 */
export function _formatAutoAddResponse(
  rawResponse: IAddGroupUsersResult,
  context: IAddMemberContext
): IAddMemberContext {
  if (rawResponse) {
    const success =
      !getProp(rawResponse, "notAdded.length") && !rawResponse.errors;
    context.autoAddResult = { success };

    if (!success) {
      const errors = rawResponse.errors || [];
      if (getProp(rawResponse, "notAdded.length")) {
        errors.push(
          new ArcGISRequestError(
            `Users not auto-added: ${rawResponse.notAdded.join(", ")}`
          )
        );
      }
      context.autoAddResult.errors = errors;

      // Move unadded users to invite list;
      const unaddedUsers = context.usersToAutoAdd.filter(user =>
        includes(rawResponse.notAdded, user.username)
      );
      context.usersToInvite = context.usersToInvite.concat(unaddedUsers);
    }
  }

  return context;
}
