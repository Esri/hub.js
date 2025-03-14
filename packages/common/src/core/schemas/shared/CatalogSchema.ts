import { EntityType, targetEntities } from "../../../search/types/IHubCatalog";
import { IConfigurationSchema } from "../types";
import { CARD_TITLE_TAGS, CORNERS, DROP_SHADOWS } from "./enums";

/**
 * JSON schema for the appearance of a gallery display
 * This can be for a catalog, a collection, a gallery card, etc
 */
export const GalleryDisplayConfigSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    hidden: { type: "boolean", default: false },
    layout: {
      type: "string",
      enum: [
        "list",
        "grid",
        "grid-filled",
        "table",
        "map",
        "compact",
        "calendar",
      ],
      default: "list",
    },
    cardTitleTag: {
      type: "string",
      enum: Object.keys(CARD_TITLE_TAGS),
      default: CARD_TITLE_TAGS.h3,
    },
    showThumbnail: {
      type: "string",
      enum: ["show", "hide", "grid"],
      default: "show",
    },
    corners: {
      type: "string",
      enum: Object.keys(CORNERS),
      default: CORNERS.square,
    },
    shadow: {
      type: "string",
      enum: Object.keys(DROP_SHADOWS),
      default: DROP_SHADOWS.none,
    },
    showLinkButton: { type: "boolean", default: false },
    linkButtonStyle: {
      type: "string",
      enum: ["outline", "outline-filled"],
      default: "outline-filled",
    },
    linkButtonText: { type: "string", default: "Explore" },
    sort: {
      type: "string",
      enum: ["relevance", "title", "created", "modified"],
      default: "relevance",
    },
    filters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: [
              "location",
              "type",
              "source",
              "event-occurrence",
              "event-from",
              "event-attendance",
              "tags",
              "categories",
              "license",
              "modified",
              "access",
              "group-role",
              "group-type",
              "group-access",
              "event-access",
              "event-date",
            ],
          },
          hidden: { type: "boolean" },
          label: { type: "string" },
        },
      },
    },
  },
};

/** JSON schema for an IPredicate */
export const PredicateSchema: IConfigurationSchema = {
  type: "object",
  minProperties: 1,
};

/** JSON schema for an IFilter */
export const FilterSchema: IConfigurationSchema = {
  type: "object",
  minProperties: 1,
  properties: {
    operation: {
      type: "string",
      enum: ["AND", "OR"],
    },
    predicates: {
      type: "array",
      items: PredicateSchema,
      minItems: 1,
    },
  },
};

/** JSON schema for an IQuery */
export const QuerySchema: IConfigurationSchema = {
  type: "object",
  required: ["targetEntity"],
  properties: {
    targetEntity: {
      type: "string",
      enum: [...targetEntities],
    },
    filters: {
      type: "array",
      items: FilterSchema,
      minItems: 1,
    },
  },
};

/** JSON schema for an IHubCollection */
export const CollectionSchema: IConfigurationSchema = {
  type: "object",
  required: ["label"],
  properties: {
    label: {
      type: "string",
    },
    scope: QuerySchema,
    displayConfig: GalleryDisplayConfigSchema,
  },
};

/** JSON schema for an IHubCatalog */
export const CatalogSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    scopes: {
      type: "object",
      properties: targetEntities.reduce(
        (acc: Record<EntityType, any>, targetEntity: EntityType) => {
          acc[targetEntity] = QuerySchema;
          return acc;
        },
        {} as Record<EntityType, any>
      ),
    },
    collections: {
      type: "array",
      items: CollectionSchema,
    },
    displayConfig: {
      type: "object",
      properties: targetEntities.reduce(
        (acc: Record<EntityType, any>, targetEntity: EntityType) => {
          acc[targetEntity] = GalleryDisplayConfigSchema;
          return acc;
        },
        {} as Record<EntityType, any>
      ),
    },
  },
};
