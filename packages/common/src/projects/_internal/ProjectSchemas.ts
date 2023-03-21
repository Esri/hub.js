import {
  PROJECT_STATUSES,
  IConfigurationSchema,
  IUiSchema,
  UiSchemaRuleEffects,
} from "../../core";
import {
  ENTITY_EXTENT_SCHEMA,
  ENTITY_NAME_SCHEMA,
} from "../../core/schemas/shared";

export type ProjectEditorType = (typeof ProjectEditorTypes)[number];
export const ProjectEditorTypes = [
  "hub:project:create",
  "hub:project:edit",
] as const;

/**
 * defines the JSON schema for a Hub Project's editable fields
 */
export const ProjectSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      type: "string",
    },
    description: {
      type: "string",
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
    extent: ENTITY_EXTENT_SCHEMA,
    view: {
      type: "object",
      properties: {
        featuredContentIds: {
          type: "array",
          maxItems: 4,
          items: {
            type: "string",
          },
        },
        featuredImage: {
          type: "object",
        },
        showMap: {
          type: "boolean",
        },
        // TODO: extend this schema definition to provide
        // appropriate validation for the timeline editor
        timeline: {
          type: "object",
        },
      },
    },
  },
} as unknown as IConfigurationSchema;

/**
 * minimal create UI Schema for Hub Projects
 */
export const ProjectCreateUiSchema: IUiSchema = {
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

/**
 * complete edit UI Schema for Hub Projects
 */
export const ProjectEditUiSchema: IUiSchema = {
  type: "Layout",
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
        {
          labelKey: "{{i18nScope}}.fields.featuredImage.label",
          scope: "/properties/view/properties/featuredImage",
          type: "Control",
          options: {
            control: "hub-field-input-image-picker",
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            helperText: {
              labelKey: "{{i18nScope}}.fields.featuredImage.helperText",
            },
            sizeDescription: {
              labelKey: "{{i18nScope}}.fields.featuredImage.sizeDescription",
            },
          },
        },
      ],
    },
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
        {
          labelKey: "{{i18nScope}}.fields.showMap.label",
          scope: "/properties/view/properties/showMap",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.status.label",
      elements: [
        {
          scope: "/properties/status",
          type: "Control",
          labelKey: "{{i18nScope}}.fields.status.label",
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
    {
      type: "Section",
      labelKey: "{{i18nScope}}.sections.featuredContent.label",
      options: {
        helperText: {
          labelKey: "{{i18nScope}}.sections.featuredContent.helperText",
        },
      },
      elements: [
        {
          scope: "/properties/view/properties/featuredContentIds",
          type: "Control",
          options: {
            control: "hub-field-input-gallery-picker",
            targetEntity: "item",
          },
        },
      ],
    },
  ],
};
