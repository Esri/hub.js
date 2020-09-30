import { IHubRequestOptions } from "@esri/hub-common";
import { getItemResource } from "@esri/arcgis-rest-portal";
import { _getMostRecentDraftName } from "./_get-most-recent-draft-name";

/**
 * Fetches the draft for a site or page if exists.
 * @param {*} siteOrPageId
 * @param {*} hubRequestOptions
 */
export function fetchDraft(
  siteOrPageId: string,
  hubRequestOptions: IHubRequestOptions
) {
  return _getMostRecentDraftName(siteOrPageId, hubRequestOptions).then(
    draftResourceName => {
      let ret = null;
      if (draftResourceName) {
        ret = getItemResource(siteOrPageId, {
          fileName: draftResourceName,
          readAs: "json",
          authentication: hubRequestOptions.authentication,
          portal: hubRequestOptions.portal
        });
      }
      return ret;
    }
  );
}
