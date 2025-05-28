import { failSafe } from "../fail-safe";
import { IUserHubSettings } from "../IUserHubSettings";
import { USER_HUB_SETTINGS_KEY } from "./clearUserHubSettings";
import { applyHubSettingsMigrations } from "./siteSettingsMigrations";
import { getUserResource } from "./userAppResources";

/**
 * @private
 * Fetch the User Hub Settings and apply migrations
 * Caller is responsible for ensuring the passed token
 * is assoicated with the `hubforarcgis` client id
 * @param username
 * @param portalUrl
 * @param token
 * @returns
 */
export async function fetchAndMigrateUserHubSettings(
  username: string,
  portalUrl: string,
  token: string
): Promise<IUserHubSettings> {
  // create failsafe function that returns a default Hub Settings object
  const fsGetResource = failSafe(
    getUserResource,
    getDefaultUserHubSettings(username)
  );
  // fetch the user's Hub Settings
  const settings = await fsGetResource(
    username,
    USER_HUB_SETTINGS_KEY,
    portalUrl,
    token
  );
  // apply any migrations and return the result
  return applyHubSettingsMigrations(settings);
}

/**
 * Get a default Hub Settings object for a user
 * This will be run through migrations, so it's ok if it's not the latest version
 * @param username
 * @returns
 */
function getDefaultUserHubSettings(username: string): IUserHubSettings {
  // TODO: We may need to consider how we swap the features.workspace flag
  // based on the release status of the workspace feature.
  // For now, since we are in the opt-in phase, we will set it to false.
  // If the workspace feature is released, this should be set to true.
  return {
    schemaVersion: 1.1,
    username,
    updated: new Date().getTime(),
    features: {
      workspace: false,
    },
  };
}
