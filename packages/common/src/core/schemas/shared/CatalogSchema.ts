import { EntityType, targetEntities } from "../../../search/types/IHubCatalog";
import { IConfigurationSchema } from "../types";

/** JSON schema for an IPredicate */
export const PredicateSchema: IConfigurationSchema = {
  type: "object",
};

/** JSON schema for an IFilter */
export const FilterSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    operation: {
      type: "string",
      enum: ["AND", "OR"],
    },
    predicates: {
      type: "array",
      minItems: 1,
      items: PredicateSchema,
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
  },
};

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
      enum: ["list", "grid", "table", "map", "compact"],
      default: "list",
    },
    cardTitleTag: {
      type: "string",
      enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
      default: "h3",
    },
    // showThumbnail can be either a boolean or a string,
    // if it's a string, it can be "grid" which means show
    // the thumbnail in grid layout only
    showThumbnail: {
      oneOf: [{ type: "string" }, { type: "boolean" }],
      enum: [true, false, "grid"],
      default: true,
    },
    corners: { type: "string", enum: ["square", "round"], default: "square" },
    shadow: {
      type: "string",
      enum: ["none", "low", "medium", "heavy"],
      default: "none",
    },
    showLinkButton: { type: "boolean", default: false },
    linkButtonStyle: {
      type: "string",
      enum: ["outline", "outline-filled"],
      default: "outline-filled",
    },
    linkButtonText: { type: "string", default: "Explore" },
  },
};

/**
 * JSON schema for the appearance of an IHubCollection
 */
export const CollectionAppearanceSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    displayConfig: GalleryDisplayConfigSchema,
  },
};

/**
 * JSON schema for the appearance of a catalog
 */
export const CatalogAppearanceSchema: IConfigurationSchema = {
  type: "object",
  properties: {
    displayConfig: GalleryDisplayConfigSchema,
    collections: {
      type: "array",
      items: CollectionAppearanceSchema,
    },
  },
};
