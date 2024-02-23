export const HUB_ENTITY_TYPES = [
  "site",
  "project",
  "initiative",
  "initiativeTemplate",
  "page",
  "discussion",
  "content",
  "org",
  "group",
  "template",
  "survey",
] as const;
export type HubEntityType = (typeof HUB_ENTITY_TYPES)[number];
