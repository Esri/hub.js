import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IWorkspaceCapabilityResponse, ICapabilityPermission } from "./types";
import { ProjectCapabilityPermissions } from "../projects/_internal/ProjectBusinessRules";
import { checkCapabilityAccess } from "./_internal/checkCapabilityAccess";
import { InitiativeCapabilityPermissions } from "../initiatives/_internal/InitiativeBusinessRules";
import { SiteCapabilityPermissions } from "../sites/_internal/SiteBusinessRules";
import { ContentCapabilityPermissions } from "../content/_internal/ContentBusinessRules";
import { HubEntity, HubEntityType } from "../core";
import { IArcGISContext } from "../ArcGISContext";

/**
 * List of all the Capability Permissions in the Hub System
 * These are defined in the entity specific modules files
 */
export const CapabilityPermissions: ICapabilityPermission[] = [
  ...ProjectCapabilityPermissions,
  ...InitiativeCapabilityPermissions,
  ...SiteCapabilityPermissions,
  ...ContentCapabilityPermissions,
];

/**
 * Return the capabilities that are granted to the current user for a given entity
 * This is used by the Hub Components to determine which Workspace Navigation Links to show
 * @param entity
 * @param context
 * @returns
 */
export function getWorkspaceCapabilities(
  entity: HubEntity,
  context: IArcGISContext
): IWorkspaceCapabilityResponse {
  const entityType: HubEntityType = getTypeFromEntity(entity);
  // filter to the rules for the given entity type
  const capabilityAccessRules = CapabilityPermissions.filter(
    (e) => e.entity === entityType
  );

  // check each capability access rule
  const responses = capabilityAccessRules.map((rule) => {
    return checkCapabilityAccess(rule, context, entity);
  });
  // map out those capabilities that are granted so consumers can easily work with that list
  const granted = responses.filter((r) => r.access).map((r) => r.capability);
  // return the full response with the details and the granted capabilities list
  return {
    granted,
    details: responses,
  };
}
