import { buildUiSchema } from "../../../src/pages/_internal/PageUiSchemaCreate";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: site create", () => {
  it("returns the full site create uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
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
          label: "{{some.scope.fields._layoutSetup.type.layout:translate}}",
          scope: "/properties/_layoutSetup/properties/layout",
          type: "Control",
          options: {
            control: "hub-field-input-tile-select",
            labels: [
              "{{some.scope.fields._layoutSetup.type.blank.label:translate}}",
              "{{some.scope.fields._layoutSetup.type.simple.label:translate}}",
            ],
            descriptions: [
              "{{some.scope.fields._layoutSetup.type.blank.description:translate}}",
              "{{some.scope.fields._layoutSetup.type.simple.description:translate}}",
            ],
            icons: ["rectangle", "group-layout-elements"],
            layout: "horizontal",
          },
        },
      ],
    });
  });
});
