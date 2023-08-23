/**
 * What is the status of a subsystem
 */
export type SystemStatus =
  | "online"
  | "offline"
  | "maintenance"
  | "not-available";

/**
 * Hash of Services and their status
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
