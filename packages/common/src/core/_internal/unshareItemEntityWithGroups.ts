import { unshareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import HubError from "../../HubError";
import { IHubItemEntity } from "../types/IHubItemEntity";

export async function unshareItemEntityWithGroups(
  groupIds: string[],
  entity: IHubItemEntity,
  context: IArcGISContext
) {
  if (!context.currentUser) {
    throw new HubError(
      "Unshare Item With Group",
      "Cannot unshare item with group when no user is logged in."
    );
  }
  await Promise.all(
    groupIds.map(async (groupId) => {
      try {
        await unshareItemWithGroup({
          id: entity.id,
          groupId,
          owner: entity.owner,
          authentication: context.session,
        });
      } catch (err) {
        // Throw error here so functions consume this could catch it
        throw new Error(
          `Entity: ${entity.id} could not be unshared with group: ${groupId}`
        );
      }
    })
  );
}
