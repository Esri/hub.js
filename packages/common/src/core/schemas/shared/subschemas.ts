/**
 * For consistency and validation purposes, leverage these commonly
 * re-used subschemas in your schema definitions
 */

export const ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
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

export const ENTITY_EXTENT_SCHEMA = {
  type: "object",
  properties: {
    spatialReference: { type: "object" },
    xmax: { type: ["number", "null"] },
    xmin: { type: ["number", "null"] },
    ymax: { type: ["number", "null"] },
    ymin: { type: ["number", "null"] },
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
          title: { type: "string" }, // we should make this required or add minLength: 1 once we know how to handle in the UI
          timeframe: { type: "string" },
          stageDescription: { type: "string" },
          status: { type: "string" },
          link: {
            type: "object",
            properties: {
              href: { type: "string" }, // we should add format: uri here once we know how to handle this in the UI
              title: { type: "string" },
            },
          },
        },
      },
    },
  },
};
