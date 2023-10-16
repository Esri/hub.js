import { IArcGISContext } from "../../ArcGISContext";
import { UserResourceApp } from "../../ArcGISContextManager";
import { removeUserResource } from "./userAppResources";

export const USER_HUB_SETTINGS_APP: UserResourceApp = "hubforarcgis";
export const USER_HUB_SETTINGS_KEY = "hub-settings.json";
/**
 * @private
 * Internal use only; Clear User Hub Settings
 * @param context
 * @returns
 */

export function clearUserHubSettings(
  context: IArcGISContext
): Promise<Record<string, any>> {
  const token = context.tokenFor(USER_HUB_SETTINGS_APP);
  const key = USER_HUB_SETTINGS_KEY;
  return removeUserResource(
    context.currentUser.username,
    key,
    context.portalUrl,
    token
  );
}
