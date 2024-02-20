import { IHubGroup, UiSchemaRuleEffects } from "../../../src";
import {
  buildUiSchema,
  buildDefaults,
} from "../../../src/groups/_internal/GroupUiSchemaCreateAssociation";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("GroupUiSchemaCreateAssociation", () => {
  describe("buildUiSchema: create association group", () => {
    it("returns the uiSchema to create a association group", async () => {
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
                        "{{some.scope.fields.membershipAccess.createAssociation.any:translate}}",
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
                        "{{some.scope.fields.contributeContent.all:translate}}",
                        "{{some.scope.fields.contributeContent.createAssociation.admins:translate}}",
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

  describe("buildDefaults: create association group", () => {
    it("returns the defaults to create a association group", async () => {
      const defaults = await buildDefaults(
        "some.scope",
        { name: "Groupname" } as IHubGroup,
        MOCK_CONTEXT
      );
      expect(defaults).toEqual({
        access: "public",
        isViewOnly: false,
        autoJoin: false,
        isInvitationOnly: false,
      });
    });
  });
});
