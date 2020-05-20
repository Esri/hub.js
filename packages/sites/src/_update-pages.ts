import {
  IModel,
  IHubRequestOptions,
  failSafe,
  serializeModel,
  IModelTemplate
} from "@esri/hub-common";
import {
  updateItem,
  IUpdateItemResponse
} from "@esri/hub-common/node_modules/@esri/arcgis-rest-portal";
import { _secondPassAdlibPages } from "./_second-pass-adlib-pages";

/**
 * Locate any Page items that were created in the Solution, and link them back to the Site
 * @param {object} siteModel Site Model
 * @param {Array} solutionModels Array of all models created by the Solution
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function _updatePages(
  siteModel: IModelTemplate,
  solutionModels: IModelTemplate[],
  hubRequestOptions: IHubRequestOptions
): Promise<IUpdateItemResponse[]> {
  // 2) for any page item, check if it has the site in it's pages array and if not add it
  const pageModels = solutionModels.filter(m => {
    return m.item.type.indexOf("Page") > -1;
  });
  // Create Fail-safe version of update b/c this is not critical
  const failSafeUpdate = failSafe(updateItem, { success: true });
  // check each one of these and see if the siteModel.item.id is in it's data.value.sites array
  // if not, add and update the item
  const siteEntry = {
    id: siteModel.item.id,
    title: siteModel.item.title
  };

  // iterate the pages
  return Promise.all(
    pageModels.map(m => {
      m.data.values.sites.push(siteEntry);
      m = _secondPassAdlibPages(siteModel, m);
      return failSafeUpdate({
        item: serializeModel((m as unknown) as IModel),
        authentication: hubRequestOptions.authentication
      });
    })
  );
}
