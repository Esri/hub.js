import { HubEntityType } from "./types/HubEntityType";

/**
 * @internal
 * Mapping of path segments to entity types.
 */
export const pathMap: Record<string, HubEntityType> = {
  initiatives: "initiative",
  projects: "project",
  content: "content",
  events: "event",
  discussions: "discussion",
  sites: "site",
  apps: "content",
  surveys: "content",
  maps: "content",
  datasets: "content",
  pages: "page",
};

/**
 * Given a HubEntityType, return the path segment for that type.
 * e.g. "site" -> "sites", "page" -> "pages", "content" -> "content"
 * @param type
 * @returns
 */
export function getPathForHubEntityType(type: HubEntityType): string {
  const path = Object.keys(pathMap).find((key) => pathMap[key] === type);
  return path || "";
}

/**
 * Given a path segment, return the HubEntityType for that path.
 * e.g. "sites" -> "site", "pages" -> "page", "content" -> "content"
 * @param path
 * @returns
 */
export function getHubEntityTypeFromPath(path: string): HubEntityType {
  return pathMap[path];
}

/**
 * @internal
 * Parsed path object, with validation information.
 */
export interface IParsedPath {
  valid: boolean;
  parts?: string[];
  reason?: string;
}

/**
 * Parse a path string into its parts, and validate that it is a valid path.
 * @param path
 * @returns
 */
export function parseContainmentPath(path: string): IParsedPath {
  // if the path starts with a /, remove it
  if (path && path.startsWith("/")) {
    path = path.slice(1);
  }
  // split the path into parts - it will be structured like: /{type}/{id}/{type}/{id}
  const pathParts = path.split("/");

  const result: IParsedPath = {
    valid: true,
    reason: "",
    parts: pathParts,
  };

  // if the path is not structured correctly, return false
  if (pathParts.length % 2 !== 0) {
    result.valid = false;
    result.reason = "Path does not contain an even number of parts.";
  }

  // if the path is > 10 parts, return false
  if (pathParts.length > 10) {
    result.valid = false;
    result.reason = "Path is > 5 entities deep.";
  }

  // if the path contains invalid types, return false
  if (result.valid) {
    const validPaths = Object.keys(pathMap);
    for (let i = 0; i < pathParts.length; i += 2) {
      if (!validPaths.includes(pathParts[i])) {
        result.valid = false;
        result.reason = `Path contains invalid segment: ${pathParts[i]}.`;
      }
    }
  }

  return result;
}
