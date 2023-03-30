/**
 * What is the status of a subsystem
 */
export type SystemStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "not-available";

/**
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
] as const;
/**
 * Defines values for HubSubsystem
 */
export type HubSubsystem = (typeof validSubsystems)[number];

/**
 * Validate a Subsystem
 * @param subsystem
 * @returns
 */
export function isSubsystem(maybeSubsystem: string): boolean {
  return validSubsystems.includes(maybeSubsystem as HubSubsystem);
}
