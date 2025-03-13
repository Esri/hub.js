export const HUB_ENTITY_TYPES = [
  "content",
  "discussion",
  "event",
  "group",
  "initiative",
  "initiativeTemplate",
  "org", // TODO: Remove at next breaking change
  "organization",
  "page",
  "project",
  "site",
  "survey",
  "template",
  "user",
  "channel",
] as const;
export type HubEntityType = (typeof HUB_ENTITY_TYPES)[number];
