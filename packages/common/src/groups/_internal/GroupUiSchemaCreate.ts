import {
  IConfigurationValues,
  IUiSchema,
  UiSchemaRuleEffects,
} from "../../core/schemas/types";
import { IArcGISContext } from "../../ArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { checkPermission } from "../../permissions";
import { getWellKnownGroup } from "../getWellKnownGroup";

/**
 * @private
 * constructs the complete uiSchema for creating a view
 * group. This defines how the schema properties should be
 * rendered in the view group creation experience
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
        labelKey: `${i18nScope}.fields.isSharedUpdate.label`,
        scope: "/properties/isSharedUpdate",
        type: "Control",
        options: {
          control: "hub-field-input-switch",
          helperText: {
            labelKey: `${i18nScope}.fields.isSharedUpdate.helperText`,
          },
        },
      },
      {
        labelKey: `${i18nScope}.fields.membershipAccess.label`,
        scope: "/properties/membershipAccess",
        type: "Control",
        options: {
          control: "hub-field-input-radio",
          labels: [
            `{{${i18nScope}.fields.membershipAccess.org:translate}}`,
            `{{${i18nScope}.fields.membershipAccess.collab:translate}}`,
            `{{${i18nScope}.fields.membershipAccess.any:translate}}`,
          ],
          rules: [
            undefined,
            [
              {
                effect: UiSchemaRuleEffects.DISABLE,
                conditions: [
                  !checkPermission(
                    "platform:portal:user:addExternalMembersToGroup",
                    context
                  ).access,
                ],
              },
            ],
            [
              {
                effect: UiSchemaRuleEffects.DISABLE,
                conditions: [
                  !checkPermission(
                    "platform:portal:user:addExternalMembersToGroup",
                    context
                  ).access,
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
          messages: [
            {
              type: "ERROR",
              keyword: "enum",
              icon: true,
              labelKey: `${i18nScope}.fields.membershipAccess.enumError`,
            },
          ],
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
            `{{${i18nScope}.fields.contributeContent.admins:translate}}`,
          ],
        },
      },
    ],
  };
};

/**
 * @private
 * constructs the default values for creating a view group.
 * This is used to pre-populate the form with specific default values
 * that are different from the normal Group Schema defaults.
 * @param i18nScope
 * @param options
 * @param context
 * @returns
 */
export const buildDefaults = async (
  i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IConfigurationValues> => {
  return {
    ...getWellKnownGroup("hubViewGroup", context),
    membershipAccess: "organization",
  };
};
