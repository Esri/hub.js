import { IUiSchema } from "../../core";

/**
 * @private
 * settings uiSchema for Hub Discussions - this
 * defines how the schema properties should be
 * rendered in the Discussions settings experience
 */
export const uiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.settings.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.fields.discussable.label",
          scope: "/properties/isDiscussable",
          type: "Control",
          options: {
            control: "hub-field-input-radio",
            labels: [
              "{{{{i18nScope}}.fields.discussable.enabled.label:translate}}",
              "{{{{i18nScope}}.fields.discussable.disabled.label:translate}}",
            ],
            descriptions: [
              "{{{{i18nScope}}.fields.discussable.enabled.description:translate}}",
              "{{{{i18nScope}}.fields.discussable.disabled.description:translate}}",
            ],
            icons: ["speech-bubbles", "circle-disallowed"],
          },
        },
      ],
    },
  ],
};
