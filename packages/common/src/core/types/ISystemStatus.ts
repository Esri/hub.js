/**
 * What is the status of a subsystem
 */
export type SystemStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "not-available";

/**
 * DEPRECATED: use HubServiceStatus instead
 * Hash of subsystems and their status
 */
export type HubSystemStatus = {
  [key in HubSubsystem]: SystemStatus;
};

const validSubsystems = [
  "content",
  "discussions",
  "events",
  "initiatives",
  "items",
  "metrics",
  "notifications",
  "pages",
  "projects",
  "search",
  "sites",
  "groups",
  "platform",
] as const;
/**
 * * DEPRECATED: use HubService instead
 * Defines values for HubSubsystem
 */
export type HubSubsystem = (typeof validSubsystems)[number];

/**
 * * DEPRECATED: use isHubService instead
 * Validate a Subsystem
 * @param subsystem
 * @returns
 */
export function isSubsystem(maybeSubsystem: string): boolean {
  // tslint:disable-next-line: no-console
  console.warn(
    `DEPRECATION: isSubsystem is deprecated. Use isHubService instead.`
  );
  return validSubsystems.includes(maybeSubsystem as HubSubsystem);
}

/**
 * Hash of subsystems and their status
 */
export type HubServiceStatus = {
  [key in HubService]: SystemStatus;
};

const validServices = [
  "portal",
  "discussions",
  "events",
  "metrics",
  "notifications",
  "hub-search",
  "domains",
] as const;

export type HubService = (typeof validServices)[number];

/**
 * Validate a Service
 * @param service
 * @returns
 */
export function isHubService(maybeService: string): boolean {
  return validServices.includes(maybeService as HubService);
}
