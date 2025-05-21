import { IUiSchema, UiSchemaRuleEffects } from "../../core";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Groups
 * This defines how the schema properties should be
 * rendered in the group settings experience
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
        labelKey: `${i18nScope}.sections.membershipAccess.label`,
        elements: [
          {
            // there are schema rules that use this so it must be present or they break, so we hide it when its value is false which is always the case for this uiSchema
            scope: "/properties/isSharedUpdate",
            type: "Control",
            rules: [
              {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/isSharedUpdate",
                  schema: { const: false },
                },
              },
              {
                effect: UiSchemaRuleEffects.DISABLE,
                conditions: [true],
              },
            ],
          },
          {
            labelKey: `${i18nScope}.fields.membershipAccess.label`,
            scope: "/properties/membershipAccess",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.membershipAccess.org.description:translate}}`,
                `{{${i18nScope}.fields.membershipAccess.collab.description:translate}}`,
                `{{${i18nScope}.fields.membershipAccess.any.description:translate}}`,
              ],
              // rules that pertain to the individual options
              rules: [
                [
                  {
                    effect: UiSchemaRuleEffects.NONE,
                  },
                ],
                [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      {
                        scope: "/properties/leavingDisallowed",
                        schema: { const: true },
                      },
                    ],
                  },
                ],
                [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      {
                        scope: "/properties/leavingDisallowed",
                        schema: { const: true },
                      },
                    ],
                  },
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      {
                        scope: "/properties/isSharedUpdate",
                        schema: { const: true },
                      },
                    ],
                  },
                ],
              ],
            },
            // rules that pertain to the control as a whole
            rules: [
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [
                  {
                    scope: "/properties/leavingDisallowed",
                    schema: { const: true },
                  },
                ],
              },
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [
                  {
                    scope: "/properties/isSharedUpdate",
                    schema: { const: true },
                  },
                  {
                    scope: "/properties/membershipAccess",
                    schema: { const: "anyone" },
                  },
                ],
              },
            ],
          },
          {
            labelKey: `${i18nScope}.fields.contributeContent.label`,
            scope: "/properties/isViewOnly",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{${i18nScope}.fields.contributeContent.members.description:translate}}`,
                `{{${i18nScope}.fields.contributeContent.admins.description:translate}}`,
              ],
            },
          },
        ],
      },
    ],
  };
};
