import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent, IUiSchema } from "../../core";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Editable Content.
 * This defines how the schema properties should be
 * rendered in the content settings editing experience
 */
 export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubEditableContent,
  _context: IArcGISContext
): Promise<IUiSchema> => {
  const uiSchema: IUiSchema = {
    type: "Layout",
    elements: [],
  }
  // TODO: Use helper
  if (entity.type === 'Feature Service' && entity.typeKeywords?.includes('Hosted Service')) {
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
          labelKey: `${i18nScope}.fields.hostedDownloads.label`,
          scope: "/properties/hostedDownloads",
          type: "Control",
          options: {
            helperText: {
              labelKey: `${i18nScope}.fields.hostedDownloads.helperText`,
              placement: "bottom",
            },
          },
        }
      ],
    },)
  }
  return uiSchema;
};
