import { IArcGISContext } from "../ArcGISContext";
import {
  USER_SITE_SETTINGS_APP,
  USER_SITE_SETTINGS_KEY,
} from "./internal/clearUserSiteSettings";
import {
  USER_HUB_SETTINGS_APP,
  USER_HUB_SETTINGS_KEY,
} from "./internal/clearUserHubSettings";
import { applySiteSettingsMigrations } from "./internal/siteSettingsMigrations";
import {
  IAddUserResource,
  getUserResource,
  setUserResource,
} from "./internal/userAppResources";
import { fetchAndMigrateUserHubSettings } from "./internal/fetchAndMigrateUserHubSettings";

/**
 * Site Level Settings
 */
export interface IUserSiteSettings {
  schemaVersion: number;
  username?: string;
  updated?: number;
}

/**
 * Hub Level Settings
 */
export interface IUserHubSettings {
  schemaVersion: number;
  username?: string;
  updated?: number;
  /**
   * Features that are enabled for the user in preview mode
   */
  preview?: {
    /**
     *
     */
    workspace: boolean;
  };
}

/**
 * @private
 * DEPRECATED: Use `updateUserSiteSettings` instead
 * Store User settings in the Site App's cache
 * @param settings
 * @param context
 * @param replace
 * @returns
 */
export async function setUserSiteSettings(
  settings: IUserSiteSettings,
  context: IArcGISContext,
  replace: boolean = false
): Promise<void> {
  return updateUserSiteSettings(settings, context, replace);
}

/**
 * @private
 * DEPRECATED: Use `fetchUserSiteSettings`
 * Get the current user's settings for the current Site
 * @param context
 * @returns
 */
export async function getUserSiteSettings(
  context: IArcGISContext
): Promise<IUserSiteSettings> {
  return fetchUserSiteSettings(context);
}

/**
 * @private
 * DEPRECATED: use `updateUserHubSettings` instead
 * Store the current user's Hub settings
 * @param settings
 * @param context
 * @param replace
 * @returns
 */
export async function setUserHubSettings(
  settings: IUserHubSettings,
  context: IArcGISContext,
  replace: boolean = false
): Promise<void> {
  return updateUserHubSettings(settings, context, replace);
}

/**
 * @private
 * DEPRECATED: Use `fetchUserHubSettings`
 * Get the current user's settings for ArcGIS Hub
 * @param context
 * @returns
 */
export async function getUserHubSettings(
  context: IArcGISContext
): Promise<IUserHubSettings> {
  return fetchUserHubSettings(context);
}

/**
 * Store User settings in the Site App's cache
 * @param settings
 * @param context
 * @param replace
 * @returns
 */
export async function updateUserSiteSettings(
  settings: IUserSiteSettings,
  context: IArcGISContext,
  replace: boolean = false
): Promise<void> {
  const token = context.tokenFor(USER_SITE_SETTINGS_APP);

  if (token) {
    // always stamp in the updated and username properties
    settings.updated = new Date().getTime();
    settings.username = context.currentUser.username;

    const resource: IAddUserResource = {
      key: USER_SITE_SETTINGS_KEY,
      data: settings,
      access: "userappprivate",
    };
    return setUserResource(
      resource,
      context.currentUser.username,
      context.portalUrl,
      token,
      replace
    );
  } else {
    throw new Error(
      `No user-app-resource token available to store Site Settings`
    );
  }
}

/**
 * Fetch the user's settings for the current Site
 * @param context
 * @returns
 */
export async function fetchUserSiteSettings(
  context: IArcGISContext
): Promise<IUserSiteSettings> {
  const token = context.tokenFor(USER_SITE_SETTINGS_APP);

  if (token) {
    const settings = (await getUserResource(
      context.currentUser.username,
      USER_SITE_SETTINGS_KEY,
      context.portalUrl,
      token
    )) as Promise<IUserSiteSettings>;
    // run though schema upgrades
    return applySiteSettingsMigrations(settings);
  } else {
    return Promise.resolve(null);
  }
}

/**
 * Store the current user's Hub settings as a User App Resource
 * @param settings
 * @param context
 * @param replace
 * @returns
 */
export async function updateUserHubSettings(
  settings: IUserHubSettings,
  context: IArcGISContext,
  replace: boolean = false
): Promise<void> {
  const token = context.tokenFor(USER_HUB_SETTINGS_APP);

  if (token) {
    // always stamp in the updated and username properties
    settings.updated = new Date().getTime();
    settings.username = context.currentUser.username;
    const resource: IAddUserResource = {
      key: USER_HUB_SETTINGS_KEY,
      data: settings,
      access: "userappprivate",
    };
    return setUserResource(
      resource,
      context.currentUser.username,
      context.portalUrl,
      token,
      replace
    );
  } else {
    throw new Error(
      `No user-app-resource token available to store Site Settings`
    );
  }
}

/**
 * Fetch the current user's settings for ArcGIS Hub
 * Will return null if the hubforarcgis token is not available
 * @param context
 * @returns
 */
export async function fetchUserHubSettings(
  context: IArcGISContext
): Promise<IUserHubSettings> {
  const token = context.tokenFor(USER_HUB_SETTINGS_APP);
  if (token) {
    return await fetchAndMigrateUserHubSettings(
      context.currentUser.username,
      context.portalUrl,
      token
    );
  } else {
    return Promise.resolve(null);
  }
}
