import { IHubRequestOptions } from "@esri/hub-common";
import { _getDraftResourceName } from "./_get-draft-resource-name";
import { getItemResource } from "@esri/arcgis-rest-portal";

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
