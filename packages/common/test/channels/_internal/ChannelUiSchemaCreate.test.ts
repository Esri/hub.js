import { buildUiSchema } from "../../../src/channels/_internal/ChannelUiSchemaCreate";
import { IChannel } from "../../../src/discussions/api/types";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { IUiSchema } from "../../../src/core/schemas/types";
import * as getWellKnownCatalogModule from "../../../src/search/wellKnownCatalog";
import { IHubCatalog } from "../../../src/search/types";
import { CANNOT_DISCUSS } from "../../../src/discussions/constants";
import { ChannelNonePermission } from "../../../src/channels/_internal/ChannelBusinessRules";

describe("ChannelUiSchemaCreate", () => {
  const i18nScope = "myScope";
  const options: Partial<IChannel> = {};
  const catalog: IHubCatalog = { schemaVersion: 0 };
  let getWellKnownCatalogSpy: jasmine.Spy;
  describe("buildUiSchema", () => {
    beforeEach(() => {
      getWellKnownCatalogSpy = spyOn(
        getWellKnownCatalogModule,
        "getWellKnownCatalog"
      ).and.returnValue(catalog);
    });
    afterEach(() => {
      getWellKnownCatalogSpy.calls.reset();
    });
    it("should build a schema for an authenticated user", async () => {
      const context = {
        currentUser: {
          orgId: "orgId123",
          username: "user123",
        },
      } as unknown as IArcGISContext;
      const expected: IUiSchema = {
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
                      label: `${i18nScope}.fields.blockWords.formatError`,
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
              {
                type: "Notice",
                options: {
                  notice: {
                    configuration: {
                      noticeType: "notice",
                      closable: false,
                      kind: "info",
                      scale: "m",
                    },
                    title: `{{${i18nScope}.sections.permissions.notice.title:translate}}`,
                    message: `{{${i18nScope}.sections.permissions.notice.message:translate}}`,
                    autoShow: true,
                    actions: [
                      {
                        label: `{{${i18nScope}.sections.permissions.notice.action:translate}}`,
                        href: "#readMore",
                        target: "_blank",
                      },
                    ],
                  },
                },
              },
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
                            `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                          ],
                        },
                        {
                          roleType: "admin",
                          description: `{{${i18nScope}.fields.organization.admin.description:translate}}`,
                          label: `{{${i18nScope}.fields.organization.admin.label:translate}}`,
                          disabled: true,
                          permissionLabels: [
                            `{{${i18nScope}.sections.permissions.options.manage:translate}}`,
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
                    options: {
                      control: "hub-field-permissions",
                      actions: [
                        {
                          label: `{{${i18nScope}.sections.group.picker.button:translate}}`,
                          type: "add",
                          options: {
                            label: `{{${i18nScope}.sections.group.picker.title:translate}}`,
                            entityType: "group",
                            catalogs: [catalog],
                            facets: [
                              {
                                labelKey: `${i18nScope}.fields.group.picker.facets.label`,
                                key: "groups",
                                display: "single-select",
                                operation: "OR",
                                options: [
                                  {
                                    labelKey: `${i18nScope}.fields.group.picker.facets.myGroups.label`,
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
                                    labelKey: `${i18nScope}.fields.group.picker.facets.myOrganization.label`,
                                    key: "my-organization",
                                    selected: false,
                                    predicates: [
                                      {
                                        orgid: context.currentUser.orgId,
                                        searchUserAccess: "groupMember",
                                        searchUserName:
                                          context.currentUser.username,
                                        typekeywords: { not: CANNOT_DISCUSS },
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
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
                            `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                          ],
                        },
                        {
                          roleType: "admin",
                          description: `{{${i18nScope}.fields.group.admin.description:translate}}`,
                          label: `{{${i18nScope}.fields.group.admin.label:translate}}`,
                          permissionLabels: [
                            `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                            `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                            `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                            `{{${i18nScope}.sections.permissions.options.manage:translate}}`,
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
      };
      const result = await buildUiSchema(i18nScope, options, context);
      expect(result).toEqual(expected);
      expect(getWellKnownCatalogSpy).toHaveBeenCalledTimes(1);
      expect(getWellKnownCatalogSpy).toHaveBeenCalledWith(
        i18nScope,
        "allGroups",
        "group",
        { user: context.currentUser }
      );
    });
    it("should build a schema for a community user", async () => {
      const context = {
        currentUser: {
          orgId: "orgId123",
          username: "user123",
        },
        communityOrgId: "communityId123",
      } as unknown as IArcGISContext;
      const expected: IUiSchema = {
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
                      label: `${i18nScope}.fields.blockWords.formatError`,
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
              {
                type: "Notice",
                options: {
                  notice: {
                    configuration: {
                      noticeType: "notice",
                      closable: false,
                      kind: "info",
                      scale: "m",
                    },
                    title: `{{${i18nScope}.sections.permissions.notice.title:translate}}`,
                    message: `{{${i18nScope}.sections.permissions.notice.message:translate}}`,
                    autoShow: true,
                    actions: [
                      {
                        label: `{{${i18nScope}.sections.permissions.notice.action:translate}}`,
                        href: "#readMore",
                        target: "_blank",
                      },
                    ],
                  },
                },
              },
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
                            `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                          ],
                        },
                        {
                          roleType: "admin",
                          description: `{{${i18nScope}.fields.organization.admin.description:translate}}`,
                          label: `{{${i18nScope}.fields.organization.admin.label:translate}}`,
                          disabled: true,
                          permissionLabels: [
                            `{{${i18nScope}.sections.permissions.options.manage:translate}}`,
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
                    options: {
                      control: "hub-field-permissions",
                      actions: [
                        {
                          label: `{{${i18nScope}.sections.group.picker.button:translate}}`,
                          type: "add",
                          options: {
                            label: `{{${i18nScope}.sections.group.picker.title:translate}}`,
                            entityType: "group",
                            catalogs: [catalog],
                            facets: [
                              {
                                labelKey: `${i18nScope}.fields.group.picker.facets.label`,
                                key: "groups",
                                display: "single-select",
                                operation: "OR",
                                options: [
                                  {
                                    labelKey: `${i18nScope}.fields.group.picker.facets.myGroups.label`,
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
                                    labelKey: `${i18nScope}.fields.group.picker.facets.myOrganization.label`,
                                    key: "my-organization",
                                    selected: false,
                                    predicates: [
                                      {
                                        orgid: context.currentUser.orgId,
                                        searchUserAccess: "groupMember",
                                        searchUserName:
                                          context.currentUser.username,
                                        typekeywords: { not: CANNOT_DISCUSS },
                                      },
                                    ],
                                  },
                                  {
                                    labelKey: `${i18nScope}.fields.group.picker.facets.myCommunity.label`,
                                    key: "my-community",
                                    selected: false,
                                    predicates: [
                                      {
                                        orgid: context.communityOrgId,
                                        searchUserAccess: "groupMember",
                                        searchUserName:
                                          context.currentUser.username,
                                        typekeywords: { not: CANNOT_DISCUSS },
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
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
                            `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                          ],
                        },
                        {
                          roleType: "admin",
                          description: `{{${i18nScope}.fields.group.admin.description:translate}}`,
                          label: `{{${i18nScope}.fields.group.admin.label:translate}}`,
                          permissionLabels: [
                            `{{${i18nScope}.sections.permissions.options.noAccess:translate}}`,
                            `{{${i18nScope}.sections.permissions.options.view:translate}}`,
                            `{{${i18nScope}.sections.permissions.options.participate:translate}}`,
                            `{{${i18nScope}.sections.permissions.options.manage:translate}}`,
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
      };
      const result = await buildUiSchema(i18nScope, options, context);
      expect(result).toEqual(expected);
      expect(getWellKnownCatalogSpy).toHaveBeenCalledTimes(1);
      expect(getWellKnownCatalogSpy).toHaveBeenCalledWith(
        i18nScope,
        "allGroups",
        "group",
        { user: context.currentUser }
      );
    });
  });
});
