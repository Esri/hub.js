import {
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../shared/subschemas";
import { IConfigurationSchema } from "../../types";

export const EventGalleryCardSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    selectionMode: {
      type: "string",
      enum: ["dynamic", "manual"],
      default: "dynamic",
    },
    entityIds: {
      type: "array",
      // any max?, existing upcoming events card doesn't limit, inherently capped at 100
      // maxItems: 3,
      items: {
        type: "string",
      },
      default: [],
    },
    eventIds: {
      type: "array",
      // any max?, existing featured event caps at 1
      // maxItems: 3,
      items: {
        type: "string",
      },
      default: [],
    },
    corners: {
      type: "string",
      enum: ["squared", "rounded"],
      default: "squared",
    },
    shadow: {
      type: "string",
      enum: ["none", "low", "medium", "heavy"],
      default: "none",
    },
    showAdditionalInfo: {
      type: "boolean",
      default: true,
    },
    access: {
      type: "array",
      items: {
        type: "string",
        enum: ["private", "organization", "public"],
      },
      default: [],
    },
    tags: ENTITY_TAGS_SCHEMA,
    categories: ENTITY_CATEGORIES_SCHEMA,
    titleHeading: {
      type: "string",
      enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
      default: "h4",
    },
    openIn: {
      type: "string",
      enum: ["same", "new"],
      default: "same",
    },
  },
};
