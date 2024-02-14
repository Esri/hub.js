import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";

/**
 * @private
 * constructs the complete uiSchema for creating an association
 * group. This defines how the schema properties should be
 * rendered in the association group creation experience
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
        options: { section: "stepper", scale: "l" },
        elements: [
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.details.label`,
            options: {
              section: "step",
            },
            elements: [
              {
                labelKey: `${i18nScope}.fields.name.label`,
                scope: "/properties/name",
                type: "Control",
                options: {
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `${i18nScope}.fields.name.requiredError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "maxLength",
                      icon: true,
                      labelKey: `${i18nScope}.fields.name.maxLengthError`,
                    },
                  ],
                },
              },
              {
                labelKey: `${i18nScope}.fields.summary.label`,
                scope: "/properties/summary",
                type: "Control",
                options: {
                  control: "hub-field-input-input",
                  type: "textarea",
                  rows: 4,
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "maxLength",
                      icon: true,
                      labelKey: `${i18nScope}.fields.summary.maxLengthError`,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.membershipAccess.label`,
            options: {
              section: "step",
            },
            rule: {
              effect: UiSchemaRuleEffects.DISABLE,
              condition: {
                scope: "/properties/name",
                schema: { const: "" },
              },
            },
            elements: [
              {
                labelKey: `${i18nScope}.fields.membershipAccess.label`,
                scope: "/properties/membershipAccess",
                type: "Control",
                options: {
                  control: "hub-field-input-radio",
                  labels: [
                    `{{${i18nScope}.fields.membershipAccess.org:translate}}`,
                    `{{${i18nScope}.fields.membershipAccess.collab:translate}}`,
                    `{{${i18nScope}.fields.membershipAccess.createAssociation.any:translate}}`,
                  ],
                  disabled: [false, false, options.isSharedUpdate],
                },
              },
              {
                labelKey: `${i18nScope}.fields.contributeContent.label`,
                scope: "/properties/isViewOnly",
                type: "Control",
                options: {
                  control: "hub-field-input-radio",
                  labels: [
                    `{{${i18nScope}.fields.contributeContent.all:translate}}`,
                    `{{${i18nScope}.fields.contributeContent.createAssociation.admins:translate}}`,
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
