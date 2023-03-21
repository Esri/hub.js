/**
 * For consistency and validation purposes, leverage these commonly
 * re-used subschemas in your schema definitions
 */

export const ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
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
