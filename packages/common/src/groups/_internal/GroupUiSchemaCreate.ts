import { IConfigurationValues, IUiSchema } from "../../core/schemas/types";
import { UiSchemaRuleEffects } from "../../core/enums/uiSchemaRuleEffects";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { EntityEditorOptions } from "../../core/schemas/internal/EditorOptions";
import { checkPermission } from "../../permissions/checkPermission";
import { getWellKnownGroup } from "../getWellKnownGroup";
import { IHubGroup } from "../../core/types/IHubGroup";
import { getProp } from "../../objects/get-prop";

/**
 * @private
 * constructs the complete uiSchema for creating a view
 * group. This defines how the schema properties should be
 * rendered in the view group creation experience
 */
export const buildUiSchema = (
  i18nScope: string,
  options: Partial<IHubGroup>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return Promise.resolve({
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.basicInfo.label`,
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
                {
                  type: "ERROR",
                  keyword: "format",
                  icon: true,
                  labelKey: `${i18nScope}.fields.name.entityTitleValidatorError`,
                },
              ],
            },
          },
          {
            labelKey: `${i18nScope}.fields.access.label`,
            scope: "/properties/access",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              descriptions: [
                `{{${i18nScope}.fields.access.private.description:translate}}`,
                `{{${i18nScope}.fields.access.org.description:translate}}`,
                `{{${i18nScope}.fields.access.public.description:translate}}`,
              ],
              icons: ["users", "organization", "globe"],
              labels: [
                `{{${i18nScope}.fields.access.private.label:translate}}`,
                `{{${i18nScope}.fields.access.org.label:translate}}`,
                `{{${i18nScope}.fields.access.public.label:translate}}`,
              ],
              rules: [
                {
                  effect: UiSchemaRuleEffects.NONE,
                },
                {
                  effect: UiSchemaRuleEffects.ENABLE,
                  conditions: [
                    checkPermission(
                      "platform:portal:user:shareGroupToOrg",
                      context
                    ).access,
                  ],
                },
                {
                  effect: UiSchemaRuleEffects.ENABLE,
                  conditions: [
                    checkPermission(
                      "platform:portal:user:shareGroupToPublic",
                      context
                    ).access,
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.capabilities.label`,
        elements: [
          {
            labelKey: `${i18nScope}.fields.isSharedUpdate.label`,
            scope: "/properties/isSharedUpdate",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.isSharedUpdate.helperText`,
              },
              ...(!checkPermission(
                "platform:portal:admin:createUpdateCapableGroup",
                context
              ).access && {
                tooltip: {
                  labelKey: `${i18nScope}.fields.isSharedUpdate.tooltip`,
                },
              }),
            },
            rule: {
              effect: UiSchemaRuleEffects.ENABLE,
              conditions: [
                checkPermission(
                  "platform:portal:admin:createUpdateCapableGroup",
                  context
                ).access,
              ],
            },
          },
          {
            labelKey: `${i18nScope}.fields.isAdmin.label`,
            scope: "/properties/leavingDisallowed",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.isAdmin.helperText`,
              },
              ...(!checkPermission(
                "platform:portal:admin:createLeavingDisallowedGroup",
                context
              ).access && {
                tooltip: {
                  labelKey: `${i18nScope}.fields.isAdmin.tooltip`,
                },
              }),
            },
            rules: [
              {
                effect: UiSchemaRuleEffects.ENABLE,
                conditions: [
                  checkPermission(
                    "platform:portal:admin:createLeavingDisallowedGroup",
                    context
                  ).access,
                ],
              },
            ],
          },
          {
            labelKey: `${i18nScope}.fields.isOpenData.label`,
            scope: "/properties/isOpenData",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.isOpenData.helperText`,
              },
              ...((!checkPermission(
                "platform:opendata:user:designateGroup",
                context
              ).access ||
                options.access !== "public") && {
                tooltip: {
                  labelKey: `${i18nScope}.fields.isOpenData.tooltip`,
                },
              }),
              messages: [
                {
                  type: "ERROR",
                  keyword: "const",
                  icon: true,
                  labelKey: `${i18nScope}.fields.isOpenData.constError`,
                },
              ],
            },
            rules: [
              {
                effect: UiSchemaRuleEffects.ENABLE,
                conditions: [
                  {
                    scope: "/properties/access",
                    schema: { const: "public" },
                  },
                  checkPermission(
                    "platform:opendata:user:designateGroup",
                    context
                  ).access,
                ],
              },
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [
                  {
                    scope: "/properties/access",
                    schema: { not: { const: "public" } },
                  },
                ],
              },
              {
                effect: UiSchemaRuleEffects.SHOW,
                conditions: [
                  // should only exist if user's org has portal.portalProperties.opendata.enabled: true
                  !!getProp(
                    context,
                    "portal.portalProperties.openData.enabled"
                  ),
                ],
              },
            ],
          },
        ],
      },
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
                `{{${i18nScope}.fields.membershipAccess.org.label:translate}}`,
                `{{${i18nScope}.fields.membershipAccess.collab.label:translate}}`,
                `{{${i18nScope}.fields.membershipAccess.any.label:translate}}`,
              ],
              descriptions: [
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
              messages: [
                {
                  type: "ERROR",
                  keyword: "pattern",
                  icon: true,
                  labelKey: `${i18nScope}.fields.membershipAccess.patternError`,
                },
                {
                  type: "ERROR",
                  keyword: "const",
                  icon: true,
                  labelKey: `${i18nScope}.fields.membershipAccess.constError`,
                },
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
            labelKey: `${i18nScope}.fields.join.label`,
            scope: "/properties/_join",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              labels: [
                `{{${i18nScope}.fields.join.invite.label:translate}}`,
                `{{${i18nScope}.fields.join.request.label:translate}}`,
                `{{${i18nScope}.fields.join.auto.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.join.invite.description:translate}}`,
                `{{${i18nScope}.fields.join.request.description:translate}}`,
                `{{${i18nScope}.fields.join.auto.description:translate}}`,
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
                        scope: "/properties/access",
                        schema: { const: "private" },
                      },
                    ],
                  },
                ],
                [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      {
                        scope: "/properties/access",
                        schema: { const: "private" },
                      },
                    ],
                  },
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
              messages: [
                {
                  type: "ERROR",
                  keyword: "const",
                  icon: true,
                  labelKey: `${i18nScope}.fields.join.constError`,
                },
                {
                  type: "ERROR",
                  keyword: "pattern",
                  icon: true,
                  labelKey: `${i18nScope}.fields.join.patternError`,
                },
              ],
            },
            // rules that pertain to the control as a whole
            rules: [
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [
                  {
                    scope: "/properties/access",
                    schema: { const: "private" },
                  },
                ],
              },
              {
                effect: UiSchemaRuleEffects.RESET,
                conditions: [
                  {
                    scope: "/properties/leavingDisallowed",
                    schema: { const: true },
                  },
                  {
                    scope: "/properties/_join",
                    schema: { const: "auto" },
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
                    scope: "/properties/_join",
                    schema: { const: "auto" },
                  },
                ],
              },
            ],
          },
          {
            labelKey: `${i18nScope}.fields.hiddenMembers.label`,
            scope: "/properties/hiddenMembers",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              labels: [
                `{{${i18nScope}.fields.hiddenMembers.members.label:translate}}`,
                `{{${i18nScope}.fields.hiddenMembers.admins.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.hiddenMembers.members.description:translate}}`,
                `{{${i18nScope}.fields.hiddenMembers.admins.description:translate}}`,
              ],
            },
          },
          {
            labelKey: `${i18nScope}.fields.contributeContent.label`,
            scope: "/properties/isViewOnly",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              labels: [
                `{{${i18nScope}.fields.contributeContent.members.label:translate}}`,
                `{{${i18nScope}.fields.contributeContent.admins.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.contributeContent.members.description:translate}}`,
                `{{${i18nScope}.fields.contributeContent.admins.description:translate}}`,
              ],
            },
          },
        ],
      },
    ],
  });
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
export const buildDefaults = (
  _i18nScope: string,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IConfigurationValues> => {
  return Promise.resolve({
    ...getWellKnownGroup("hubGroup", context),
    ...options,
  });
};
