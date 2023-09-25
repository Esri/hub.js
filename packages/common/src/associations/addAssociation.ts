import { IWithAssociations } from "../core/traits/IWithAssociations";
import { IAssociationInfo } from "./types";

/**
 * Add an association to an entity
 * Persisted into the entity's `.typeKeywords` array
 * @param info
 * @param entity
 */
export function addAssociation(
  entity: IWithAssociations,
  info: IAssociationInfo
): void {
  if (!entity.typeKeywords) {
    entity.typeKeywords = [];
  }
  const association = `${info.type}|${info.id}`;
  if (!entity.typeKeywords.includes(association)) {
    entity.typeKeywords.push(association);
  }
}
