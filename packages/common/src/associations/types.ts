import { HubEntityType } from "../core";
import { IQuery } from "../search";

export interface IHubAssociationRules {
  /** schema version for migration purposes */
  schemaVersion: number;
  query: IQuery;
}

export interface IHubAssociationHierarchy {
  children: HubEntityType[];
  parents: HubEntityType[];
}
