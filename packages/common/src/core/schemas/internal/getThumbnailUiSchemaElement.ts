import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getCdnAssetUrl } from "../../../urls/get-cdn-asset-url";
import { HubEntityType } from "../../types/HubEntityType";
import { IUiSchemaElement } from "../types";
import { getItemDataUrl } from "../../../urls/get-item-data-url";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../../types/IHubEditableContent";
import { IArcGISContext } from "../../../types/IArcGISContext";

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
 * To only be used by IHubEditableContent entities when attempting to determine
 * the default thumbnail for a content entity with a type of "Image"
 *
 * For test coverage purposes, I've move this logic out of the buildUiSchema function.
 *
 * @param options
 * @param context
 * @returns string | undefined
 */
export const getDefaultImageEntityThumbnail = (
  options: Partial<IHubEditableContent>,
  context: IArcGISContext
): string | undefined => {
  return options.type === "Image"
    ? // if the content is an Image, use its own data url as the default thumbnail
      getItemDataUrl(
        { id: options.id, access: options.access } as IItem,
        context.hubRequestOptions,
        context.hubRequestOptions.authentication?.token
      )
    : undefined;
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
