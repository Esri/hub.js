import { IHubGroup, IUiSchema, UiSchemaRuleEffects } from "../../core";
import type { IArcGISContext } from "../../types/IArcGISContext";

/**
 * @private
 * constructs the complete settings uiSchema for Hub Groups
 * This defines how the schema properties should be
 * rendered in the group settings experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubGroup>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  // We want to use isSharedUpdate and leavingDisallowed as rules conditions
  // referencing them from the schema properties requires them to be actual elements
  // in the uiSchema. Instead the entity is passed in as options and we can get them directly from the entity.
  const { isSharedUpdate, leavingDisallowed } = options;
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.membershipAccess.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.membershipAccess.label`,
            scope: "/properties/membershipAccess",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
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
                    conditions: [leavingDisallowed],
                  },
                ],
                [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [leavingDisallowed],
                  },
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [isSharedUpdate],
                  },
                ],
              ],
            },
            // rules that pertain to the control as a whole
            rules: [
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [leavingDisallowed],
              },
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [
                  isSharedUpdate,
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
              control: "hub-field-input-tile-select",
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
