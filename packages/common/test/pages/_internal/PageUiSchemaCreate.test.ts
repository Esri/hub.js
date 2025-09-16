import { buildUiSchema } from "../../../src/pages/_internal/PageUiSchemaCreate";

describe("buildUiSchema: site create", () => {
  it("returns the full site create uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any);
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
          label: "{{shared.fields._layoutSetup.type.pageLayout:translate}}",
          scope: "/properties/_layoutSetup/properties/layout",
          type: "Control",
          options: {
            control: "hub-field-input-tile-select",
            labels: [
              "{{shared.fields._layoutSetup.type.blank.label:translate}}",
              "{{shared.fields._layoutSetup.type.simple.label:translate}}",
            ],
            descriptions: [
              "{{shared.fields._layoutSetup.type.blank.description:translate}}",
              "{{shared.fields._layoutSetup.type.simple.description:translate}}",
            ],
            icons: ["rectangle", "group-layout-elements"],
            layout: "horizontal",
          },
        },
      ],
    });
  });
});
