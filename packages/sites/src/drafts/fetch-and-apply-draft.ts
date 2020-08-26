import { IModel, IHubRequestOptions, getProp } from "@esri/hub-common";
import { fetchDraft } from "./fetch-draft";
import { applyDraft } from "./apply-draft";

/**
 * This function fetches and applies the draft
 * to the site or page if the draft is available.
 *
 * It returns a completely new object with the draft applied
 * if there is one, otherwise it just returns the site or
 * page model argument.
 *
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
