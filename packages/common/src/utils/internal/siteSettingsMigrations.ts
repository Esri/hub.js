import { getProp } from "../../objects/get-prop";
import { cloneObject } from "../../util";
import { hasOwnProperty } from "../hasOwnProperty";
import { IUserHubSettings } from "../IUserHubSettings";
import { IUserSiteSettings } from "../IUserSiteSettings";

// Used to enable legacy migrations
type ILegacyUserHubSettings = IUserHubSettings & { [key: string]: unknown };

/**
 * Apply migrations for Site Settings
 * @param settings
 * @returns
 */
export function applySiteSettingsMigrations(
  settings: IUserSiteSettings
): IUserSiteSettings {
  return cloneObject(settings);
}

/**
 * Apply migrations for Hub Settings
 * @param settings
 * @returns
 */
export function applyHubSettingsMigrations(
  settings: IUserHubSettings
): IUserHubSettings {
  // All the migration functions take and return ILegacyUserHubSettings
  // so we can chain them together, and at the end we cast back to IUserHubSettings
  let clone = cloneObject(settings) as ILegacyUserHubSettings;
  clone = swapPreviewToFeatures(clone);
  return clone as IUserHubSettings;
}

/**
 * Migration to swap .preview to .features which allows for
 * opting in and out of features
 * @private
 * @param settings
 * @returns
 */
function swapPreviewToFeatures(
  settings: ILegacyUserHubSettings
): ILegacyUserHubSettings {
  if (settings.schemaVersion < 1.1) {
    settings.schemaVersion = 1.1;
    // if we have .preview, we need to copy it to .features
    if (hasOwnProperty(settings, "preview") && !settings.features) {
      // if preview has .workspace, copy it to .features
      if (
        hasOwnProperty(settings.preview as Record<string, unknown>, "workspace")
      ) {
        // If .preview exists and .features does not, copy .preview to .features
        settings.features = {
          workspace: getProp(settings, "preview.workspace") as boolean,
        };
      } else {
        // set .features to an empty object
        settings.features = {};
      }
    }
    // Ensure .preview is removed
    delete settings.preview;
  }
  return settings;
}

// FUTURE: For when we end the opt-out period for workspaces
// /**
//  * Remove the workspace feature because the opt-out period has ended.
//  * @param settings
//  * @returns
//  */
// function endWorkspaceOptOut(
//   settings: ILegacyUserHubSettings,
// ): ILegacyUserHubSettings {
//   // TODO: Ensure this is the most recent schema version when this is implemented
//   if (settings.schemaVersion < 1.3) {
//     if (hasOwnProperty(settings, "features") && settings.features) {
//       // when workspace is released we remove the workspace feature
//       // if the user opts out, it will be re-added as false.
//       delete settings.features.workspace;
//     }
//     settings.schemaVersion = 1.3;
//   }

//   return settings;
// }
