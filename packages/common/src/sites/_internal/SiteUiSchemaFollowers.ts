import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubSite } from "../../core/types";
import { getProp } from "../../objects";

/**
 * @private
 * constructs the followers uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site followers > settings
 * experience
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
        elements: [
          {
            labelKey: `${i18nScope}.fields.followers.access.label`,
            scope: "/properties/_followers/properties/access",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: `${i18nScope}.fields.followers.access.helperText`,
              },
              labels: [
                `{{${i18nScope}.fields.followers.access.private.label:translate}}`,
                `{{${i18nScope}.fields.followers.access.org.label:translate}}`,
                `{{${i18nScope}.fields.followers.access.public.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.followers.access.private.description:translate}}`,
                `{{${i18nScope}.fields.followers.access.org.description:translate}}`,
                `{{${i18nScope}.fields.followers.access.public.description:translate}}`,
              ],
              icons: ["users", "organization", "globe"],
              styles: { "max-width": "45rem" },
            },
          },
          {
            labelKey: `${i18nScope}.fields.followers.showFollowAction.label`,
            scope: "/properties/_followers/properties/showFollowAction",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.followers.showFollowAction.helperText`,
              },
            },
          },
        ],
      },
    ],
  };
};
