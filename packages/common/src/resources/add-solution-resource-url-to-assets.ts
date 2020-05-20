import { IModelTemplate, IHubRequestOptions, ITemplateAsset } from "../types";
import { getPortalApiUrl } from "../urls";

/**
 * Add a url property to the entries in the assets hash
 * @param {IModelTemplate} template
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function addSolutionResourceUrlToAssets(
  template: IModelTemplate,
  hubRequestOptions: IHubRequestOptions
) {
  /* istanbul ignore next */
  let assets = template.assets || template.resources || [];

  if (template.bundleItemId) {
    const portalRestUrl = getPortalApiUrl(hubRequestOptions.portalSelf);
    // the resources are stored on the solution item, and that Id is attached
    // into the template as .bundleItemId
    const solutionItemUrl = `${portalRestUrl}/content/items/${
      template.bundleItemId
    }`;
    // the resources on the solution are prefixed with the item id of the item the
    // template was created from, which is stored as .itemId
    const prefix = template.itemId;
    // map over the resources and convert them into assets
    assets = (assets as ITemplateAsset[]).map((asset: ITemplateAsset) => {
      // we fetch the resource from .url property
      // and we upload it using the .name property
      return {
        name: asset.name,
        type: asset.type || "resource",
        url: `${solutionItemUrl}/resources/${prefix}-${asset.name}`
      };
    });
  }
  return assets as ITemplateAsset[];
}
