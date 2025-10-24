import {
  describe,
  it,
  expect,
} from "vitest";
import { UiSchemaRuleEffects } from "../../../src/core/enums/uiSchemaRuleEffects";
import { IHubGroup } from "../../../src/core/types/IHubGroup";
import {
  buildUiSchema,
  buildDefaults,
} from "../../../src/groups/_internal/GroupUiSchemaCreateFollowers";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("GroupUiSchemaCreateFollowers", () => {
  describe("buildUiSchema: create followers group", () => {
    it("returns the uiSchema to create a followers group", async () => {
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
                    scope: "/properties/isSharedUpdate",
                    type: "Control",
                    rule: {
                      effect: UiSchemaRuleEffects.HIDE,
                      condition: {
                        scope: "/properties/isSharedUpdate",
                        schema: { const: false },
                      },
                    },
                  },
                  {
                    labelKey: "some.scope.fields.membershipAccess.label",
                    scope: "/properties/membershipAccess",
                    type: "Control",
                    options: {
                      control: "hub-field-input-radio",
                      labels: [
                        "{{some.scope.fields.membershipAccess.org.description:translate}}",
                        "{{some.scope.fields.membershipAccess.collab.description:translate}}",
                        "{{some.scope.fields.membershipAccess.createFollowers.any:translate}}",
                      ],
                      disabled: [false, false, true],
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
                        "{{some.scope.fields.contributeContent.createFollowers.admins:translate}}",
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
  describe("buildDefaults: create followers group", () => {
    it("returns the default values for a followers group", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { name: "Groupname" } as IHubGroup,
        MOCK_CONTEXT
      );
      expect(defaults).toEqual({
        type: "Group",
        access: "public",
        autoJoin: true,
        isInvitationOnly: false,
        isViewOnly: true,
        leavingDisallowed: false,
      });
    });
  });
});
