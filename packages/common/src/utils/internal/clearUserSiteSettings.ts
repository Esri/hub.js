import { IArcGISContext } from "../../ArcGISContext";
import { UserResourceApp } from "../../ArcGISContextManager";
import { removeUserResource } from "./userAppResources";

export const USER_SITE_SETTINGS_APP: UserResourceApp = "self";
export const USER_SITE_SETTINGS_KEY = "hub-site-settings.json";

/**
 * @private
 * Internal use only; Clear User Site Settings
 * @param context
 * @returns
 */
export function clearUserSiteSettings(
  context: IArcGISContext
): Promise<Record<string, any>> {
  const token = context.tokenFor(USER_SITE_SETTINGS_APP);
  const key = USER_SITE_SETTINGS_KEY;
  return removeUserResource(
    context.currentUser.username,
    key,
    context.portalUrl,
    token
  );
}
