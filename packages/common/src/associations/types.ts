import { HubEntityType } from "../core";
import { IQuery } from "../search";

/**
 * associations are hierarchical in nature e.g.
 * there is always a parent and a child in the
 * relationship. This interface allows us to
 * define these hierarchies on an entity-by-entity
 * basis
 */
export interface IHubAssociationHierarchy {
  children: HubEntityType[];
  parents: HubEntityType[];
}

/**
 * rules stored on the parent entity in an
 * association that define what is "included"
 *
 * For now, the query defines an association
 * group and "included" simply means it has
 * been shared with the association group
 */
export interface IHubAssociationRules {
  /** schema version for migration purposes */
  schemaVersion: number;
  /** */
  query: IQuery;
}
