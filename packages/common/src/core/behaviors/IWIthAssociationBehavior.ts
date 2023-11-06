import { HubEntityType } from "../types";

/** Composable behavior that adds associations to an entity */
export interface IWithAssociationBehavior {
  requestAssociation(type: HubEntityType, id: string): Promise<void>;

  acceptAssociation(type: HubEntityType, id: string): Promise<void>;

  breakAssociation(type: HubEntityType, id: string): Promise<void>;
}
