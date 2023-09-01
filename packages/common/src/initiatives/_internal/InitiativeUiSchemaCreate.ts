import { IUiSchema, UiSchemaRuleEffects } from "../../core";

/**
 * @private
 * minimal create uiSchema for Hub Projects - this defines
 * how the schema properties should be rendered in the
 * project creation experience
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      options: { section: "stepper", scale: "l" },
      elements: [
        {
          type: "Step",
          labelKey: "{{i18nScope}}.sections.details.label",
          elements: [
            {
              type: "Section",
              labelKey: "{{i18nScope}}.sections.basicInfo.label",
              elements: [
                {
                  labelKey: "{{i18nScope}}.fields.name.label",
                  scope: "/properties/name",
                  type: "Control",
                  options: {
                    messages: [
                      {
                        type: "ERROR",
                        keyword: "required",
                        icon: true,
                        labelKey: "{{i18nScope}}.fields.name.requiredError",
                      },
                    ],
                  },
                },
                {
                  labelKey: "{{i18nScope}}.fields.summary.label",
                  scope: "/properties/summary",
                  type: "Control",
                  options: {
                    control: "hub-field-input-input",
                    type: "textarea",
                    helperText: {
                      labelKey: "{{i18nScope}}.fields.summary.helperText",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.sections.location.label",
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
              labelKey: "{{i18nScope}}.sections.location.label",
              options: {
                helperText: {
                  labelKey: "{{i18nScope}}.sections.location.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/location",
                  type: "Control",
                  options: {
                    control: "hub-field-input-location-picker",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.sections.sharing.label",
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
                itemType: "{{{{i18nScope}}.fields.access.itemType:translate}}",
              },
            },
            {
              labelKey: "{{i18nScope}}.fields.groups.label",
              scope: "/properties/_groups",
              type: "Control",
              options: {
                control: "hub-field-input-combobox",
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
