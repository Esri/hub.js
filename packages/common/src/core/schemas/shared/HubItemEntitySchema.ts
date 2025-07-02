import { HubEntityHero } from "../../../hub-types";
import { IAsyncConfigurationSchema } from "../types";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_FEATURED_CONTENT_SCHEMA,
  ENTITY_IMAGE_SCHEMA,
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  ENTITY_LOCATION_SCHEMA,
  ENTITY_MAP_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_TAGS_SCHEMA,
  ENTITY_TIMELINE_SCHEMA,
  SLUG_SCHEMA,
} from "./subschemas";

/**
 * Defines a default schema for an IHubItemEntity's editiable fields.
 * All item entity schemas should leverage this base schema.
 * Reference the Project or Initiative schemas as an example
 */
export const HubItemEntitySchema: IAsyncConfigurationSchema = {
  $async: true,
  type: "object",
  required: ["name"],
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: ENTITY_SUMMARY_SCHEMA,
    description: { type: "string" },
    access: ENTITY_ACCESS_SCHEMA,
    location: ENTITY_LOCATION_SCHEMA,
    tags: ENTITY_TAGS_SCHEMA,
    categories: ENTITY_CATEGORIES_SCHEMA,
    isDiscussable: ENTITY_IS_DISCUSSABLE_SCHEMA,
    _thumbnail: ENTITY_IMAGE_SCHEMA,
    _followers: {
      type: "object",
      properties: {
        groupAccess: {
          ...ENTITY_ACCESS_SCHEMA,
          enum: ["private", "org", "public"],
        },
        showFollowAction: {
          type: "boolean",
          default: true,
        },
        isDiscussable: ENTITY_IS_DISCUSSABLE_SCHEMA,
      },
    },
    _associations: {
      type: "object",
      properties: {
        groupAccess: {
          ...ENTITY_ACCESS_SCHEMA,
          enum: ["private", "org", "public"],
          default: "private",
        },
        membershipAccess: {
          type: "string",
          enum: ["organization", "collaborators", "anyone"],
          default: "organization",
        },
      },
    },
    view: {
      type: "object",
      properties: {
        embeds: { type: "array" },
        featuredContentIds: ENTITY_FEATURED_CONTENT_SCHEMA,
        featuredImage: ENTITY_IMAGE_SCHEMA,
        featuredImageAltText: { type: "string" },
        featuredImageName: { type: "string" },
        mapSettings: ENTITY_MAP_SCHEMA,
        timeline: ENTITY_TIMELINE_SCHEMA,
        hero: {
          type: "string",
          default: HubEntityHero.map,
          enum: Object.keys(HubEntityHero),
        },
        heroActions: { type: "array" },
      },
    },
    _slug: SLUG_SCHEMA,
    assistant: {
      type: "object",
      required: [
        "access",
        "personality",
        "description",
        "location",
        // "examplePrompts", // commenting this out for now, as it is not required in the current implementation
      ],
      properties: {
        schemaVersion: { type: "number" },
        enabled: {
          type: "boolean",
          default: false,
        },
        access: ENTITY_ACCESS_SCHEMA,
        accessGroups: { type: "array", items: { type: "string" } },
        personality: { type: "string" },
        description: { type: "string" },
        location: { type: "string" },
        examplePrompts: { type: "array", items: { type: "string" } },
        workflows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string" },
              label: { type: "string" },
              description: { type: "string" },
              action: { type: "string", enum: ["search", "respond"] },
              response: { type: "string" },
              sources: { type: "array", items: { type: "string" } },
            },
          },
        },
        testPrompts: { type: "array", items: { type: "string" } },
      },
    },
  },
} as IAsyncConfigurationSchema;
