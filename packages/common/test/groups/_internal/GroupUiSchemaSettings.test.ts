import { UiSchemaRuleEffects } from "../../../src";
import { buildUiSchema } from "../../../src/groups/_internal/GroupUiSchemaSettings";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: group settings", () => {
  it("returns the full group settings uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      { isSharedUpdate: true, leavingDisallowed: false } as any,
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
              labelKey: "some.scope.fields.membershipAccess.label",
              scope: "/properties/membershipAccess",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
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
                      conditions: [false],
                    },
                  ],
                  [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [true],
                    },
                  ],
                ],
              },
              rules: [
                {
                  effect: UiSchemaRuleEffects.RESET,
                  conditions: [false],
                },
                {
                  effect: UiSchemaRuleEffects.RESET,
                  conditions: [
                    true,
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
                control: "hub-field-input-tile-select",
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
