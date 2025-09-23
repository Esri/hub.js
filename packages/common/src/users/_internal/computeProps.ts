import { getPortalUrl, getSelf } from "@esri/arcgis-rest-portal";
import type { IUser } from "@esri/arcgis-rest-portal";
import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubUser } from "../../core/types/IHubUser";
import { failSafe } from "../../utils/fail-safe";

/**
 * Given a model and a user, sets various computed properties that can't be directly mapped.
 * @param model
 * @param user
 * @param context
 * @returns
 */
export async function computeProps(
  model: IUser,
  user: IHubUser,
  context: IArcGISContext
): Promise<IHubUser> {
  // 1. compute any props for user settings
  user.settings = context.userHubSettings;

  // 2. compute any props for user's org settings
  // TODO: only fetch this if the user has necessary privs (org admin)
  const fsGetSignInSettings = failSafe(getPortalSignInSettings, {});
  const signinSettings = await fsGetSignInSettings(context);

  const fsGetSelf = failSafe(getSelf, {});
  const _portalself = await fsGetSelf(context.requestOptions);
  user.hubOrgSettings = {
    showInformationalBanner:
      !!_portalself.portalProperties?.hub?.settings?.informationalBanner,
    enableTermsAndConditions: !!signinSettings.termsAndConditions,
    termsAndConditions: signinSettings.termsAndConditions,
    enableSignupText: !!signinSettings.signupText,
    signupText: signinSettings.signupText,
  };

  return user;
}

/**
 * Fetches the portal's signin settings by making a request to the
 * ${portalUrl}/portals/self/signinSettings endpoint.
 *
 * Returns a promise that resolves with the signin settings object.
 *
 * @param context
 */
export function getPortalSignInSettings(context: IArcGISContext) {
  const url = `${getPortalUrl(
    context.requestOptions
  )}/portals/self/signinSettings`;
  const requestOpts = {
    ...context.requestOptions,
    httpMethod: "GET",
  } as IRequestOptions;
  return request(url, requestOpts);
}
