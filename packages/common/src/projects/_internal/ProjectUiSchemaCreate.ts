import { IUiSchema, UiSchemaRuleEffects } from "../../core";

/**
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
                {
                  labelKey: "{{i18nScope}}.fields.status.label",
                  scope: "/properties/status",
                  type: "Control",
                  options: {
                    control: "hub-field-input-select",
                    enum: {
                      i18nScope: "{{i18nScope}}.fields.status.enum",
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
              scope: "/properties/groups",
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
