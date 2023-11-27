export const getEntityDefaultWorkspacePane = (entityType: string): string => {
  const DEFAULT_PANES: Record<string, string> = {
    discussion: "details",
  };
  return DEFAULT_PANES[entityType];
};
