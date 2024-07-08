import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../../permissions/checkPermission";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getSharableGroupsComboBoxItems } from "../../core/schemas/internal/getSharableGroupsComboBoxItems";
import { IHubSite } from "../../core/types";

/**
 * @private
 * constructs the minimal create uiSchema for Hub Sites.
 * This defines how the schema properties should be rendered
 * in the site creation experience
 *
 * TODO: this was copied from projects and is just a placeholder
 * for now - it isn't being used anywhere in the application
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubSite>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        labelKey: `${i18nScope}.fields.name.label`,
        scope: "/properties/name",
        type: "Control",
        options: {
          messages: [
            {
              type: "ERROR",
              keyword: "required",
              icon: true,
              labelKey: `${i18nScope}.fields.name.requiredError`,
            },
            {
              type: "ERROR",
              keyword: "maxLength",
              icon: true,
              labelKey: `${i18nScope}.fields.name.maxLengthError`,
            },
          ],
        },
      },
      {
        labelKey: `${i18nScope}.fields.summary.label`,
        scope: "/properties/summary",
        type: "Control",
        options: {
          control: "hub-field-input-input",
          type: "textarea",
          rows: 4,
          helperText: {
            labelKey: `${i18nScope}.fields.summary.helperText`,
          },
          messages: [
            {
              type: "ERROR",
              keyword: "maxLength",
              icon: true,
              labelKey: `shared.fields.summary.maxLengthError`,
            },
          ],
        },
      },
    ],
  };
};
