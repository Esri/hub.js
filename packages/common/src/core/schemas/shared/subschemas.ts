/**
 * For consistency and validation purposes, leverage these commonly
 * re-used subschemas in your schema definitions
 */

export const ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
};

export const ENTITY_SUMMARY_SCHEMA = {
  type: "string",
  maxLength: 2048,
};

export const ENTITY_ACCESS_SCHEMA = {
  type: "string",
  enum: ["public", "org", "private"],
  default: "private",
};

export const ENTITY_TAGS_SCHEMA = {
  type: "array",
  items: {
    type: "string",
  },
};

export const ENTITY_CATEGORIES_SCHEMA = {
  type: "array",
  items: {
    type: "string",
  },
};

export const ENTITY_IS_DISCUSSABLE_SCHEMA = {
  type: "boolean",
  enum: [true, false],
  default: true,
};

export const ENTITY_FEATURED_CONTENT_SCHEMA = {
  type: "array",
  maxItems: 4,
  items: {
    type: "string",
  },
};

export const ENTITY_LOCATION_SCHEMA = {
  type: "object",
  default: { type: "none" },
};

export const ENTITY_IMAGE_SCHEMA = {
  type: "object",
  properties: {
    base64: { type: "string" },
    format: { type: "string" },
    fileName: { type: "string" },
    blob: {
      type: "object",
      properties: {
        type: { type: "string" },
        size: { type: "number" },
      },
    },
  },
};

export const ENTITY_TIMELINE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    canCollapse: { type: "boolean" },
    stages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          // we should make title required or add minLength: 1
          // once we know how to handle in the UI
          title: { type: "string" },
          timeframe: { type: "string" },
          stageDescription: { type: "string" },
          status: { type: "string" },
          link: {
            type: "object",
            properties: {
              // we should add format: url here once we know how
              // to handle this in the UI
              href: { type: "string" },
              title: { type: "string" },
            },
          },
        },
      },
    },
  },
};
