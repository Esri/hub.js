import { IEntitySetting, IEntitySettings } from "../types";
import { EntitySettingType } from "../enums/entitySettingsType";
import { HubEntityType } from "../../../core/types/HubEntityType";

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
  content: {
    type: EntitySettingType.CONTENT,
    settings: { ...DISCUSSION_SETTINGS },
  },
  organization: null,
  org: null,
  group: {
    type: EntitySettingType.GROUP,
    settings: { ...DISCUSSION_SETTINGS },
  },
  template: null,
  survey: null,
  event: null,
  user: null,
  channel: null,
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
