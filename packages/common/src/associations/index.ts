export * from "./addAssociation";
export * from "./breakAssociation";
export * from "./listAssociations";
export * from "./removeAssociation";
export * from "./types";
export * from "./getAssociatedEntitiesQuery";
export * from "./getAssociationStats";
export * from "./getAvailableToRequestEntitiesQuery";
export * from "./getPendingEntitiesQuery";
export * from "./getRequestingEntitiesQuery";
export * from "./getReferencedEntityIds";
export * from "./wellKnownAssociationCatalogs";
export * from "./initEntityAssociationGroup";
// Note: we expose "requestAssociation" under 2 names.
// These actions are functionally equivalent, but we want
// to make the intent more clear to the consumer.
export { requestAssociation } from "./requestAssociation";
export { requestAssociation as acceptAssociation } from "./requestAssociation";
