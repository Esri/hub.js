import { IHubGroup, UiSchemaRuleEffects } from "../../../src";
import {
  buildUiSchema,
  buildDefaults,
} from "../../../src/groups/_internal/GroupUiSchemaCreateView";
import {
  MOCK_CONTEXT,
  getMockContextWithPrivilenges,
} from "../../mocks/mock-auth";

describe("GroupUiSchemaCreateView", () => {
  describe("buildUiSchema: create view group", () => {
    it("returns the uiSchema to create a view group", async () => {
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
            options: { section: "stepper", scale: "l" },
            elements: [
              {
                type: "Section",
                labelKey: "some.scope.sections.details.label",
                options: {
                  section: "step",
                },
                elements: [
                  {
                    labelKey: "some.scope.fields.name.label",
                    scope: "/properties/name",
                    type: "Control",
                    options: {
                      messages: [
                        {
                          type: "ERROR",
                          keyword: "required",
                          icon: true,
                          labelKey: "some.scope.fields.name.requiredError",
                        },
                        {
                          type: "ERROR",
                          keyword: "maxLength",
                          icon: true,
                          labelKey: "some.scope.fields.name.maxLengthError",
                        },
                      ],
                    },
                  },
                  {
                    labelKey: "some.scope.fields.summary.label",
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
                          labelKey: "some.scope.fields.summary.maxLengthError",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                type: "Section",
                labelKey: "some.scope.sections.membershipAccess.label",
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
                    labelKey: "some.scope.fields.membershipAccess.label",
                    scope: "/properties/membershipAccess",
                    type: "Control",
                    options: {
                      control: "hub-field-input-radio",
                      labels: [
                        "{{some.scope.fields.membershipAccess.org:translate}}",
                        "{{some.scope.fields.membershipAccess.collab:translate}}",
                        "{{some.scope.fields.membershipAccess.any:translate}}",
                      ],
                      disabled: [false, true, true],
                    },
                  },
                  {
                    labelKey: "some.scope.fields.contributeContent.label",
                    scope: "/properties/isViewOnly",
                    type: "Control",
                    options: {
                      control: "hub-field-input-radio",
                      labels: [
                        "{{some.scope.fields.contributeContent.all:translate}}",
                        "{{some.scope.fields.contributeContent.admins:translate}}",
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  describe("buildDefaults", () => {
    it("returns the defaults to create a view group when platform:portal:user:addExternalMember is false", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        MOCK_CONTEXT
      );

      expect(defaults).toEqual({
        access: "org",
        autoJoin: false,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
        tags: ["Hub Group"],
        membershipAccess: "organization",
      });
    });

    it("returns the defaults to create a view group when platform:portal:user:addExternalMember is true", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
      );
      expect(defaults).toEqual({
        access: "org",
        autoJoin: false,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
        tags: ["Hub Group"],
        membershipAccess: "anyone",
      });
    });
  });
});
