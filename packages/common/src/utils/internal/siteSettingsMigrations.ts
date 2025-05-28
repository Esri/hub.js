import { cloneObject } from "../../util";
import { IUserHubSettings } from "../IUserHubSettings";
import { IUserSiteSettings } from "../IUserSiteSettings";

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
  let clone = cloneObject(settings) as IUserHubSettings;
  clone = swapPreviewToFeatures(clone);
  return clone;
}

/**
 * Migration to swap .preview to .features which allows for
 * opting in and out of features
 * @private
 * @param settings
 * @returns
 */
function swapPreviewToFeatures(settings: IUserHubSettings): IUserHubSettings {
  if (settings.schemaVersion <= 1.1) {
    settings.schemaVersion = 1.1;
    if (settings.preview && !settings.features) {
      settings.features = settings.preview;
    }
    // Ensure .preview is removed
    delete settings.preview;
  }
  return settings;
}
