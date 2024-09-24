import { EntityType, targetEntities } from "../../../search/types/IHubCatalog";
import { IConfigurationSchema } from "../types";

export const PredicateSchema: IConfigurationSchema = {
  type: "object",
};

export const FilterSchema: IConfigurationSchema = {
  type: "object",
  required: ["predicates"],
  properties: {
    operation: {
      type: "string",
      enum: ["AND", "OR"],
    },
    predicates: {
      type: "array",
      items: PredicateSchema,
    },
  },
};

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
