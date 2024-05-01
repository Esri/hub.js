import { checkPermission } from "../..";
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
    elements: [],
  };

  if (
    checkPermission("hub:content:workspace:settings:schedule", _context)
      .access &&
    options.access === "public"
  ) {
    uiSchema.elements.push({
      type: "Section",
      labelKey: `${i18nScope}.sections.schedule.label`,
      elements: [
        {
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
              { type: "manual" },
            ],
          },
        },
        // force update checkbox -- TODO: replace with button once available
        {
          type: "Control",
          scope: "/properties/schedule/properties/_forceUpdate",
          options: {
            control: "hub-field-input-tile-select",
            type: "checkbox",
            labels: ["Force Update"],
            descriptions: [
              'Select this option and then select "Save" to manually update the search index and cached download files for this item as applicable.',
            ],
          },
        },
      ],
    });
  }

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
