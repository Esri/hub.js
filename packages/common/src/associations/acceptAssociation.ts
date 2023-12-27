import { IArcGISContext } from "../ArcGISContext";
import { HubEntity, HubEntityType } from "../core/types";
import { requestAssociation } from ".";

/**
 * When an entity accepts an "incoming" association request,
 * half of the association "connection" is made.
 *
 * from the parent's perspective: the parent "includes"
 * the child in its association group
 *
 * From the child's perspective: the child "references"
 * the parent via a typeKeyword of the form ref|<parentType>|<parentID>
 *
 * Note: functionally this is equivalent to requestAssociation,
 * and we delegate accordingly. We expose this function purely
 * for syntax/clarity purposes
 *
 * @param entity - entity requesting association
 * @param associationType - type of the entity the requesting entity wants to associate with
 * @param id - id of the entity the requesting entity wants to associate with
 * @param context - contextual portal and auth information
 */
export const acceptAssociation = async (
  entity: HubEntity,
  associationType: HubEntityType,
  id: string,
  context: IArcGISContext
): Promise<void> => {
  return requestAssociation(entity, associationType, id, context);
};
