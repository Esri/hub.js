import { IWithAssociations } from "../core/traits/IWithAssociations";
import { AssociationType, IAssociationInfo } from "./types";

/**
 * Return a list of all associations on an entity for a type
 * @param entity
 * @returns
 */
export function listAssociations(
  entity: IWithAssociations,
  type: AssociationType
): IAssociationInfo[] {
  if (!entity.typeKeywords) {
    return [];
  }
  return entity.typeKeywords
    .filter((tk) => tk.indexOf(`${type}|`) > -1)
    .map((tk) => {
      const [t, id] = tk.split("|");
      return { type: t, id } as IAssociationInfo;
    });
}
