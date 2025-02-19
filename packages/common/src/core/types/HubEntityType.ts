export const HUB_ENTITY_TYPES = [
  "content",
  "discussion",
  "event",
  "group",
  "initiative",
  "initiativeTemplate",
  // "org", // TODO: Remove at breaking change
  "organization",
  "page",
  "project",
  "site",
  "survey",
  "template",
  "user",
] as const;
export type HubEntityType = (typeof HUB_ENTITY_TYPES)[number];
