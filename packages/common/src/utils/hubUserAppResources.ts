import { IArcGISContext } from "../ArcGISContext";
import {
  USER_SITE_SETTINGS_APP,
  USER_SITE_SETTINGS_KEY,
} from "./internal/clearUserSiteSettings";
import {
  USER_HUB_SETTINGS_APP,
  USER_HUB_SETTINGS_KEY,
} from "./internal/clearUserHubSettings";
import {
  applyHubSettingsMigrations,
  applySiteSettingsMigrations,
} from "./internal/siteSettingsMigrations";
import {
  IAddUserResource,
  getUserResource,
  setUserResource,
} from "./internal/userAppResources";

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
}

/**
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
 * Get the current user's settings for the current Site
 * @param context
 * @returns
 */
export async function getUserSiteSettings(
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
 * Get the current user's settings for ArcGIS Hub
 * @param context
 * @returns
 */
export async function getUserHubSettings(
  context: IArcGISContext
): Promise<IUserHubSettings> {
  const token = context.tokenFor(USER_HUB_SETTINGS_APP);

  if (token) {
    const settings = await getUserResource(
      context.currentUser.username,
      USER_HUB_SETTINGS_KEY,
      context.portalUrl,
      token
    );
    return applyHubSettingsMigrations(settings);
  } else {
    return Promise.resolve(null);
  }
}
