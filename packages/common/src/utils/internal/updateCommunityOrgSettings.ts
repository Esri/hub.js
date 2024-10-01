import { _isOrgAdmin, getPortalUrl } from "../..";
import { IArcGISContext } from "../../ArcGISContext";
import { IHubUserOrgSettings } from "../../core/types/IHubUser";
import { request } from "@esri/arcgis-rest-request";

/**
 * Function to update a user's community org settings
 * @param settings
 */
export async function updateUserCommunityOrgSettings(
  settings: IHubUserOrgSettings,
  context: IArcGISContext
) {
  // check that user is authed
  if (!context.currentUser) {
    throw new Error("User is not authenticated");
  }

  // check that user is in community org and is org admin
  if (!context.isCommunityOrg || !context.isOrgAdmin) {
    throw new Error("User is not an org admin in the current community org");
  }

  // only if we have them enabled and we have values do we send them in the request
  const signupText =
    settings.enableSignupText && settings.signupText ? settings.signupText : "";
  const termsAndConditions =
    settings.enableTermsAndConditions && settings.termsAndConditions
      ? settings.termsAndConditions
      : "";

  // build the url
  const urlPath = "/sharing/rest/portals/self/setSigninSettings?f=json";
  const url = `${context.portalUrl}${urlPath}`;

  // if we do not have values for one of the fields, we want to clear it
  const clearEmptyFields: boolean = !signupText || !termsAndConditions;

  // send the request to update
  return request(url, {
    httpMethod: "POST",
    params: {
      termsAndConditions,
      signupText,
      clearEmptyFields,
      token: context.hubRequestOptions.authentication.token,
    },
  });
}
