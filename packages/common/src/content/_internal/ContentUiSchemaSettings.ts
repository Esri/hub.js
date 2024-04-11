import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { isHostedFeatureServiceEntity } from "../hostedServiceUtils";

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
    label: "Scheduling",
    elements: [
      // TODO: wrap this element in a feature flag / permission
      {
        type: "Section",
        label: "Scheduling", // TODO: i18n
        elements: [
          {
            type: "Control",
            scope: "/properties/schedule",
            label:
              "Hub will automatically try to determine the best time to generate a download file for this item. However, you can choose to manually set when you want the download file to be updated.", // TODO: i18n
            options: {
              type: "Control",
              control: "hub-field-input-scheduler",
              format: "radio",
              inputs: [
                { label: "Default", type: "automatic" }, // TODO: i18n
                {
                  label: "Daily",
                  type: "daily",
                  expandedHelperText: "Each day at",
                }, // TODO: i18n
                {
                  label: "Weekly",
                  type: "weekly",
                  expandedHelperText: "Each week on",
                }, // TODO: i18n
                {
                  label: "Monthly",
                  type: "monthly",
                  expandedHelperText: "Each month on",
                }, // TODO: i18n
                {
                  label: "Yearly",
                  type: "annually",
                  expandedHelperText: "Each year on",
                }, // TODO: i18n
                {
                  label: "Manual",
                  type: "manual",
                  helperActionIcon: "information-f",
                  helperActionText:
                    "Use this option to manually update the search index and cached download files for this item.",
                }, // TODO: i18n
              ],
            },
          },
        ],
      },
    ],
  };

  if (isHostedFeatureServiceEntity(options as IHubEditableContent)) {
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
