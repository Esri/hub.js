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

  if (!context.isCommunityOrg || context.currentUser.role !== "org_admin") {
    throw new Error("User is not an org admin in the current community org");
  }

  // only if we have them enabled and we have values do we send them in the request
  const signupText =
    settings.enableSignupText && settings.signupText
      ? settings.signupText
      : null;
  const termsAndConditions =
    settings.enableTermsAndConditions && settings.termsAndConditions
      ? settings.termsAndConditions
      : null;

  // build the url
  const urlPath = "/portals/self/setSigninSettings?f=json";
  const url = `${context.portalUrl}${urlPath}`;

  // send the request to update
  return request(url, {
    httpMethod: "POST",
    params: {
      termsAndConditions,
      signupText,
      token: context.hubRequestOptions.authentication.token,
    },
  });
}
