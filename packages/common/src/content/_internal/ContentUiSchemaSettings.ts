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
        {
          labelKey: `${i18nScope}.fields.hostedDownloads.label`,
          scope: "/properties/hostedDownloads",
          type: "Control",
          options: {
            helperText: {
              labelKey: `${i18nScope}.fields.hostedDownloads.helperText`,
            },
          },
          rule: {
            effect: UiSchemaRuleEffects.DISABLE,
            condition: {
              schema: {
                properties: {
                  serverExtractCapability: { const: false },
                },
              },
            },
          },
        },
      ],
    });
  }
  return uiSchema;
};
