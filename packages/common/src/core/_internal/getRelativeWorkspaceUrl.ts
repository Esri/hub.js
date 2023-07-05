import { getTypeFromEntity } from "../..";
import { HubEntity } from "../types";

/**
 * From within the context of a hub site, the following util
 * returns an entity's relative workspace URL
 * @param type entity type
 * @param identifier entity id or slug
 */
export const getRelativeWorkspaceUrl = (
  type: string,
  identifier: string
): string => {
  const entityType = getTypeFromEntity({ type } as HubEntity);
  /**
   * Note: this logic will likely need to be enhanced for
   * enterprise and to handle other entity variances
   */
  return `/workspace/${entityType}s/${identifier}`;
};
