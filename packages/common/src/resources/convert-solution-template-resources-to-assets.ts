import { getPortalApiUrl } from "../urls";
import { IHubRequestOptions, ITemplateAsset, IModelTemplate } from "../types";

/**
 * Convert the resources array on an individual template in a solution
 * into an assets array that can be used to upload the resources to
 * the newly created item.
 * @param {object} template Template from a Solution
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function convertSolutionTemplateResourcesToAssets(
  template: IModelTemplate,
  hubRequestOptions: IHubRequestOptions
): ITemplateAsset[] {
  let assets: ITemplateAsset[] = [];
  if (template.resources && template.bundleItemId) {
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
    assets = template.resources.map(name => {
      // we fetch the resource from .url property
      // and we upload it using the .name property
      return {
        name,
        type: "resource",
        url: `${solutionItemUrl}/resources/${prefix}-${name}`
      };
    });
  }
  return assets;
}
