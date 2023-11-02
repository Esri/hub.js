import { HubEntityType } from "../types";

/**
 * Composable behavior that adds permissions to an entity
 */
export interface IWithAssociationBehavior {
  requestAssociation(type: HubEntityType, id: string, owner: string): void;
}
