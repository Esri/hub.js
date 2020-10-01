import { IHubRequestOptions } from "@esri/hub-common";
import { getDraftDate } from "./get-draft-date";
import { _getDraftResourceNames } from "./_get-draft-resource-names";

/**
 * Gets the name of the most recent resource for the current draft.
 * NOTE: There _should_ only be one, but sometimes it gets messed up.
 * @param siteOrPageId
 * @param hubRequestOptions
 * @private
 */
export function _getMostRecentDraftName(
  siteOrPageId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<string> {
  return _getDraftResourceNames(siteOrPageId, hubRequestOptions).then(
    draftNames => {
      if (!draftNames.length) return null;
      const dates = draftNames.map(name => [name, getDraftDate(name)]);
      dates.sort(([_, dateA], [__, dateB]) => {
        if (dateB > dateA) {
          return 1;
        } else if (dateA > dateB) {
          return -1;
        } else {
          return 0;
        }
      });
      return dates[0][0] as string;
    }
  );
}
