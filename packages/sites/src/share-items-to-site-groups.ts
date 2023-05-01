import { IModel, IHubRequestOptions, failSafe } from "@esri/hub-common";
import { shareItemWithGroup, ISharingResponse } from "@esri/arcgis-rest-portal";
import { _getSecondPassSharingOptions } from "./_get-second-pass-sharing-options";
import { _getSharingEligibleModels } from "./_get-sharing-eligible-models";

/**
 * Share all the other models to the Site's content and collaboration groups, if
 * those groups were created for the site (depends on user's privs)
 * @param {object} siteModel Site Model
 * @param {Array} solutionModels Array of all models created by the Solution
 * @param {IHubRequestOptions} hubRequestOptions
 * @exported
 */
export function shareItemsToSiteGroups(
  siteModel: IModel,
  solutionModels: IModel[],
  hubRequestOptions: IHubRequestOptions
) {
  // Create Fail-safe version of share b/c this is not critical
  const failSafeShare = failSafe(shareItemWithGroup, { success: true });

  const groupsToShareTo = _getSecondPassSharingOptions(siteModel);
  // share all items in the solution to the groups, excluding the the site, form
  // and any form feature services
  return _getSharingEligibleModels(
    siteModel,
    solutionModels,
    hubRequestOptions
  ).then((eligibleModels) =>
    Promise.all(
      eligibleModels.reduce(
        (acc: Array<Promise<ISharingResponse>>, m: IModel) => {
          const itemSharePromises = groupsToShareTo.map((g) => {
            const opts = {
              id: m.item.id,
              groupId: g.id,
              confirmItemControl: g.confirmItemControl,
              authentication: hubRequestOptions.authentication,
            };
            return failSafeShare(opts) as Promise<ISharingResponse>;
          });
          return acc.concat(itemSharePromises);
        },
        []
      )
    )
  );
}
