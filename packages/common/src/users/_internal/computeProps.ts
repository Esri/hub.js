import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import { getProp } from "../../objects/get-prop";
import { IHubUser } from "../../core";
import { IUser } from "@esri/arcgis-rest-types";
import { IRequestOptions, request } from "@esri/arcgis-rest-request";

export async function computeProps(
  model: IUser,
  user: IHubUser,
  context: IArcGISContext
): Promise<IHubUser> {
  user.settings = context.userHubSettings;

  const signinSettings = await getPortalSignInSettings(context);
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
function getPortalSignInSettings(context: IArcGISContext) {
  const url = `${getPortalUrl(
    context.requestOptions
  )}/portals/self/signinSettings?f=json`;
  const requestOpts = {
    ...context.requestOptions,
    httpMethod: "GET",
  } as IRequestOptions;
  return request(url, requestOpts);
}
