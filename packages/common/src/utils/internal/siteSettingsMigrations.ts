import { cloneObject } from "../../util";
import { IUserHubSettings, IUserSiteSettings } from "../hubUserAppResources";

/**
 * Apply migrations for Site Settings
 * @param settings
 * @returns
 */
export function applySiteSettingsMigrations(
  settings: Record<string, any>
): IUserSiteSettings {
  // const currentSchema = 1;

  return cloneObject(settings) as IUserSiteSettings;
}

/**
 * Apply migrations for Hub Settings
 * @param settings
 * @returns
 */
export function applyHubSettingsMigrations(
  settings: Record<string, any>
): IUserHubSettings {
  // const currentSchema = 1;

  return cloneObject(settings) as IUserHubSettings;
}
