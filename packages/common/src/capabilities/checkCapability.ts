import { Capability, ICapabilityAccessResponse, isCapability } from "./types";
import { CapabilityPermissions } from "./getWorkspaceCapabilities";
import { checkCapabilityAccess } from "./_internal";
import {
  IArcGISContext,
  HubEntity,
  IHubItemEntity,
  HubEntityType,
} from "../index";
// Any of these causes checkCapability to not be defined in tests
// import { getTypeFromEntity } from "../index";
// import { getTypeFromEntity } from "../core";
// import { getTypeFromEntity } from "../core/index";
// This direct import resolves the problem
import { getTypeFromEntity } from "../core/getTypeFromEntity";

/**
 * Check if a capability is enabled for a given entity and if the current user has necessary permissions to access it
 * @param capability
 * @param context
 * @param entity
 * @returns
 */
export function checkCapability(
  capability: Capability,
  context: IArcGISContext,
  entity: IHubItemEntity | HubEntity
): ICapabilityAccessResponse {
  /* tslint:disable-next-line: no-console */
  console.warn(
    `DEPRECATION: checkCapability is deprecated. Use checkPermission instead.`
  );
  const entityType: HubEntityType = getTypeFromEntity(entity);
  // Find the rule for the given entity type and capability
  const isValid = isCapability(capability);
  if (isValid) {
    const rule = CapabilityPermissions.find(
      (e) => e.entity === entityType && e.capability === capability
    );
    if (rule) {
      // check each capability access rule
      return checkCapabilityAccess(rule, context, entity);
    } else {
      // No rule found
      return {
        capability,
        access: false,
        code: "disabled",
        response: "not-available",
        message: `Capability "${capability}" is not defined for ${entityType}.`,
        responses: [],
      } as ICapabilityAccessResponse;
    }
  } else {
    // Invlaid Capability
    return {
      capability,
      access: false,
      code: "disabled",
      response: "invalid-capability",
      message: `Value "${capability}" is not a valid Hub Capability.`,
      responses: [],
    } as ICapabilityAccessResponse;
  }
}
