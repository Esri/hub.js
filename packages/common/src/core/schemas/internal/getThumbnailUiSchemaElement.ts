import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getCdnAssetUrl } from "../../../urls/get-cdn-asset-url";
import { HubEntityType } from "../../types/HubEntityType";
import { IUiSchemaElement } from "../types";

const DEFAULT_ENTITY_THUMBNAILS: Partial<Record<HubEntityType, string>> = {
  discussion:
    "/ember-arcgis-opendata-components/assets/images/placeholders/discussion.png",
  group:
    "/ember-arcgis-opendata-components/assets/images/placeholders/group.png",
  event:
    "/ember-arcgis-opendata-components/assets/images/placeholders/event.png",
  content:
    "/ember-arcgis-opendata-components/assets/images/placeholders/content.png",
};

/**
 * Returns the UI schema element needed to render
 * the thumbnail editing control for an item-based entity.
 *
 * @param i18nScope i18n scope for the entity translations
 * @param thumbnail current thumbnail filename
 * @param thumbnailUrl current thumbnail URL
 * @param entityType the type of entity (content, group, event, etc)
 * @param requestOptions request options
 * @param defaultThumbnailUrl optional default thumbnail url to use instead of the standard one
 * @returns the UI schema element for thumbnail editing
 */
export function getThumbnailUiSchemaElement(
  i18nScope: string,
  thumbnail: string,
  thumbnailUrl: string,
  entityType: HubEntityType,
  requestOptions: IRequestOptions,
  defaultThumbnailUrl?: string
): IUiSchemaElement[] {
  const defaultEntityThumbnail =
    DEFAULT_ENTITY_THUMBNAILS[entityType] ?? DEFAULT_ENTITY_THUMBNAILS.content;
  const defaultImgUrl =
    defaultThumbnailUrl ||
    getCdnAssetUrl(defaultEntityThumbnail, requestOptions);

  let options;
  if (entityType === "group") {
    options = {
      aspectRatio: 1,
      sizeDescription: {
        labelKey: `${i18nScope}.fields._thumbnail.sizeDescription`,
      },
    };
  } else if (entityType === "event") {
    options = {
      aspectRatio: 1.5,
      sizeDescription: {
        labelKey: "shared.fields._thumbnail.sizeDescription",
      },
      sources: ["url"],
    };
  } else {
    options = {
      aspectRatio: 1.5,
      sizeDescription: {
        labelKey: "shared.fields._thumbnail.sizeDescription",
      },
    };
  }

  return [
    {
      labelKey:
        entityType === "group"
          ? `${i18nScope}.fields._thumbnail.label`
          : "shared.fields._thumbnail.label",
      scope: "/properties/_thumbnail",
      type: "Control",
      options: {
        control: "hub-field-input-image-picker",
        imgSrc: thumbnailUrl,
        defaultImgUrl,
        maxWidth: 727,
        maxHeight: 484,
        ...options,
      },
    },
  ];
}
