import { IConfigurationSchema } from "../types";
import {
  ENTITY_ACCESS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_FEATURED_CONTENT_SCHEMA,
  ENTITY_IMAGE_SCHEMA,
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  ENTITY_LOCATION_SCHEMA,
  ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_TAGS_SCHEMA,
  ENTITY_TIMELINE_SCHEMA,
} from "./subschemas";

/**
 * Defines a shared subschema for an IHubItemEntity's editiable
 * fields. All item entity schemas should "extend" this subschema
 */
export const HubItemEntitySchema: IConfigurationSchema = {
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
    view: {
      type: "object",
      properties: {
        featuredContentIds: ENTITY_FEATURED_CONTENT_SCHEMA,
        featuredImage: ENTITY_IMAGE_SCHEMA,
        featuredImageAltText: { type: "string" },
        featuredImageName: { type: "string" },
        timeline: ENTITY_TIMELINE_SCHEMA,
      },
    },
  },
} as IConfigurationSchema;
