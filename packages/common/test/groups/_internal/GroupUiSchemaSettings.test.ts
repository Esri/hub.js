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
                  "{{some.scope.fields.contributeContent.admins:translate}}",
                ],
              },
            },
          ],
        },
      ],
    });
  });
});
