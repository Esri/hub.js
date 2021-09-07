import { IModel, IHubRequestOptions, getHubApiUrl } from "@esri/hub-common";

/**
 * Remove a Site from the Hub Index system
 * @param {Object} siteModel Site Model
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _removeSiteFromIndex(
  siteModel: IModel,
  hubRequestOptions: IHubRequestOptions
): Promise<any> {
  if (hubRequestOptions.isPortal) {
    return Promise.resolve();
  } else {
    const url = `${getHubApiUrl(hubRequestOptions)}/v2/${siteModel.item.id}`;
    const opts = {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: hubRequestOptions.authentication.token,
      },
    } as RequestInit;
    return fetch(url, opts)
      .then((raw) => raw.json())
      .then((_) => {
        // TODO: Should we do anything here?
        return { success: true };
      })
      .catch((err) => {
        throw Error(
          `_removeSiteFromIndex: Error removing site from index: ${err}`
        );
      });
  }
}
