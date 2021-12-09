import { ArcGISRequestError, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { shareItemToGroups, unshareItemFromGroups } from "@esri/hub-common";

/**
 * Process an array of items, either sharing them to the group
 * or unsharing them. Defaults to sharing items. Returns an object comprised of
 * array of successes, and failures/errors.
 *
 * @export
 * @param {string} groupId | group we are sharing/unsharing to
 * @param {IItem[]} items | array of items we are sharing/unsharing
 * @param {IRequestOptions} requestOptions | Auth
 * @param {("share" | "unshare")} [action="share"] | share or unshare, defaults to share
 * @return {*}
 */
export async function shareOrUnshareItemsToTeam(
  groupId: string,
  items: IItem[],
  requestOptions: IRequestOptions,
  action: "share" | "unshare" = "share"
) {
  // Choose to share or unshare
  const fnName = action === "share" ? shareItemToGroups : unshareItemFromGroups;
  const result: {
    successes: IItem[];
    failures: IItem[];
    errors: ArcGISRequestError[];
  } = {
    successes: [],
    failures: [],
    errors: [],
  };

  const promises = items.map(async (item) => {
    try {
      await fnName(groupId, [item.id], requestOptions);
      result.successes.push(item);
    } catch (ex) {
      result.failures.push(item);
      result.errors.push(ex as ArcGISRequestError);
    }
  });

  await Promise.all(promises);
  return result;
}
