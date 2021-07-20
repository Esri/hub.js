import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { autoAddUsers, getProp } from "@esri/hub-common";
import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { autoAddUsersAsAdmins } from "./auto-add-users-as-admins";
import { processEmailUsers } from "./process-email-users";

export async function processAutoAddUsers(
  context: IAddOrInviteContext,
  userType: string,
  shouldEmail: boolean = false
): Promise<IAddOrInviteResponse> {
  let autoAddResponse;
  let emailResponse;
  let notAdded: string[] = [];
  let errors: ArcGISRequestError[] = [];
  const { asAdmin } = context;

  if (asAdmin) {
    // if is core team we elevate user to admin
    autoAddResponse = await autoAddUsersAsAdmins(
      getProp(context, "groupId"),
      getProp(context, userType),
      getProp(context, "primaryRO")
    );
  } else {
    // if not then we are just auto adding them
    autoAddResponse = await autoAddUsers(
      getProp(context, "groupId"),
      getProp(context, userType),
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
    if (emailResponse.errors) {
      errors = errors.concat(emailResponse.errors);
    }
  }
  return {
    users: getProp(context, userType),
    notAdded,
    errors,
    notEmailed: emailResponse?.notEmailed || [],
    notInvited: [],
  };
}
