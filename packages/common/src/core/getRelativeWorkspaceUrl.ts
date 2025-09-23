import { getTypeFromEntity } from "./getTypeFromEntity";
import { isValidEntityType } from "./isValidEntityType";
import { HubEntity } from "./types/HubEntity";

/**
 * From within the context of a hub site, the following util
 * returns an entity's relative workspace URL
 *
 * @param type item type
 * @param identifier entity id or slug
 */
export const getRelativeWorkspaceUrl = (
  type: string,
  identifier: string,
  pane?: string
): string => {
  let url = "/";
  const entityType = getTypeFromEntity({ type } as HubEntity);

  /**
   * Note: this logic will likely need to be enhanced to:
   * 1. accommodate enterprise
   * 2. handle entity variation
   */
  if (isValidEntityType(entityType)) {
    let typeSegment = entityType as string;
    if (typeSegment !== "content") {
      typeSegment = `${typeSegment}s`;
    }
    url = `/workspace/${typeSegment}/${identifier}`;
    if (pane) {
      url += `/${pane}`;
    }
  }

  return url;
};
