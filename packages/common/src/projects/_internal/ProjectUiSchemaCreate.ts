import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../../permissions/checkPermission";
import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getSharableGroupsComboBoxItems } from "../../core/schemas/internal/getSharableGroupsComboBoxItems";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * constructs the minimal create uiSchema for Hub Projects.
 * This defines how the schema properties should be rendered
 * in the project creation experience
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
                          labelKey: `shared.fields.purpose.maxLengthError`,
                        },
                      ],
                    },
                  },
                  {
                    labelKey: `${i18nScope}.fields.status.label`,
                    scope: "/properties/status",
                    type: "Control",
                    options: {
                      control: "hub-field-input-select",
                      enum: {
                        i18nScope: `${i18nScope}.fields.status.enum`,
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
                        options.location,
                        context.hubRequestOptions
                      ),
                      options: await getLocationOptions(
                        options.id,
                        options.type,
                        options.location,
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
