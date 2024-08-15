import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getCdnAssetUrl } from "../../../urls";
import { HubEntityType } from "../../types/HubEntityType";
import {
  IUiSchemaElement,
  IUiSchemaMessage,
  UiSchemaMessageTypes,
} from "../types";

const DEFAULT_ENTITY_THUMBNAILS = {
  discussion:
    "/ember-arcgis-opendata-components/assets/images/placeholders/discussion.png",
  site: "",
  project: "",
  initiative: "",
  initiativeTemplate: "",
  page: "",
  content: "",
  org: "",
  group: "",
  template: "",
  survey: "",
  event: "",
  user: "",
};

/**
 * Returns the UI schema element needed to render
 * the thumbnail editing control for an item-based entity.
 *
 * @param i18nScope i18n scope for the entity translations
 * @param entity The entity to build the UI schema for
 * @returns the UI schema element for thumbnail editing
 */
export function getThumbnailUiSchemaElement(
  i18nScope: string,
  thumbnail: string,
  thumbnailUrl: string,
  entityType: HubEntityType,
  requestOptions: IRequestOptions
): IUiSchemaElement {
  const messages: IUiSchemaMessage[] = [];
  // Advise the user if the entity's thumbnail is either of the default values
  if (!thumbnail || thumbnail === "thumbnail/ago_downloaded.png") {
    messages.push({
      type: UiSchemaMessageTypes.custom,
      display: "notice",
      labelKey: "shared.fields._thumbnail.defaultThumbnailNotice",
      icon: "lightbulb",
      allowShowBeforeInteract: true,
      alwaysShow: true,
    });
  }
  const defaultImgSrc =
    DEFAULT_ENTITY_THUMBNAILS[entityType] &&
    getCdnAssetUrl(DEFAULT_ENTITY_THUMBNAILS[entityType], requestOptions);

  return {
    labelKey: "shared.fields._thumbnail.label",
    scope: "/properties/_thumbnail",
    type: "Control",
    options: {
      control: "hub-field-input-image-picker",
      imgSrc: thumbnailUrl,
      defaultImgSrc,
      maxWidth: 727,
      maxHeight: 484,
      aspectRatio: 1.5,
      helperText: {
        // helper text varies between entity types
        labelKey: `${i18nScope}.fields._thumbnail.helperText`,
      },
      sizeDescription: {
        labelKey: "shared.fields._thumbnail.sizeDescription",
      },
      messages,
    },
  };
}
