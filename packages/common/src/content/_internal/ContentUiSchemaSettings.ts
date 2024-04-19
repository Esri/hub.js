import { checkPermission } from "../..";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IUiSchema } from "../../core/schemas/types";
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
    checkPermission("hub:content:workspace:settings:schedule", _context).access
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
              // uncomment this when the manual option is available
              // {
              //   label: `option.manual.label`,
              //   type: "manual",
              //   helperActionIcon: "information-f",
              //   helperActionText: "option.manual.helperActionText",
              // },
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
