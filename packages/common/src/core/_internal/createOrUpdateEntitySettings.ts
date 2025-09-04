import { Polygon } from "geojson";
import { IHubRequestOptions } from "../../hub-types";
import { IEntitySetting, IEntitySettings } from "../../discussions/api/types";
import { getTypeFromEntity } from "../getTypeFromEntity";
import { getDefaultEntitySettings } from "../../discussions/api/settings/getDefaultEntitySettings";
import {
  createSettingV2,
  updateSettingV2,
} from "../../discussions/api/settings/settings";
import { IWithDiscussions } from "../traits/IWithDiscussions";

/**
 * Creates or updates the entity settings for an entity. Currently this how the following are configured/persisted:
 *   1. allowed participation channels
 *   2. allowed locations (geometries representing the region(s) on the map where users can draw custom geometries to attach to their posts/replies)
 * @param entity An IHubEntity that implements discussions-related traits
 * @param requestOptions An IHubRequestOptions object
 * @param allowedLocations An optional Polygon[] representing the allowed locations for discussion post/reply geometries, defaults to null
 * @returns a promise that resolves an IEntitySetting object
 */
export async function createOrUpdateEntitySettings<
  T extends IWithDiscussions & { id: string; type: string }
>(
  entity: T,
  requestOptions: IHubRequestOptions,
  allowedLocations: Polygon[] = null
): Promise<IEntitySetting> {
  // create or update entity settings
  const entityType = getTypeFromEntity(entity);
  const defaultSettings = getDefaultEntitySettings(entityType);
  const settings: IEntitySettings = {
    ...defaultSettings.settings,
    discussions: {
      ...defaultSettings.settings.discussions,
      ...entity.discussionSettings,
      allowedLocations,
    },
  };
  if (!settings.discussions.allowedChannelIds?.length) {
    settings.discussions.allowedChannelIds = null;
  }
  if (!settings.discussions.allowedLocations?.length) {
    settings.discussions.allowedLocations = null;
  }
  const newOrUpdatedSettings = entity.entitySettingsId
    ? await updateSettingV2({
        id: entity.entitySettingsId,
        data: {
          settings,
        },
        ...requestOptions,
      })
    : await createSettingV2({
        data: {
          id: entity.id,
          type: defaultSettings.type,
          settings,
        },
        ...requestOptions,
      });

  return newOrUpdatedSettings;
}
