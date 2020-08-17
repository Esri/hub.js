import { IModel, getProp } from "@esri/hub-common";

/**
 * Return a hash of settings for the groups, including the itemControl flag
 * Both, one or neither of these groups may exist
 * @param {object} siteModel Site Model
 * @private
 */
export function _getSecondPassSharingOptions(
  siteModel: IModel
): Array<{ id: string; confirmItemControl: boolean }> {
  return [
    { prop: "item.properties.contentGroupId", itemControl: false },
    { prop: "item.properties.collaborationGroupId", itemControl: true }
  ].reduce((acc, entry) => {
    const groupId = getProp(siteModel, entry.prop);
    if (groupId) {
      acc.push({
        id: groupId,
        confirmItemControl: entry.itemControl
      });
    }
    return acc;
  }, []);
}
