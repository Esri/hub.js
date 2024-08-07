import { IUser } from "@esri/arcgis-rest-types";
import {
  fetchUserHubSettings,
  getPortalUrl,
  getProp,
  IArcGISContext,
  IHubUser,
} from "../..";
import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { IPortal } from "@esri/arcgis-rest-portal";

export async function computeProps(
  model: IUser,
  user: IHubUser,
  context: IArcGISContext
): Promise<IHubUser> {
  user.settings = await fetchUserHubSettings(context);

  const signinSettings = await getPortalSigninSettings(context);
  user.hubOrgSettings = {
    showInformationalBanner: getProp(
      context,
      "portal.portalProperties.hub.settings.informationalBanner"
    ),
    termsAndConditions: signinSettings.termsAndConditions,
    signupText: signinSettings.signupText,
  };
  return user;
}

/** gets the given portal's signin settings */
function getPortalSigninSettings(context: IArcGISContext) {
  const url = `${getPortalUrl(
    context.requestOptions
  )}/sharing/rest/portals/self/signinSettings`;
  const requestOpts = {
    ...context.requestOptions,
    httpMethod: "GET",
  } as IRequestOptions;

  return request(url, requestOpts);
}
