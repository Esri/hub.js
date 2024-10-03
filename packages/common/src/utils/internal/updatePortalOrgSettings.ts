import { _isOrgAdmin, cloneObject } from "../..";
import { IArcGISContext } from "../../ArcGISContext";
import { IHubUserOrgSettings } from "../../core/types/IHubUser";
import { request } from "@esri/arcgis-rest-request";

/**
 * Function to update a user's org settings. Expects the user to be an org admin in the current org.
 * Currently only updates whether to show the informational banner.
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

  // check that user is org admin
  if (!context.isOrgAdmin) {
    throw new Error("User is not an org admin in the current org");
  }

  // grab and clone portalProperties
  const portalProperties = cloneObject(context.portal.portalProperties);
  // grab settings
  const { showInformationalBanner } = settings;
  // update infoBanner value in portalProperties
  portalProperties.hub.settings.informationalBanner = showInformationalBanner;

  // build the url
  const urlPath = `/sharing/rest/portals/self/update?f=json`;
  const url = `${context.portalUrl}${urlPath}`;

  // send the request to update
  return request(url, {
    httpMethod: "POST",
    params: {
      portalProperties: JSON.stringify(portalProperties),
      token: context.hubRequestOptions.authentication.token,
    },
  });
}
