import type { IArcGISContext } from "../../types/IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import {
  IUiSchema,
  IUiSchemaElement,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { checkPermission } from "../../permissions/checkPermission";
import { getDownloadsSection } from "./getDownloadsSection";
import { shouldShowDownloadsConfiguration } from "./shouldShowDownloadsConfiguration";
import { getItemHomeUrl } from "../../urls/get-item-home-url";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Editable Content.
 * This defines how the schema properties should be
 * rendered in the content settings editing experience
 */
/* eslint-disable @typescript-eslint/require-await */
/*
 * We are disabling the require-await rule to maintain the same pattern used
 * across other uiSchema builders. Calling code expects a promise, and
 * decorating the function as async automatically wraps the return value
 * in a resolved promise. If an await is added in the future, then this
 * disabling rule and comment can be removed.
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  _context: IArcGISContext
): Promise<IUiSchema> => {
  const uiSchema: IUiSchema = {
    type: "Layout",
    elements: [],
  };
  // map display settings for feature layer content
  uiSchema.elements.push({
    type: "Section",
    labelKey: `${i18nScope}.sections.mapSettings.label`,
    elements: [
      {
        type: "Control",
        scope: "/properties/view/properties/mapSettings",
        options: {
          type: "Control",
          control: "hub-composite-input-map-settings",
          visibleSettings: ["displaySettings"],
          showPreview: false,
          itemHomeUrl: getItemHomeUrl(options.id, _context.hubRequestOptions),
        },
      },
    ],
    rules: [
      {
        effect: UiSchemaRuleEffects.SHOW,
        conditions: [options.type === "Feature Service"],
      },
    ],
  });

  // schedule settings
  if (
    checkPermission(
      "hub:content:workspace:settings:schedule",
      _context,
      options
    ).access
  ) {
    const scheduleSectionElements: IUiSchemaElement[] = [
      {
        type: "Control",
        scope: "/properties/schedule",
        labelKey: `${i18nScope}.sections.schedule.helperText`,
        options: {
          type: "Control",
          control: "hub-field-input-scheduler",
          labelKey: "fieldHeader",
          format: "select",
          inputs: [
            { type: "automatic" },
            { type: "daily" },
            { type: "weekly" },
            { type: "monthly" },
            { type: "yearly" },
            {
              type: "manual",
              helperActionIcon: "information-f",
              helperActionText: `{{${i18nScope}.fields.schedule.manual.helperActionText:translate}}`,
            },
          ],
        },
        rules: [
          {
            effect: UiSchemaRuleEffects.DISABLE,
            conditions: [options.access !== "public"],
          },
        ],
      },
      {
        type: "Notice",
        options: {
          notice: {
            configuration: {
              id: "schedule-unavailable-notice",
              noticeType: "notice",
              closable: false,
              kind: "warning",
              icon: "exclamation-mark-triangle",
              scale: "m",
            },
            title: `{{${i18nScope}.fields.schedule.unavailableNotice.title:translate}}`,
            message: `{{${i18nScope}.fields.schedule.unavailableNotice.body:translate}}`,
            autoShow: true,
          },
        },
        rules: [
          {
            effect: UiSchemaRuleEffects.SHOW,
            conditions: [options.access !== "public"],
          },
        ],
      },
      {
        type: "Control",
        scope: "/properties/_forceUpdate",
        options: {
          control: "hub-field-input-tile-select",
          type: "checkbox",
          labels: [
            `{{${i18nScope}.fields.schedule.forceUpdateButton.label:translate}}`,
          ],
          descriptions: [
            `{{${i18nScope}.fields.schedule.forceUpdateButton.description:translate}}`,
          ],
        },
        rules: [
          {
            effect: UiSchemaRuleEffects.SHOW,
            conditions: [options.access === "public"],
          },
        ],
      },
    ];

    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.schedule.label`,
      elements: scheduleSectionElements,
    });
  }

  if (shouldShowDownloadsConfiguration(options as IHubEditableContent)) {
    const downloadsSection = getDownloadsSection(
      i18nScope,
      options as IHubEditableContent
    );
    uiSchema.elements.push(downloadsSection);
  }

  return uiSchema;
};
