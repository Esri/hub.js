import { IConfigurationSchema, IUiSchema, UiSchemaRuleEffects } from "./types";
import { PROJECT_STATUSES } from "../types";

export const HubProjectSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 250,
    },
    summary: {
      type: "string",
      // TODO: Remove reliance on subtype as it's not valid json schema
      // Issue https://devtopia.esri.com/dc/hub/issues/3725
      subtype: "long-text",
    },
    description: {
      type: "string",
      // TODO: Remove reliance on subtype as it's not valid json schema
      // Issue https://devtopia.esri.com/dc/hub/issues/3725
      subtype: "long-text",
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
    extent: {
      type: "object",
      // TODO: Remove reliance on subtype as it's not valid json schema
      // Issue https://devtopia.esri.com/dc/hub/issues/3725
      subtype: "boundary",
    },
    timeline: {
      type: "object",
    },
  },
} as unknown as IConfigurationSchema;

/**
 * Minimal UI Schema for Hub Project
 */
export const HubProjectCreateUiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      options: { section: "stepper", scale: "s" },
      elements: [
        {
          type: "Step",
          labelKey: "{{i18nScope}}.describeProject.label",
          elements: [
            {
              labelKey: "{{i18nScope}}.name.label",
              scope: "/properties/name",
              type: "Control",
            },
            {
              labelKey: "{{i18nScope}}.summary.label",
              scope: "/properties/summary",
              type: "Control",
              options: {
                helperText: {
                  labelKey: "{{i18nScope}}.summary.helperText",
                },
              },
            },
            {
              labelKey: "{{i18nScope}}.description.label",
              scope: "/properties/description",
              type: "Control",
              options: {
                helperText: {
                  labelKey: "{{i18nScope}}.description.helperText",
                },
              },
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.setLocation.label",
          rule: {
            effect: UiSchemaRuleEffects.DISABLE,
            condition: {
              scope: "/properties/name",
              schema: { const: "" },
            },
          },
          elements: [
            {
              scope: "/properties/extent",
              type: "Control",
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.statusAndTimeline.label",
          rule: {
            effect: UiSchemaRuleEffects.DISABLE,
            condition: {
              scope: "/properties/name",
              schema: { const: "" },
            },
          },
          elements: [
            {
              labelKey: "{{i18nScope}}.status.label",
              scope: "/properties/status",
              type: "Control",
              options: {
                enum: {
                  i18nScope: "{{i18nScope}}.status.enum",
                },
              },
            },
            {
              labelKey: "{{i18nScope}}.timeline.label",
              scope: "/properties/timeline",
              type: "Control",
              options: {
                control: "arcgis-hub-timeline-editor",
                changeEvent: "arcgisHubTimelineEditorChange",
              },
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Complete UI Schema for Hub Project
 */
export const HubProjectEditUiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.basicInfo.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.name.label",
          scope: "/properties/name",
          type: "Control",
        },
        {
          labelKey: "{{i18nScope}}.summary.label",
          scope: "/properties/summary",
          type: "Control",
          options: {
            helperText: {
              labelKey: "{{i18nScope}}.summary.helperText",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.description.label",
          scope: "/properties/description",
          type: "Control",
          options: {
            helperText: {
              labelKey: "{{i18nScope}}.description.helperText",
            },
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.location.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.extent.label",
          scope: "/properties/extent",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.status.label",
      elements: [
        {
          scope: "/properties/status",
          type: "Control",
          options: {
            enum: {
              i18nScope: "{{i18nScope}}.status.enum",
            },
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.timeline.label",
      elements: [
        {
          scope: "/properties/timeline",
          type: "Control",
          options: {
            control: "arcgis-hub-timeline-editor",
            changeEvent: "arcgisHubTimelineEditorChange",
          },
        },
      ],
    },
  ],
};
