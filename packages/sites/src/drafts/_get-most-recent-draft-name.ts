import { IHubRequestOptions } from "@esri/hub-common";
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
  return (
    _getDraftResourceNames(siteOrPageId, hubRequestOptions)
      // Simple ascii sort works since timestamps are encoded into draft file names
      .then(draftNames => draftNames.sort()[0])
  );
}
