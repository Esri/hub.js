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
                  labelKey: "{{i18nScope}}.fields.description.label",
                  scope: "/properties/description",
                  type: "Control",
                  options: {
                    control: "hub-field-input-input",
                    type: "textarea",
                    helperText: {
                      labelKey: "{{i18nScope}}.fields.description.helperText",
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
                  scope: "/properties/extent",
                  type: "Control",
                  options: {
                    control: "hub-field-input-boundary-picker",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.sections.statusAndTimeline.label",
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
              labelKey: "{{i18nScope}}.sections.status.label",
              elements: [
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
            {
              type: "Section",
              labelKey: "{{i18nScope}}.sections.timeline.label",
              elements: [
                {
                  scope: "/properties/view/properties/timeline",
                  type: "Control",
                  options: {
                    control: "arcgis-hub-timeline-editor",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
