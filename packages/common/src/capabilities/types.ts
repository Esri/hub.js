import {
  HubEntityType,
  IPermissionAccessResponse,
  Permission,
  PolicyResponse,
} from "../index";
import { IAccessResponse } from "../core/types/IAccessResponse";

/**
 * Hub System Capabilities
 */
const validCapabilities = [
  "collaboration",
  "details",
  "discussions",
  "events",
  "followers",
  "overview",
  "settings",
  "teams",
  "metrics",
  "content",
] as const;

const legacyCapabilities = [
  'disableActivityTracking'
];

/**
 * Defines the possible values for Capability
 */
export type Capability = (typeof validCapabilities)[number] | (typeof legacyCapabilities)[number];

/**
 * Validate a capability. This is used because the libary can be used outside of typescript and we want to be able to return a message is the string passed in is not a valid capability
 * @param Capability
 * @returns
 */
export function isCapability(maybeCapability: string): boolean {
  return [ ...validCapabilities, ...legacyCapabilities ].includes(maybeCapability as Capability);
}

/**
 * Hash of with keys constrained to Capability
 */
export type EntityCapabilities = {
  [key in Capability]?: boolean;
};

/**
 * Defines the permissions required to access a specific capability, for a specific entity type
 */
export interface ICapabilityPermission {
  entity: HubEntityType;
  capability: Capability;
  permissions: Permission[];
}

/**
 * Response from checking a Capability
 */
export interface ICapabilityAccessResponse extends IAccessResponse {
  /**
   * Capability being checked
   */
  capability: Capability;
  /**
   * Individual permission check responses. Used for observability
   */
  responses: IPermissionAccessResponse[];
}

/**
 * All capability checks for an Entity's workspace
 */
export interface IWorkspaceCapabilityResponse {
  /**
   * Array of capabilities the current user has access to, in the context of a given entity
   */
  granted: Capability[];
  /**
   * Detailed checks for each capability. Used for observability
   */
  details: ICapabilityAccessResponse[];
}
