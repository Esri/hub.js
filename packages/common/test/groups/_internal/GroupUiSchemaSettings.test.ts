import { UiSchemaRuleEffects } from "../../../src";
import { buildUiSchema } from "../../../src/groups/_internal/GroupUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: group settings", () => {
  it("returns the full group settings uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      { isSharedUpdate: true } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.membershipAccess.label",
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
                  "{{some.scope.fields.membershipAccess.any.description:translate}}",
                ],
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
              },
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
    });
  });
});
