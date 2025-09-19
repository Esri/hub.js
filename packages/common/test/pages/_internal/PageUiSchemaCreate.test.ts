import { buildUiSchema } from "../../../src/pages/_internal/PageUiSchemaCreate";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: site create", () => {
  it("returns the full site create uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.page.scope",
      {} as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          labelKey: "some.page.scope.fields.name.label",
          scope: "/properties/name",
          type: "Control",
          options: {
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: "some.page.scope.fields.name.requiredError",
              },
              {
                type: "ERROR",
                keyword: "maxLength",
                icon: true,
                labelKey: "some.page.scope.fields.name.maxLengthError",
              },
              {
                type: "ERROR",
                keyword: "format",
                icon: true,
                labelKey: `some.page.scope.fields.name.entityTitleValidatorError`,
              },
            ],
          },
        },
        {
          label: "{{page.fields._layoutSetup.type.layout:translate}}",
          scope: "/properties/_layoutSetup/properties/layout",
          type: "Control",
          options: {
            control: "hub-field-input-tile-select",
            labels: [
              "{{page.fields._layoutSetup.type.blank.label:translate}}",
              "{{page.fields._layoutSetup.type.simple.label:translate}}",
            ],
            descriptions: [
              "{{page.fields._layoutSetup.type.blank.description:translate}}",
              "{{page.fields._layoutSetup.type.simple.description:translate}}",
            ],
            icons: ["rectangle", "group-layout-elements"],
            layout: "horizontal",
          },
        },
      ],
    });
  });
});
