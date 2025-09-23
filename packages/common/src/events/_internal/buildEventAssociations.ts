import { IHubRequestOptions } from "../../hub-types";
import { searchItems } from "@esri/arcgis-rest-portal";
import { ICreateEventAssociation } from "../api/types";

export async function buildEventAssociations(
  referencedContentIdsByType: Array<{ entityId: string; entityType: string }>,
  referencedContentIds: string[],
  hubRequestOptions: IHubRequestOptions
): Promise<ICreateEventAssociation[]> {
  // filter out content that was removed
  const associations = referencedContentIdsByType.filter(({ entityId }) =>
    referencedContentIds.includes(entityId)
  );
  // get content ids being added
  const added = referencedContentIds.filter(
    (referencedContentId) =>
      !associations.find(({ entityId }) => entityId === referencedContentId)
  );
  if (added.length) {
    // fetch the content being added
    const { results } = await searchItems({
      q: added.map((id) => `id:${id}`).join(" OR "),
      num: added.length,
      authentication: hubRequestOptions.authentication,
    });
    // map content to ICreateEventAssociation structures
    const addedAssociations = results.map(({ id, type }) => ({
      entityId: id,
      entityType: type,
    }));
    associations.push(...addedAssociations);
  }
  return associations as ICreateEventAssociation[];
}
