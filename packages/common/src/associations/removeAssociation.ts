import { IWithAssociations } from "../core/traits/IWithAssociations";
import { IAssociationInfo } from "./types";

/**
 * ** DEPRECATED: please use breakAssociation instead.
 * This will be removed in next breaking version **
 *
 * Remove an association from an entity
 * @param info
 * @param entity
 * @returns
 */
export function removeAssociation(
  entity: IWithAssociations,
  info: IAssociationInfo
): void {
  if (!entity.typeKeywords) {
    return;
  }
  const association = `${info.type}|${info.id}`;
  const index = entity.typeKeywords.indexOf(association);
  if (index > -1) {
    entity.typeKeywords.splice(index, 1);
  }
}
