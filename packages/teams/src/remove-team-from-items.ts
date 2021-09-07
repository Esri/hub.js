import { UserSession } from "@esri/arcgis-rest-auth";
import { IUpdateItemResponse, updateItem } from "@esri/arcgis-rest-portal";
import { cloneObject, IModel, without } from "@esri/hub-common";
import { removeTeam } from "./remove-team";

/**
 * Removes a Team from N hub models.
 * First, if passed deleteTeam, it will delete the team
 * Then it iterates over an array of IModels and removes the given team ID from their teams array
 *
 * @export
 * @param {string} teamId Team ID of the team we are removing
 * @param {IModel[]} models Array of IModels
 * @param {boolean} deleteTeam Should we delete the team true|false
 * @param {UserSession} authentication Auth
 * @return {*}  {Promise<IUpdateItemResponse[]>}
 */
export async function removeTeamFromItems(
  teamId: string,
  models: IModel[],
  deleteTeam: boolean,
  authentication: UserSession
): Promise<IUpdateItemResponse[]> {
  if (deleteTeam) {
    // first kill the team...
    await removeTeam(teamId, authentication);
  }
  // now remove from all items
  return Promise.all(
    models.map((model) => {
      // clone the item before modifying
      const clonedModel = cloneObject(model);
      // remove the id from the item.properties.teams array
      clonedModel.item.properties.teams = without(
        clonedModel.item.properties.teams,
        teamId
      );
      // update the item
      return updateItem({
        item: clonedModel.item,
        authentication,
      });
    })
  );
}
