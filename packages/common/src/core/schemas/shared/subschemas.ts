import { IHubItemEntity } from "../../types";
import { IUiSchemaElement } from "../types";

/**
 * For consistency and validation purposes, leverage these commonly
 * re-used subschemas in your schema definitions
 */

export const ENTITY_NAME_SCHEMA = {
  type: "string",
  minLength: 1,
  maxLength: 250,
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

/**
 * Returns the UI schema elements necessary to properly render
 * the thumbnail editing control for an item-based entity.
 *
 * @param i18nScope i18n scope for the entity translations
 * @param entity The entity to build the UI schema for
 * @returns an array of UI schema elements for thumbnail editing
 */
export function getThumbnailUiSchemaElements(
  i18nScope: string,
  entity: IHubItemEntity
): IUiSchemaElement[] {
  return [
    // Actual control for modifying the thumbnail
    {
      labelKey: `${i18nScope}.fields._thumbnail.label`,
      scope: "/properties/_thumbnail",
      type: "Control",
      options: {
        control: "hub-field-input-image-picker",
        imgSrc: entity.thumbnailUrl,
        maxWidth: 727,
        maxHeight: 484,
        aspectRatio: 1.5,
        helperText: {
          labelKey: `${i18nScope}.fields._thumbnail.helperText`,
        },
        sizeDescription: {
          labelKey: `${i18nScope}.fields._thumbnail.sizeDescription`,
        },
        messages: [
          {
            type: "CUSTOM",
            display: "notice",
            labelKey: "shared.defaultThumbnailNotice",
            icon: "lightbulb",
            allowShowBeforeInteract: true,
            condition: {
              /**
               * Validation fn to evaluate whether an entity is populated by a
               * default thumbnail. This can be evaluated in one of two ways:
               * 1. There is no thumbnail at all (usually temporary)
               * 2. There is an auto-generated thumbnail showcasing geometry (always named `ago_downloaded.png`)
               */
              validator: ((entity: IHubItemEntity) => {
                const thumbnail = entity.thumbnail;
                return thumbnail === null || thumbnail === "thumbnail/ago_downloaded.png"
              }).bind(undefined, entity)
            },
          },
        ],
      },
    },
  ];
}
