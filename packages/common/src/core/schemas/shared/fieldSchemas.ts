export const ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
};

export const TAGS_SCHEMA = {
  type: "array",
  items: {
    type: "string",
  },
};

export const GALLERY_PICKER_SCHEMA = {
  type: "array",
  items: {
    type: "string",
  },
};

export const EXTENT_SCHEMA = {
  type: "object",
  properties: {
    spacialReference: { type: "object" },
    xmax: { type: ["number", "null"] },
    xmin: { type: ["number", "null"] },
    ymax: { type: ["number", "null"] },
    ymin: { type: ["number", "null"] },
  },
};
