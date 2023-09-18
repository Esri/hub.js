import { IHubSite } from "../../core/types";
import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";

/**
 * @private
 * settings uiSchema for Hub Discussions - this
 * defines how the schema properties should be
 * rendered in the Discussions settings experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubSite,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.discussions.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.discussable.label`,
            scope: "/properties/isDiscussable",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.discussable.enabled.label:translate}}`,
                `{{${i18nScope}.fields.discussable.disabled.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.discussable.enabled.description:translate}}`,
                `{{${i18nScope}.fields.discussable.disabled.description:translate}}`,
              ],
              icons: ["speech-bubbles", "circle-disallowed"],
            },
          },
        ],
      },
    ],
  };
};
