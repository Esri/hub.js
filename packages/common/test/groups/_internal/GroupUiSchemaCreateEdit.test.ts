import { IHubGroup, UiSchemaRuleEffects } from "../../../src";
import {
  buildUiSchema,
  buildDefaults,
} from "../../../src/groups/_internal/GroupUiSchemaCreateEdit";
import {
  MOCK_CONTEXT,
  getMockContextWithPrivilenges,
} from "../../mocks/mock-auth";

describe("GroupUiSchemaCreateEdit", () => {
  describe("buildUiSchema: create edit group", () => {
    it("returns the uiSchema to create a edit group", async () => {
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
                        "{{some.scope.fields.membershipAccess.org.description:translate}}",
                        "{{some.scope.fields.membershipAccess.collab.description:translate}}",
                        "{{some.scope.fields.membershipAccess.any.description:translate}}",
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
                        "{{some.scope.fields.contributeContent.members.description:translate}}",
                        "{{some.scope.fields.contributeContent.admins.description:translate}}",
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
    it("builds defaults for create edit group when permission is false", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        MOCK_CONTEXT
      );
      expect(defaults).toEqual({
        access: "org",
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
    it("builds defaults for create edit group when permission is true", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { isSharedUpdate: true } as IHubGroup,
        getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
      );
      expect(defaults).toEqual({
        access: "org",
        autoJoin: false,
        isSharedUpdate: true,
        isInvitationOnly: false,
        hiddenMembers: false,
        isViewOnly: false,
        leavingDisallowed: false,
        tags: ["Hub Group"],
        membershipAccess: "collaborators",
      });
    });
  });
});
