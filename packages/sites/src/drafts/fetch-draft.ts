import { getProp, IDraft, IHubRequestOptions } from "@esri/hub-common";
import { getItemResource } from "@esri/arcgis-rest-portal";
import { _getMostRecentDraftName } from "./_get-most-recent-draft-name";
import { upgradeDraftSchema } from "./upgrade-draft-schema";

function isSiteDraft(draft: IDraft) {
  // Maybe a better way to do this, but can't use item type
  // because we have Web Mapping Application sites in the wild
  // and typeKeywords don't exist on drafts.
  //
  // We could always request the site item and check it as part of
  // this but I'd rather not since that's an extra XHR and this is a
  // pretty robust schema check.
  return (
    getProp(draft, "data.values.capabilities") !== undefined &&
    getProp(draft, "data.values.theme") !== undefined
  );
}

/**
 * Fetches the draft for a site or page if exists.
 * @param {*} siteOrPageId
 * @param {*} hubRequestOptions
 */
export function fetchDraft(
  siteOrPageId: string,
  hubRequestOptions: IHubRequestOptions
) {
  return _getMostRecentDraftName(siteOrPageId, hubRequestOptions)
    .then(draftResourceName => {
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
    })
    .then((draft: IDraft) => {
      if (draft && isSiteDraft(draft)) {
        draft = upgradeDraftSchema(draft);
      }
      return draft;
    });
}
