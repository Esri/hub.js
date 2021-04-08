import { IModel, IHubRequestOptions, failSafe } from "@esri/hub-common";
import { shareItemWithGroup, ISharingResponse } from "@esri/arcgis-rest-portal";
import { _getSecondPassSharingOptions } from "./_get-second-pass-sharing-options";

// export the non private one so we can use it in solution-service
export function shareItemsToSiteGroups(
  siteModel: IModel,
  solutionModels: IModel[],
  hubRequestOptions: IHubRequestOptions
) {
  return _shareItemsToSiteGroups(siteModel, solutionModels, hubRequestOptions);
}
/**
 * Share all the other models to the Site's content and collaboration groups, if
 * those groups were created for the site (depends on user's privs)
 * @param {object} siteModel Site Model
 * @param {Array} solutionModels Array of all models created by the Solution
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _shareItemsToSiteGroups(
  siteModel: IModel,
  solutionModels: IModel[],
  hubRequestOptions: IHubRequestOptions
) {
  const otherModels = solutionModels.filter(m => {
    return m.item.id !== siteModel.item.id;
  });
  // Create Fail-safe version of share b/c this is not critical
  const failSafeShare = failSafe(shareItemWithGroup, { success: true });

  const groupsToShareTo = _getSecondPassSharingOptions(siteModel);
  // share all items in the solution to the groups
  return Promise.all(
    otherModels.reduce((acc: Array<Promise<ISharingResponse>>, m: IModel) => {
      const itemSharePromises = groupsToShareTo.map(g => {
        const opts = {
          id: m.item.id,
          groupId: g.id,
          confirmItemControl: g.confirmItemControl,
          authentication: hubRequestOptions.authentication
        };
        return failSafeShare(opts) as Promise<ISharingResponse>;
      });
      return acc.concat(itemSharePromises);
    }, [])
  );
}
