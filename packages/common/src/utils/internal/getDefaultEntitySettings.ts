import { EntitySettingType, IEntitySettings } from "../../discussions";

export function getDefaultEntitySettings(
  type: EntitySettingType
): IEntitySettings {
  return {
    discussions: {
      allowedChannelIds: [],
      allowedLocations: [],
    },
  };
}
