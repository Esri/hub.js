/**
 * Composable behavior that adds permissions to an entity
 */
export interface IWithAssociationBehavior {
  requestAssociation(): void;
  acceptAssociation(): void;
}
