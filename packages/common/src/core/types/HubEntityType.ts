export const HUB_ITEM_ENTITY_TYPES = [
  "content",
  "initiative",
  "initiativeTemplate",
  "page",
  "project",
  "site",
  "survey",
  "template",
] as const;
export type HubItemEntityType = (typeof HUB_ITEM_ENTITY_TYPES)[number];

export const HUB_ENTITY_TYPES = [
  ...HUB_ITEM_ENTITY_TYPES,
  "discussion",
  "event",
  "group",
  "org", // TODO: Remove at next breaking change
  "organization",
  "user",
  "channel",
  "post",
] as const;
export type HubEntityType = (typeof HUB_ENTITY_TYPES)[number];
