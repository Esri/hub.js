import { buildUiSchema } from "../../../src/groups/_internal/GroupUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: group edit", () => {
  it("returns the full group edit uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      { thumbnailUrl: "https://some-thumbnail-url.com" } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.basicInfo.label",
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
              },
            },
            {
              labelKey: "some.scope.fields._thumbnail.label",
              scope: "/properties/_thumbnail",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-thumbnail-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1,
                helperText: {
                  labelKey: "some.scope.fields._thumbnail.helperText",
                },
                sizeDescription: {
                  labelKey: "some.scope.fields._thumbnail.sizeDescription",
                },
              },
            },
          ],
        },
      ],
    });
  });
});
