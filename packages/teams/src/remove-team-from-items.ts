import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import type { IUpdateItemResponse } from "@esri/arcgis-rest-portal";
import { cloneObject, IModel, without, updateItem } from "@esri/hub-common";

/**
 * Removes a Team from N hub models.
 * First, if passed deleteTeam, it will delete the team
 * Then it iterates over an array of IModels and removes the given team ID from their teams array
 *
 * @export
 * @param {string} teamId Team ID of the team we are removing
 * @param {IModel[]} models Array of IModels
 * @param {ArcGISIdentityManager} authentication Auth
 * @return {*}  {Promise<IUpdateItemResponse[]>}
 */
export async function removeTeamFromItems(
  teamId: string,
  models: IModel[],
  authentication: ArcGISIdentityManager
): Promise<IUpdateItemResponse[]> {
  // Iterate over all items...
  return Promise.all(
    models.map((model) => {
      // clone the item before modifying
      const clonedModel = cloneObject(model);
      // remove the id from the item.properties.teams array
      clonedModel.item.properties.teams = without(
        clonedModel.item.properties.teams,
        teamId
      );
      // Check if the user has access to edit the item. itemControl is only present when the item is directly fetched
      //
      return clonedModel.item.itemControl === "admin" ||
        clonedModel.item.itemControl === "update"
        ? // If yes, then update the item
          updateItem({
            item: clonedModel.item,
            authentication,
          })
        : // Otherwise return a 'fail' state for that item specifically
          { id: clonedModel.item.id, success: false };
    })
  );
}
