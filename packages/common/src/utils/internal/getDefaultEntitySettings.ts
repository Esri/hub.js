import {
  EntitySettingType,
  IEntitySetting,
  IEntitySettings,
} from "../../discussions/api/types";
import { HubEntityType } from "../../core/types";

const DISCUSSION_SETTINGS: IEntitySettings = {
  discussions: {
    allowedChannelIds: null,
    allowedLocations: null,
  },
};

const SETTINGS_TYPE_BY_ENTITY_TYPE: Record<HubEntityType, EntitySettingType> = {
  discussion: EntitySettingType.CONTENT,
  site: null,
  project: null,
  initiative: null,
  initiativeTemplate: null,
  page: null,
  content: null,
  org: null,
  group: null,
  template: null,
};

const DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE: Record<
  HubEntityType,
  IEntitySettings
> = {
  discussion: {
    ...DISCUSSION_SETTINGS,
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
};

export function getDefaultEntitySettings(
  entityType: HubEntityType
): Partial<IEntitySetting> {
  if (!SETTINGS_TYPE_BY_ENTITY_TYPE[entityType]) {
    throw new Error(`no entity settings type defined for ${entityType}`);
  }
  if (!DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE[entityType]) {
    throw new Error(`no default entity settings defined for ${entityType}`);
  }
  return {
    type: SETTINGS_TYPE_BY_ENTITY_TYPE[entityType],
    settings: { ...DEFAULT_ENTITY_SETTINGS_BY_ENTITY_TYPE[entityType] },
  };
}
