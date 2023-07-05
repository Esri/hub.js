export const HUB_ENTITY_TYPES = [
  "site",
  "project",
  "initiative",
  "page",
  "discussion",
  "content",
  "org",
] as const;
export type HubEntityType = (typeof HUB_ENTITY_TYPES)[number];
