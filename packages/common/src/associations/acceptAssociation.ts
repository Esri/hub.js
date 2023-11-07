import { IArcGISContext } from "../ArcGISContext";
import { HubEntity, HubEntityType } from "../core/types";
import { requestAssociation } from "..";

/**
 * When an entity accepts an "incoming" association request,
 * half of the association "connection" is made.
 *
 * from the parent's perspective: the parent "includes"
 * the child in its association group
 *
 * From the child's perspective: the child "identifies"
 * with the parent via a typeKeyword (parent|:id)
 *
 * Note: functionally this is equivalent to requestAssociation,
 * and we delegate accordingly. We expose this function purely
 * for syntax purposes
 *
 * @param entity entity requesting association
 * @param type type of the entity the requesting entity wants to associate with
 * @param id id of the entity the requesting entity wants to associate with
 * @param context
 */
export const acceptAssociation = async (
  entity: HubEntity,
  type: HubEntityType,
  id: string,
  context: IArcGISContext
): Promise<void> => {
  await requestAssociation(entity, type, id, context);
};
