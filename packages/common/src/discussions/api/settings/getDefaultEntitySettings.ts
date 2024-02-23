import { EntitySettingType, IEntitySetting, IEntitySettings } from "../types";
import { HubEntityType } from "../../../core/types";

const DISCUSSION_SETTINGS: IEntitySettings = {
  discussions: {
    allowedChannelIds: null,
    allowedLocations: null,
  },
};

const DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE: Record<
  HubEntityType,
  { type: EntitySettingType; settings: IEntitySettings }
> = {
  discussion: {
    type: EntitySettingType.CONTENT,
    settings: { ...DISCUSSION_SETTINGS },
  },
  site: null,
  project: null,
  initiative: null,
  initiativeTemplate: null,
  page: null,
  content: null,
  org: null,
  group: null,
  template: null,
  survey: null,
};

export function getDefaultEntitySettings(
  entityType: HubEntityType
): Partial<IEntitySetting> {
  if (!DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE[entityType]) {
    throw new Error(`no default entity settings defined for ${entityType}`);
  }
  return {
    type: DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE[entityType].type,
    settings: {
      ...DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE[entityType].settings,
    },
  };
}
