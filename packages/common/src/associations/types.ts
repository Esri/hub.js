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
 * association rules stored on the parent entity
 * that define what is "included" by the parent
 *
 * For now, the query will define an association
 * group, and "included" simply means it has
 * been shared with the association group. In
 * the future, the query may contain additional
 * conditions
 */
export interface IHubAssociationRules {
  /** schema version for migration purposes */
  schemaVersion: number;
  /** query that defines what's "included" by a parent */
  query: IQuery;
}

/**
 * associations involve a 2-way agreement between
 * parent and child. This interface allows us to
 * keep track of an entity's association stats with
 * another entity
 */
export interface IAssociationStats {
  /** number of full associations */
  associated: number;
  /** number of outgoing association requests */
  pending: number;
  /** number of incoming association requests */
  requesting: number;
  /** number of entity's the child references = associated + pending */
  referenced?: number;
  /** number of entities included by the parent = associated + pending */
  included?: number;
}

/**
 * ** DEPRECATED: This will be removed in the next
 * breaking version **
 *
 * Definition of an Association
 * This will be persisted in the item's typekeywords
 * as `type|id`
 */
export interface IAssociationInfo {
  /**
   * Type of the association. Currently only initiative is supported
   */
  type: AssociationType;
  /**
   * Id of the associated item
   */
  id: string;
}

/**
 * ** DEPRECATED: This will be removed in the next
 * breaking version **
 *
 * Association type
 */
export type AssociationType = "initiative";

/**
 * The model for associations is built around platform
 * capabilities. Platform imposes a limit of 128 on the
 * number of typeKeywords that can be set on an item.
 * Since "children" form their half of an association
 * connection via typeKeywords, we must limit the number
 * of associations a child can request or accept to far
 * fewer than 128.
 *
 * For now, we are setting this limit to 50
 */
export const ASSOCIATION_REFERENCE_LIMIT = 50;
