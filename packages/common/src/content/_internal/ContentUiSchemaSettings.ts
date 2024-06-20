import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import {
  IUiSchema,
  IUiSchemaElement,
  IUiSchemaMessage,
  UiSchemaMessageTypes,
} from "../../core/schemas/types";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { checkPermission } from "../../permissions/checkPermission";
import { isHostedFeatureServiceMainEntity } from "../hostedServiceUtils";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Editable Content.
 * This defines how the schema properties should be
 * rendered in the content settings editing experience
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
  if (
    checkPermission(
      "hub:content:workspace:settings:schedule",
      _context,
      options
    ).access
  ) {
    const scheduleControlElement: IUiSchemaElement = {
      type: "Control",
      scope: "/properties/schedule",
      labelKey: `${i18nScope}.sections.schedule.helperText`,
      options: {
        type: "Control",
        control: "hub-field-input-scheduler",
        labelKey: "fieldHeader",
        format: "radio",
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
    };

    const scheduleSectionElements: IUiSchemaElement[] = [
      scheduleControlElement,
    ];

    if (options.access !== "public") {
      // Disable the schedule control and add the unavailable notice
      scheduleControlElement.options.disabled = true;
      scheduleControlElement.options.messages = [
        {
          type: UiSchemaMessageTypes.custom,
          display: "notice",
          kind: "warning",
          icon: "exclamation-mark-triangle",
          titleKey: `${i18nScope}.fields.schedule.unavailableNotice.title`,
          labelKey: `${i18nScope}.fields.schedule.unavailableNotice.body`,
          allowShowBeforeInteract: true,
          alwaysShow: true,
        },
      ] as IUiSchemaMessage[];
    } else {
      // force update checkbox -- TODO: replace with button once available
      scheduleSectionElements.push({
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
      });
    }

    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.schedule.label`,
      elements: scheduleSectionElements,
    });
  }

  if (isHostedFeatureServiceMainEntity(options as IHubEditableContent)) {
    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.downloads.label`,
      options: {
        helperText: {
          labelKey: `${i18nScope}.sections.downloads.helperText`,
        },
      },
      elements: [
        {
          labelKey: `${i18nScope}.fields.serverExtractCapability.label`,
          scope: "/properties/serverExtractCapability",
          type: "Control",
          options: {
            helperText: {
              labelKey: `${i18nScope}.fields.serverExtractCapability.helperText`,
            },
          },
        },
      ],
    });
  }
  return uiSchema;
};
