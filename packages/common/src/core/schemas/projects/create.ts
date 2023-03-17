import { IUiSchema, UiSchemaControls } from "../types";
import { DISABLE_IF_EMPTY } from "../shared";

const createUiSchema: IUiSchema = {
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
                    control: UiSchemaControls.input,
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
                    control: UiSchemaControls.input,
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
          rule: DISABLE_IF_EMPTY("/properties/name"),
          elements: [
            {
              type: "Section",
              labelKey: "{{i18nScope}}.sections.location.label",
              elements: [
                {
                  scope: "/properties/extent",
                  type: "Control",
                  options: {
                    control: UiSchemaControls.boundaryPicker,
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.sections.statusAndTimeline.label",
          rule: DISABLE_IF_EMPTY("/properties/name"),
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
                    control: UiSchemaControls.select,
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
                    control: UiSchemaControls.timeline,
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

export default createUiSchema;
