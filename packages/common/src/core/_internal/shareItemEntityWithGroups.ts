import { shareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import HubError from "../../HubError";
import { IHubItemEntity } from "../types/IHubItemEntity";
import { EntityType } from "../../search/types";
import { hubSearch } from "../../search/hubSearch";

export async function shareItemEntityWithGroups(
  groupIds: string[],
  entity: IHubItemEntity,
  context: IArcGISContext
) {
  if (!context.currentUser) {
    throw new HubError(
      "Share Item With Group",
      "Cannot share item with group when no user is logged in."
    );
  }
  const query = {
    targetEntity: "group" as EntityType,
    filters: [
      {
        predicates: [{ id: groupIds }],
      },
    ],
  };
  const { results: groups } = await hubSearch(query, {
    requestOptions: context.hubRequestOptions,
    num: 100,
  });
  await Promise.all(
    groups.map(async (group) => {
      try {
        await shareItemWithGroup({
          id: entity.id,
          groupId: group.id,
          owner: entity.owner,
          authentication: context.session,
          confirmItemControl: group.isSharedUpdate,
        });
      } catch (err) {
        // Throw error here so functions consume this could catch it
        throw new Error(
          `Entity: ${entity.id} could not be shared with group: ${group.id}`
        );
      }
    })
  );
}
