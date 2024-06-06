import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { IUiSchema } from "../../core/schemas/types";

/**
 * @private
 * constructs the followers uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site followers > settings
 * experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            labelKey: `${i18nScope}.fields.access.label`,
            scope: "/properties/access",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: `${i18nScope}.fields.access.helperText.siteFollowers`,
              },
              labels: [
                `{{${i18nScope}.fields.access.private.label:translate}}`,
                `{{${i18nScope}.fields.access.org.label:translate}}`,
                `{{${i18nScope}.fields.access.public.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.access.private.description.siteFollowers:translate}}`,
                `{{${i18nScope}.fields.access.org.description.siteFollowers:translate}}`,
                `{{${i18nScope}.fields.access.public.description.siteFollowers:translate}}`,
              ],
              icons: ["users", "organization", "globe"],
              styles: { "max-width": "45rem" },
            },
          },
          {
            labelKey: `${i18nScope}.fields.showFollowAction.label`,
            scope: "/properties/showFollowAction",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.showFollowAction.helperText`,
              },
            },
          },
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
