import { IModelTemplate, IHubRequestOptions, IModel } from "@esri/hub-common";
import { shareItemsToSiteGroups } from "./share-items-to-site-groups";
import { _updatePages } from "./_update-pages";

/**
 * Handle the Solution "Second Pass" for Site
 * @param {object} siteModel Site Model
 * @param {Array} solutionModels Array of all models created by the Solution
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function siteSecondPass(
  siteModel: IModel,
  solutionModels: IModelTemplate[],
  hubRequestOptions: IHubRequestOptions
) {
  let secondPassPromises: Array<Promise<any>> = [];
  // get all the items that are not the site
  secondPassPromises = secondPassPromises.concat(
    shareItemsToSiteGroups(
      siteModel,
      solutionModels as unknown as IModel[],
      hubRequestOptions
    )
  );
  // link the pages
  secondPassPromises = secondPassPromises.concat(
    _updatePages(siteModel, solutionModels, hubRequestOptions)
  );

  return Promise.all(secondPassPromises);
}
