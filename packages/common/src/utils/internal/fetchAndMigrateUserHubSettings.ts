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
  const settings = (await fsGetResource(
    username,
    USER_HUB_SETTINGS_KEY,
    portalUrl,
    token
  )) as IUserHubSettings;
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
  // This is current for schemaVersion 1.1 but can be updated as needed
  // but it is run through migrations after being returned
  // so it doesn't need to be the latest version
  return {
    schemaVersion: 1.1,
    username,
    updated: new Date().getTime(),
    features: {
      workspace: false,
    },
  };
}
