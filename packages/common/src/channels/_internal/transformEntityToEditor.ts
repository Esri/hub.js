import { IHubChannel, IHubChannelEditor } from "../../core/types/IHubChannel";
import { IArcGISContext } from "../../types/IArcGISContext";
import {
  transformEntityPermissionPoliciesToGroupFormValues,
  transformEntityPermissionPoliciesToOrgFormValues,
  transformEntityPermissionPoliciesToPublicFormValues,
  transformEntityPermissionPoliciesToUserFormValues,
  transformEntityPermissionPoliciesToOwnerFormValues,
} from "./transformEntityPermissionPoliciesToFormValues";

/**
 * @private
 * Transforms an IHubChannel entity pojo to an IHubChannelEditor object
 * @param entity an IHubChannel object
 * @returns an IHubChannelEditor object
 */
export function transformEntityToEditor(
  entity: IHubChannel,
  context: IArcGISContext
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
      entity.permissions,
      context.currentUser.orgId
    ),
    groupConfigs: transformEntityPermissionPoliciesToGroupFormValues(
      entity.permissions
    ),
    userConfigs: transformEntityPermissionPoliciesToUserFormValues(
      entity.permissions
    ),
    ownerConfigs: transformEntityPermissionPoliciesToOwnerFormValues(
      entity.permissions,
      context.currentUser.orgId
    ),
  };
}
