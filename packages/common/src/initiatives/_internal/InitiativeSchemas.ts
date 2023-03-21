import { IConfigurationSchema, IUiSchema } from "../../core";
import { ENTITY_NAME_SCHEMA } from "../../core/schemas/shared";

export type InitiativeEditorType = (typeof InitiativeEditorTypes)[number];
export const InitiativeEditorTypes = ["hub:initiative:edit"] as const;

/**
 * defines the JSON schema for a Hub Initiative's editable fields
 */
export const InitiativeSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: ENTITY_NAME_SCHEMA,
    summary: {
      type: "string",
    },
  },
} as unknown as IConfigurationSchema;

/**
 * complete edit UI Schema for Hub Initiatives
 */
export const InitiativeEditUiSchema: IUiSchema = {
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
      ],
    },
  ],
};
