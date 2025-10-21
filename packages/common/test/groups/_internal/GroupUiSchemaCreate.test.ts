import {
  buildUiSchema,
  buildDefaults,
} from "../../../src/groups/_internal/GroupUiSchemaCreate";
import {
  MOCK_CONTEXT,
  getMockContextWithPrivilenges,
} from "../../mocks/mock-auth";
import * as checkPermissionsModule from "../../../src/permissions/checkPermission";
import { IHubGroup } from "../../../src/core/types/IHubGroup";
import { UiSchemaRuleEffects } from "../../../src/core/enums/uiSchemaRuleEffects";

describe("GroupUiSchemaCreate", () => {
  describe("buildUiSchema: create group", () => {
    it("returns the uiSchema to create a group", async () => {
      const uiSchema = await buildUiSchema(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        MOCK_CONTEXT
      );
      expect(uiSchema).toEqual({
        type: "Layout",
        elements: [
          {
            type: "Section",
            labelKey: `some.scope.sections.basicInfo.label`,
            elements: [
              {
                labelKey: `some.scope.fields.name.label`,
                scope: "/properties/name",
                type: "Control",
                options: {
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `some.scope.fields.name.requiredError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "maxLength",
                      icon: true,
                      labelKey: `some.scope.fields.name.maxLengthError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "format",
                      icon: true,
                      labelKey: `some.scope.fields.name.entityTitleValidatorError`,
                    },
                  ],
                },
              },
              {
                labelKey: `some.scope.fields.access.label`,
                scope: "/properties/access",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  descriptions: [
                    `{{some.scope.fields.access.private.description:translate}}`,
                    `{{some.scope.fields.access.org.description:translate}}`,
                    `{{some.scope.fields.access.public.description:translate}}`,
                  ],
                  icons: ["users", "organization", "globe"],
                  labels: [
                    `{{some.scope.fields.access.private.label:translate}}`,
                    `{{some.scope.fields.access.org.label:translate}}`,
                    `{{some.scope.fields.access.public.label:translate}}`,
                  ],
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.NONE,
                    },
                    {
                      effect: UiSchemaRuleEffects.ENABLE,
                      conditions: [false],
                    },
                    {
                      effect: UiSchemaRuleEffects.ENABLE,
                      conditions: [false],
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `some.scope.sections.capabilities.label`,
            elements: [
              {
                labelKey: `some.scope.fields.isSharedUpdate.label`,
                scope: "/properties/isSharedUpdate",
                type: "Control",
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  helperText: {
                    labelKey: `some.scope.fields.isSharedUpdate.helperText`,
                  },
                  tooltip: {
                    labelKey: `some.scope.fields.isSharedUpdate.tooltip`,
                  },
                },
                rule: {
                  effect: UiSchemaRuleEffects.ENABLE,
                  conditions: [false],
                },
              },
              {
                labelKey: `some.scope.fields.isAdmin.label`,
                scope: "/properties/leavingDisallowed",
                type: "Control",
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  helperText: {
                    labelKey: `some.scope.fields.isAdmin.helperText`,
                  },
                  tooltip: {
                    labelKey: `some.scope.fields.isAdmin.tooltip`,
                  },
                },
                rules: [
                  {
                    effect: UiSchemaRuleEffects.ENABLE,
                    conditions: [false],
                  },
                ],
              },
              {
                labelKey: `some.scope.fields.isOpenData.label`,
                scope: "/properties/isOpenData",
                type: "Control",
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  helperText: {
                    labelKey: `some.scope.fields.isOpenData.helperText`,
                  },
                  tooltip: {
                    labelKey: `some.scope.fields.isOpenData.tooltip`,
                  },
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "const",
                      icon: true,
                      labelKey: `some.scope.fields.isOpenData.constError`,
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
                      false,
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
                    conditions: [false],
                  },
                ],
              },
            ],
          },
          {
            type: "Section",
            labelKey: `some.scope.sections.membershipAccess.label`,
            elements: [
              {
                labelKey: `some.scope.fields.membershipAccess.label`,
                scope: "/properties/membershipAccess",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  labels: [
                    `{{some.scope.fields.membershipAccess.org.label:translate}}`,
                    `{{some.scope.fields.membershipAccess.collab.label:translate}}`,
                    `{{some.scope.fields.membershipAccess.any.label:translate}}`,
                  ],
                  descriptions: [
                    `{{some.scope.fields.membershipAccess.org.description:translate}}`,
                    `{{some.scope.fields.membershipAccess.collab.description:translate}}`,
                    `{{some.scope.fields.membershipAccess.any.description:translate}}`,
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
                      labelKey: `some.scope.fields.membershipAccess.patternError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "const",
                      icon: true,
                      labelKey: `some.scope.fields.membershipAccess.constError`,
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
                labelKey: `some.scope.fields.join.label`,
                scope: "/properties/_join",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  labels: [
                    `{{some.scope.fields.join.invite.label:translate}}`,
                    `{{some.scope.fields.join.request.label:translate}}`,
                    `{{some.scope.fields.join.auto.label:translate}}`,
                  ],
                  descriptions: [
                    `{{some.scope.fields.join.invite.description:translate}}`,
                    `{{some.scope.fields.join.request.description:translate}}`,
                    `{{some.scope.fields.join.auto.description:translate}}`,
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
                      labelKey: `some.scope.fields.join.constError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "pattern",
                      icon: true,
                      labelKey: `some.scope.fields.join.patternError`,
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
                labelKey: `some.scope.fields.hiddenMembers.label`,
                scope: "/properties/hiddenMembers",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  labels: [
                    `{{some.scope.fields.hiddenMembers.members.label:translate}}`,
                    `{{some.scope.fields.hiddenMembers.admins.label:translate}}`,
                  ],
                  descriptions: [
                    `{{some.scope.fields.hiddenMembers.members.description:translate}}`,
                    `{{some.scope.fields.hiddenMembers.admins.description:translate}}`,
                  ],
                },
              },
              {
                labelKey: `some.scope.fields.contributeContent.label`,
                scope: "/properties/isViewOnly",
                type: "Control",
                options: {
                  control: "hub-field-input-tile-select",
                  labels: [
                    `{{some.scope.fields.contributeContent.members.label:translate}}`,
                    `{{some.scope.fields.contributeContent.admins.label:translate}}`,
                  ],
                  descriptions: [
                    `{{some.scope.fields.contributeContent.members.description:translate}}`,
                    `{{some.scope.fields.contributeContent.admins.description:translate}}`,
                  ],
                },
              },
            ],
          },
        ],
      });
    });
    it("renders the Open data capability tooltip when group access is not public", async () => {
      spyOn(checkPermissionsModule, "checkPermission").and.returnValue({
        access: true,
      });
      const uiSchema = await buildUiSchema(
        "some.scope",
        { access: "private" } as IHubGroup,
        MOCK_CONTEXT
      );
      const isOpenDataTooltip =
        uiSchema.elements[1].elements[2].options.tooltip.labelKey;
      expect(isOpenDataTooltip).toEqual(`some.scope.fields.isOpenData.tooltip`);
    });
    it("renders the Open data capability tooltip when user does not have the permission to do so", async () => {
      spyOn(checkPermissionsModule, "checkPermission").and.returnValue({
        access: false,
      });
      const uiSchema = await buildUiSchema(
        "some.scope",
        { access: "public" } as IHubGroup,
        MOCK_CONTEXT
      );
      const isOpenDataTooltip =
        uiSchema.elements[1].elements[2].options.tooltip.labelKey;
      expect(isOpenDataTooltip).toEqual(`some.scope.fields.isOpenData.tooltip`);
    });
  });

  describe("buildDefaults", () => {
    it("returns the defaults to create a group when platform:portal:user:addExternalMember is false", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        MOCK_CONTEXT
      );

      expect(defaults).toEqual({
        type: "Group",
        access: "private",
        autoJoin: false,
        isSharedUpdate: true,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
        leavingDisallowed: false,
        tags: ["Hub Group"],
        membershipAccess: "organization",
      });
    });

    it("returns the defaults to create a group when platform:portal:user:addExternalMember is true", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
      );
      expect(defaults).toEqual({
        type: "Group",
        access: "private",
        autoJoin: false,
        isSharedUpdate: true,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
        leavingDisallowed: false,
        tags: ["Hub Group"],
        membershipAccess: "organization",
      });
    });
  });
});
