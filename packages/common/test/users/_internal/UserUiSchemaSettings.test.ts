import { IArcGISContext } from "../../../src/ArcGISContext";
import * as UserUiSchemaSettings from "../../../src/users/_internal/UserUiSchemaSettings";

describe("UserUiSchemaSettings:", () => {
  it("creates the uiSchema correctly", async () => {
    const chk = await UserUiSchemaSettings.buildUiSchema(
      "some.scope",
      {},
      {} as unknown as IArcGISContext
    );

    expect(chk).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.userSettings",
          elements: [
            {
              type: "Control",
              scope:
                "/properties/settings/properties/preview/properties/workspace",
              labelKey: "some.scope.fields.workspacePreview.label",
              options: {
                type: "Control",
                control: "hub-field-input-switch",
                layout: "inline-space-between",
                helperText: {
                  labelKey: "some.scope.fields.workspacePreview.helperText",
                },
              },
            },
          ],
        },
      ],
    });
  });
});
