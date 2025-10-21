import { IUiSchema, UiSchemaRuleEffects } from "../../core/schemas/types";
import { getWellKnownCatalog } from "../../search/wellKnownCatalog";
import { CANNOT_DISCUSS } from "../../discussions/constants";
import { ChannelNonePermission } from "./ChannelBusinessRules";
import { Role } from "../../discussions/api/enums/role";
import { deriveUserRoleV2 } from "../../discussions/api/utils/channels/derive-user-role-v2";
import { CHANNEL_ACTION_PRIVS } from "../../discussions/api/utils/channel-permission";
import { IHubChannel } from "../../core/types/IHubChannel";
import { IArcGISContext } from "../../types/IArcGISContext";

/**
 * @private
 * constructs the complete create uiSchema for Hub Channels.
 * This defines how the schema properties should be
 * rendered in the channel editing experience
 */
export const buildUiSchema = (
  i18nScope: string,
  options: Partial<IHubChannel>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const role = options.id
    ? deriveUserRoleV2(options.channel, context.currentUser)
    : Role.OWNER;
  const facet = {
    label: `{{${i18nScope}.sections.group.picker.facets.label:translate}}`,
    key: "groups",
    display: "single-select",
    operation: "OR",
    options: [
      {
        label: `{{${i18nScope}.sections.group.picker.facets.myGroups.label:translate}}`,
        key: "my-group",
        selected: true,
        predicates: [
          {
            owner: context.currentUser.username,
            typekeywords: { not: CANNOT_DISCUSS },
          },
        ],
      },
      {
        label: `{{${i18nScope}.sections.group.picker.facets.myOrganization.label:translate}}`,
        key: "my-organization",
        selected: false,
        predicates: [
          {
            orgid: context.currentUser.orgId,
            searchUserAccess: "groupMember",
            searchUserName: context.currentUser.username,
            typekeywords: { not: CANNOT_DISCUSS },
          },
        ],
      },
    ],
  };
  if (context.communityOrgId) {
    facet.options.push({
      label: `{{${i18nScope}.sections.group.picker.facets.myCommunity.label:translate}}`,
      key: "my-community",
      selected: false,
      predicates: [
        {
          orgid: context.communityOrgId,
          searchUserAccess: "groupMember",
          searchUserName: context.currentUser.username,
          typekeywords: { not: CANNOT_DISCUSS },
        },
      ],
    });
  }
  return Promise.resolve({
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.basicInfo.label`,
        options: {
          headerTag: "h3",
        },
        elements: [
          {
            labelKey: `${i18nScope}.fields.name.label`,
            type: "Control",
            scope: "/properties/name",
            rules: [
              {
                effect: UiSchemaRuleEffects.DISABLE,
                conditions: [
                  !CHANNEL_ACTION_PRIVS.UPDATE_CHANNEL_NAME.includes(role),
                ],
              },
            ],
            options: {
              control: "hub-field-input-input",
              messages: [
                {
                  type: "ERROR",
                  keyword: "required",
                  icon: true,
                  labelKey: `${i18nScope}.fields.name.channelNameRequiredError`,
                  allowShowBeforeInteract: true,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.settings.label`,
        options: {
          headerTag: "h3",
        },
        elements: [
          {
            type: "Control",
            scope: "/properties/allowAsAnonymous",
            labelKey: `${i18nScope}.fields.allowAsAnonymous.label`,
            rules: [
              {
                effect: UiSchemaRuleEffects.DISABLE,
                conditions: [
                  !CHANNEL_ACTION_PRIVS.UPDATE_POST_AS_ANONYMOUS.includes(role),
                ],
              },
            ],
            options: {
              control: "hub-field-input-switch",
              helperText: {
                labelKey: `${i18nScope}.fields.allowAsAnonymous.helperText`,
              },
            },
          },
          {
            type: "Control",
            scope: "/properties/blockWords",
            label: "Blocked words",
            labelKey: `${i18nScope}.fields.blockWords.label`,
            rules: [
              {
                effect: UiSchemaRuleEffects.DISABLE,
                conditions: [
                  !CHANNEL_ACTION_PRIVS.UPDATE_BLOCKED_WORDS.includes(role),
                ],
              },
            ],
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              helperText: {
                labelKey: `${i18nScope}.fields.blockWords.helperText`,
              },
              messages: [
                {
                  type: "ERROR",
                  keyword: "format",
                  icon: true,
                  labelKey: `${i18nScope}.fields.blockWords.formatError`,
                },
              ],
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.permissions.label`,
        options: {
          headerTag: "h3",
        },
        elements: [
          // {
          //   type: "Notice",
          //   options: {
          //     noticeId: "20250311-channel-permissions-info",
          //   },
          // },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.public.label`,
            options: {
              headerTag: "h4",
            },
            elements: [
              {
                type: "Control",
                scope: "/properties/publicConfigs",
                rules: [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      !CHANNEL_ACTION_PRIVS.UPDATE_ANONYMOUS_USERS.includes(
                        role
                      ),
                    ],
                  },
                ],
                options: {
                  control: "hub-field-permissions",
                  roles: [
                    {
                      roleType: "anonymous",
                      description: `{{${i18nScope}.fields.public.anonymous.description:translate}}`,
                      label: `{{${i18nScope}.fields.public.anonymous.label:translate}}`,
                      permissionLabels: [
                        `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                      ],
                    },
                    {
                      roleType: "authenticated",
                      description: `{{${i18nScope}.fields.public.authenticated.description:translate}}`,
                      label: `{{${i18nScope}.fields.public.authenticated.label:translate}}`,
                      permissionLabels: [
                        `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.post:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.organization.label`,
            options: {
              headerTag: "h4",
              variant: "variant-layout-editor",
            },
            elements: [
              {
                type: "Control",
                scope: "/properties/orgConfigs",
                rules: [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      !CHANNEL_ACTION_PRIVS.UPDATE_ORGS.includes(role),
                    ],
                  },
                ],
                options: {
                  control: "hub-field-permissions",
                  roles: [
                    {
                      roleType: "member",
                      description: `{{${i18nScope}.fields.organization.member.description:translate}}`,
                      label: `{{${i18nScope}.fields.organization.member.label:translate}}`,
                      permissionLabels: [
                        `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.post:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                      ],
                    },
                    {
                      roleType: "admin",
                      description: `{{${i18nScope}.fields.organization.admin.description:translate}}`,
                      label: `{{${i18nScope}.fields.organization.admin.label:translate}}`,
                      disabled: true,
                      permissionLabels: [
                        `{{${i18nScope}.sections.permissions.options.owner:translate}}`,
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `${i18nScope}.sections.group.label`,
            options: {
              headerTag: "h4",
              variant: "variant-layout-editor",
            },
            elements: [
              {
                type: "Control",
                scope: "/properties/groupConfigs",
                rules: [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [
                      !CHANNEL_ACTION_PRIVS.UPDATE_GROUPS.includes(role),
                    ],
                  },
                ],
                options: {
                  control: "hub-field-permissions",
                  actions: [
                    {
                      label: `{{${i18nScope}.sections.group.picker.button:translate}}`,
                      type: "add",
                      options: {
                        label: `{{${i18nScope}.sections.group.picker.title:translate}}`,
                        entityType: "group",
                        catalogs: [
                          getWellKnownCatalog(i18nScope, "allGroups", "group", {
                            user: context.currentUser,
                          }),
                        ],
                        facets: [facet],
                        defaultValues: {
                          member: ChannelNonePermission,
                          admin: ChannelNonePermission,
                        },
                      },
                    },
                    {
                      ariaLabel: `{{${i18nScope}.sections.group.remove.button:translate}}`,
                      buttonStyle: "outline",
                      buttonKind: "neutral",
                      type: "remove",
                      icon: "x",
                    },
                  ],
                  roles: [
                    {
                      roleType: "member",
                      description: `{{${i18nScope}.fields.group.member.description:translate}}`,
                      label: `{{${i18nScope}.fields.group.member.label:translate}}`,
                      permissionLabels: [
                        `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.post:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.moderate:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.manage:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.owner:translate}}`,
                      ],
                    },
                    {
                      roleType: "admin",
                      description: `{{${i18nScope}.fields.group.admin.description:translate}}`,
                      label: `{{${i18nScope}.fields.group.admin.label:translate}}`,
                      permissionLabels: [
                        `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.post:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.moderate:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.manage:translate}}`,
                        `{{${i18nScope}.sections.permissions.options.owner:translate}}`,
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  });
};
