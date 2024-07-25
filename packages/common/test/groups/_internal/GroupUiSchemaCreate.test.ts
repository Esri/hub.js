import { IHubGroup, UiSchemaRuleEffects } from "../../../src";
import {
  buildUiSchema,
  buildDefaults,
} from "../../../src/groups/_internal/GroupUiSchemaCreate";
import {
  MOCK_CONTEXT,
  getMockContextWithPrivilenges,
} from "../../mocks/mock-auth";

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
              ],
            },
          },
          {
            labelKey: `some.scope.fields.isSharedUpdate.label`,
            scope: "/properties/isSharedUpdate",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              helperText: {
                labelKey: `some.scope.fields.isSharedUpdate.helperText`,
              },
            },
          },
          {
            labelKey: `some.scope.fields.membershipAccess.label`,
            scope: "/properties/membershipAccess",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{some.scope.fields.membershipAccess.org:translate}}`,
                `{{some.scope.fields.membershipAccess.collab:translate}}`,
                `{{some.scope.fields.membershipAccess.any:translate}}`,
              ],
              rules: [
                undefined,
                [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [true],
                  },
                ],
                [
                  {
                    effect: UiSchemaRuleEffects.DISABLE,
                    conditions: [true],
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
                  labelKey: `some.scope.fields.membershipAccess.enumError`,
                },
              ],
            },
          },
          {
            labelKey: `some.scope.fields.contributeContent.label`,
            scope: "/properties/isViewOnly",
            type: "Control",
            options: {
              control: "hub-field-input-radio",
              labels: [
                `{{some.scope.fields.contributeContent.all:translate}}`,
                `{{some.scope.fields.contributeContent.admins:translate}}`,
              ],
            },
          },
        ],
      });
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
        access: "org",
        autoJoin: false,
        isSharedUpdate: false,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
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
        access: "org",
        autoJoin: false,
        isSharedUpdate: false,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
        tags: ["Hub Group"],
        membershipAccess: "organization",
      });
    });
  });
});
