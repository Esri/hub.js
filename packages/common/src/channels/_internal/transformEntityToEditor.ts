import { IHubChannel, IHubChannelEditor } from "../../core/types/IHubChannel";
import {
  transformEntityPermissionPoliciesToGroupFormValues,
  transformEntityPermissionPoliciesToOrgFormValues,
  transformEntityPermissionPoliciesToPublicFormValues,
  transformEntityPermissionPoliciesToUserFormValues,
  transformEntityPermissionPoliciesToOwnerFormValue,
} from "./transformEntityPermissionPoliciesToFormValues";

/**
 * @private
 * Transforms an IHubChannel entity pojo to an IHubChannelEditor object
 * @param entity an IHubChannel object
 * @returns an IHubChannelEditor object
 */
export function transformEntityToEditor(
  entity: IHubChannel
): IHubChannelEditor {
  return {
    id: entity.id,
    name: entity.name,
    blockWords: entity.blockWords.join(","),
    allowAsAnonymous: entity.allowAsAnonymous,
    publicConfigs: transformEntityPermissionPoliciesToPublicFormValues(
      entity.permissions
    ),
    orgConfigs: transformEntityPermissionPoliciesToOrgFormValues(
      entity.permissions
    ),
    groupConfigs: transformEntityPermissionPoliciesToGroupFormValues(
      entity.permissions
    ),
    userConfigs: transformEntityPermissionPoliciesToUserFormValues(
      entity.permissions
    ),
    ownerConfig: transformEntityPermissionPoliciesToOwnerFormValue(
      entity.permissions
    ),
  };
}
