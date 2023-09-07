import { IWithAssociations } from "../core/traits/IWithAssociations";
import { IAssociationInfo } from "./types";

/**
 * Remove an association from an entity
 * @param info
 * @param entity
 * @returns
 */
export function removeAssociation(
  info: IAssociationInfo,
  entity: IWithAssociations
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
