import { IHubRequestOptions } from "@esri/hub-common";
import { _getDraftResourceName } from "./_get-draft-resource-name";
import { _getJsonResource } from "./_get-json-resource";

/**
 * Fetches the draft for a site or page if exists.
 * @param {*} siteOrPageId
 * @param {*} hubRequestOptions
 */
export function fetchDraft(
  siteOrPageId: string,
  hubRequestOptions: IHubRequestOptions
) {
  return _getDraftResourceName(siteOrPageId, hubRequestOptions).then(
    draftResourceName => {
      let ret = null;
      if (draftResourceName) {
        ret = _getJsonResource(siteOrPageId, draftResourceName, {
          authentication: hubRequestOptions.authentication,
          portal: hubRequestOptions.portal
        });
      }
      return ret;
    }
  );
}
