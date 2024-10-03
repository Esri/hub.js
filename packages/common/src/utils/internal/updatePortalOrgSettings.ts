import { _isOrgAdmin } from "../..";
import { IArcGISContext } from "../../ArcGISContext";
import { IHubUserOrgSettings } from "../../core/types/IHubUser";
import { request } from "@esri/arcgis-rest-request";

/**
 * Function to update a user's community org settings. Expects the user to be an org admin in the current community org.
 * @param settings
 */
export async function updatePortalOrgSettings(
  settings: IHubUserOrgSettings,
  context: IArcGISContext
) {
  // check that user is authed
  if (!context.currentUser) {
    throw new Error("User is not authenticated");
  }

  // check that user is in community org and is org admin
  if (!context.isOrgAdmin) {
    throw new Error("User is not an org admin in the current community org");
  }

  // grab settings
  const { showInformationalBanner } = settings;

  // build the url
  const urlPath = "/sharing/rest/portals/self/setSigninSettings?f=json";
  const url = `${context.portalUrl}${urlPath}`;

  // send the request to update
  return request(url, {
    httpMethod: "POST",
    params: {
      showInformationalBanner,
      token: context.hubRequestOptions.authentication.token,
    },
  });
}
