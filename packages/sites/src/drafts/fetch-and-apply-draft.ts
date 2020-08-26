import { IModel, IHubRequestOptions, getProp } from "@esri/hub-common";
import { fetchDraft } from "./fetch-draft";
import { applyDraft } from "./apply-draft";

/**
 * Convenience function
 * @param {*} siteOrPageModel
 * @param {*} hubRequestOptions
 */
export function fetchAndApplyDraft(
  siteOrPageModel: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  return fetchDraft(
    getProp(siteOrPageModel, "item.id"),
    hubRequestOptions
  ).then(draft =>
    applyDraft(siteOrPageModel, draft, hubRequestOptions.isPortal)
  );
}
