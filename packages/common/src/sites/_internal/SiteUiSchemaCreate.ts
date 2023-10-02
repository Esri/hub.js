import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../../permissions/checkPermission";
import { IHubSite } from "../../core/types";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getSharableGroupsComboBoxItems } from "../../core/schemas/internal/getSharableGroupsComboBoxItems";

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
  entity: IHubSite,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        options: { section: "stepper", scale: "l" },
        elements: [
          {
            type: "Step",
            labelKey: `${i18nScope}.sections.details.label`,
            elements: [
              {
                type: "Section",
                labelKey: `${i18nScope}.sections.basicInfo.label`,
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
                      helperText: {
                        labelKey: `${i18nScope}.fields.summary.helperText`,
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "Step",
            labelKey: `${i18nScope}.sections.location.label`,
            rule: {
              effect: UiSchemaRuleEffects.DISABLE,
              condition: {
                scope: "/properties/name",
                schema: { const: "" },
              },
            },
            elements: [
              {
                type: "Section",
                labelKey: `${i18nScope}.sections.location.label`,
                options: {
                  helperText: {
                    labelKey: `${i18nScope}.sections.location.helperText`,
                  },
                },
                elements: [
                  {
                    scope: "/properties/location",
                    type: "Control",
                    options: {
                      control: "hub-field-input-location-picker",
                      extent: await getLocationExtent(
                        entity,
                        context.hubRequestOptions
                      ),
                      options: await getLocationOptions(
                        entity,
                        context.portal.name,
                        context.hubRequestOptions
                      ),
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "Step",
            labelKey: `${i18nScope}.sections.sharing.label`,
            rule: {
              effect: UiSchemaRuleEffects.DISABLE,
              condition: {
                scope: "/properties/name",
                schema: { const: "" },
              },
            },
            elements: [
              {
                scope: "/properties/access",
                type: "Control",
                options: {
                  control: "arcgis-hub-access-level-controls",
                  orgName: context.portal.name,
                  itemType: `{{${i18nScope}.fields.access.itemType:translate}}`,
                },
              },
              {
                labelKey: `${i18nScope}.fields.groups.label`,
                scope: "/properties/_groups",
                type: "Control",
                options: {
                  control: "hub-field-input-combobox",
                  items: getSharableGroupsComboBoxItems(
                    context.currentUser.groups
                  ),
                  disabled: !checkPermission(
                    "platform:portal:user:shareToGroup",
                    context
                  ),
                  allowCustomValues: false,
                  selectionMode: "multiple",
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
