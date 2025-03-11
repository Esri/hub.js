import { IHubChannel, IHubChannelEditor } from "../../core/types/IHubChannel";
import { transformFormValuesToEntityPermissionPolicies } from "./transformFormValuesToEntityPermissionPolicies";

/**
 * @private
 * Transforms an IHubChannelEditor object to a partial IHubChannel object
 * @param editor an IHubChannelEditor object
 * @returns a partial IHubChannel object
 */
export function transformEditorToEntity(
  editor: IHubChannelEditor
): Partial<IHubChannel> {
  const permissionValues = [
    ...editor.publicConfigs,
    ...editor.orgConfigs,
    ...editor.groupConfigs,
    ...editor.userConfigs,
    ...editor.ownerConfigs,
  ];
  return {
    name: editor.name,
    blockWords: editor.blockWords.split(",").map((val) => val.trim()),
    allowAsAnonymous: editor.allowAsAnonymous,
    permissions:
      transformFormValuesToEntityPermissionPolicies(permissionValues),
  };
}
