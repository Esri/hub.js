/**
 * DEPRECATED
 *
 * This util has been deprecated. It was a duplicate of another util and is the concern of the UI,
 * so it was moved as such.
 *
 * It will be removed in the next breaking version.
 * @param entityType
 * @returns
 */
export const getEntityDefaultWorkspacePane = (entityType: string): string => {
  const DEFAULT_PANES: Record<string, string> = {
    discussion: "details",
  };
  return DEFAULT_PANES[entityType];
};
