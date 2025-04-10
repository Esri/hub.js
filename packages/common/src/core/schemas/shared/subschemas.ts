/**
 * For consistency and validation purposes, leverage these commonly
 * re-used subschemas in your schema definitions
 */

import { JSONSchema } from "json-schema-typed";

export const ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
  format: "entityTitleValidator",
};

export const SITE_ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
  format: "siteEntityTitleValidator",
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

export const ENTITY_TAGS_SCHEMA: JSONSchema = {
  type: "array",
  items: {
    type: "string",
  },
};

export const ENTITY_CATEGORIES_SCHEMA: JSONSchema = {
  type: "array",
  items: {
    type: "string",
  },
  maxItems: 20,
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
  properties: {
    type: {
      type: "string",
      enum: ["none", "org", "custom"],
      default: "none",
    },
    name: {
      type: "string",
    },
  },
};

/**
 * defines the JSON schema for the map configuration settings
 */
export const ENTITY_MAP_SCHEMA = {
  type: "object",
  properties: {
    baseViewItemId: {
      type: "array",
      items: {
        type: "string",
      },
      maxItems: 1,
    },
  },
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
    url: { type: "string" },
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

export const PRIVACY_CONFIG_SCHEMA = {
  type: "object",
  properties: {
    consentNotice: {
      type: "object",
      properties: {
        allowPrivacyConfig: {
          type: "boolean",
          default: false,
        },
        blocking: {
          type: "boolean",
          default: false,
        },
        disclaimer: {
          type: "array",
          items: [
            {
              type: "object",
              properties: {
                text: {
                  type: "string",
                },
                lang: {
                  type: "string",
                },
                default: {
                  type: "boolean",
                },
              },
            },
          ],
        },
        policyURL: {
          type: "string",
          pattern:
            "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w.-]*)*\\/?$|^$",
        },
      },
    },
  },
};

export const SLUG_SCHEMA: JSONSchema = {
  type: "string",
  /** lower case alpha numeric characters and '-' only */
  // using the same regex as the slug formatter
  // this will prevent trailing - or multiple - in a row
  pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
};
