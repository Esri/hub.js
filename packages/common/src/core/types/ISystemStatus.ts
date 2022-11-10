/**
 * What is the status of a subsystem
 */
export type SystemStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "not-available";

export interface ISystemStatus {
  subsystem: HubSubsystem;
  status: SystemStatus;
}

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
];
/**
 * Defines values for HubSubsystem
 */
export type HubSubsystem = typeof validSubsystems[number];

/**
 * Validate a Subsystem
 * @param subsystem
 * @returns
 */
export function isSubsystem(maybeSubsystem: string): boolean {
  return validSubsystems.includes(maybeSubsystem as HubSubsystem);
}
