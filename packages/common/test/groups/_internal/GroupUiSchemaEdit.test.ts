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
          options: {
            helperText: {
              labelKey: "some.scope.sections.basicInfo.helperText",
            },
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
                    labelKey:
                      "some.scope.fields.name.entityTitleValidatorError",
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
            {
              labelKey: "some.scope.fields._thumbnail.label",
              scope: "/properties/_thumbnail",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-thumbnail-url.com",
                defaultImgUrl:
                  "https://www.customUrl/apps/sites/ember-arcgis-opendata-components/assets/images/placeholders/group.png",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1,
                sizeDescription: {
                  labelKey: "some.scope.fields._thumbnail.sizeDescription",
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.description.label",
              options: {
                section: "block",
              },
              elements: [
                {
                  labelKey: "some.scope.fields.description.label",
                  scope: "/properties/description",
                  type: "Control",
                  options: {
                    control: "hub-field-input-rich-text",
                    type: "textarea",
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.discoverability.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.discoverability.helperText",
                },
              },
              elements: [
                {
                  labelKey: "some.scope.fields.tags.label",
                  scope: "/properties/tags",
                  type: "Control",
                  options: {
                    control: "hub-field-input-combobox",
                    items: [],
                    allowCustomValues: true,
                    selectionMode: "multiple",
                    placeholderIcon: "label",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    // expect(uiSchema).toEqual({
    //   type: "Layout",
    //   elements: [
    //     {
    //       type: "Section",
    //       labelKey: "some.scope.sections.basicInfo.label",
    //       options: {
    //         helperText: {
    //           labelKey: "some.scope.sections.basicInfo.helperText",
    //         },
    //       },
    //       elements: [
    //         {
    //           labelKey: "some.scope.fields.name.label",
    //           scope: "/properties/name",
    //           type: "Control",
    //           options: {
    //             messages: [
    //               {
    //                 type: "ERROR",
    //                 keyword: "required",
    //                 icon: true,
    //                 labelKey: "some.scope.fields.name.requiredError",
    //               },
    //               {
    //                 type: "ERROR",
    //                 keyword: "maxLength",
    //                 icon: true,
    //                 labelKey: `some.scope.fields.name.maxLengthError`,
    //               },
    //               {
    //                 type: "ERROR",
    //                 keyword: "format",
    //                 icon: true,
    //                 labelKey: `some.scope.fields.name.entityTitleValidatorError`,
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           labelKey: "some.scope.fields.summary.label",
    //           scope: "/properties/summary",
    //           type: "Control",
    //           options: {
    //             control: "hub-field-input-input",
    //             type: "textarea",
    //             rows: 4,
    //             messages: [
    //               {
    //                 type: "ERROR",
    //                 keyword: "maxLength",
    //                 icon: true,
    //                 labelKey: `some.scope.fields.summary.maxLengthError`,
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           labelKey: `some.scope.fields.description.label`,
    //           scope: "/properties/description",
    //           type: "Control",
    //           options: {
    //             control: "hub-field-input-rich-text",
    //             type: "textarea",
    //           },
    //         },
    //         {
    //           labelKey: "some.scope.fields._thumbnail.label",
    //           scope: "/properties/_thumbnail",
    //           type: "Control",
    //           options: {
    //             control: "hub-field-input-image-picker",
    //             imgSrc: "https://some-thumbnail-url.com",
    //             defaultImgUrl:
    //               "https://www.customUrl/apps/sites/ember-arcgis-opendata-components/assets/images/placeholders/group.png",
    //             maxWidth: 727,
    //             maxHeight: 484,
    //             aspectRatio: 1,
    //             sizeDescription: {
    //               labelKey: "some.scope.fields._thumbnail.sizeDescription",
    //             },
    //             notice: "20250425-image-picker-notice",
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });
  });
});
