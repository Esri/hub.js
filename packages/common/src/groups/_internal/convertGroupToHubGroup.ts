import type { IGroup } from "@esri/arcgis-rest-portal";
import { PropertyMapper } from "../../core/_internal/PropertyMapper";
import { IHubGroup } from "../../core/types/IHubGroup";
import { computeProps } from "./computeProps";
import { getPropertyMap } from "./getPropertyMap";
import { IHubRequestOptions } from "../../hub-types";
import { getDefaultEntitySettings } from "../../discussions/api/settings/getDefaultEntitySettings";
import { fetchSettingV2 } from "../../discussions/api/settings/settings";
import { IEntitySetting } from "../../discussions/api/types";

/**
 * Convert an IGroup to a Hub Group
 * @param group
 * @param requestOptions
 */

export async function convertGroupToHubGroup(
  group: IGroup,
  requestOptions: IHubRequestOptions
): Promise<IHubGroup> {
  const mapper = new PropertyMapper<Partial<IHubGroup>, IGroup>(
    getPropertyMap()
  );
  const hubGroup = mapper.storeToEntity(group, {}) as IHubGroup;
  const entitySettings = await fetchSettingV2({
    id: group.id,
    ...requestOptions,
  }).catch(
    () =>
      ({
        id: null,
        ...getDefaultEntitySettings("group"),
      } as IEntitySetting)
  );
  hubGroup.entitySettingsId = entitySettings.id;
  hubGroup.discussionSettings = entitySettings.settings.discussions;
  return computeProps(group, hubGroup, requestOptions);
}
