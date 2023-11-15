import { buildUiSchema } from "../../../src/discussions/_internal/DiscussionUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getCategoryItemsModule from "../../../src/core/schemas/internal/getCategoryItems";
import * as getAuthedImageUrlModule from "../../../src/core/schemas/internal/getAuthedImageUrl";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";

describe("buildUiSchema: discussion edit", () => {
  it("returns the full discussion edit uiSchema", async () => {
    spyOn(getCategoryItemsModule, "getCategoryItems").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getAuthedImageUrlModule, "getAuthedImageUrl").and.returnValue(
      "https://some-image-url.com"
    );
    spyOn(getLocationExtentModule, "getLocationExtent").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getLocationOptionsModule, "getLocationOptions").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getTagItemsModule, "getTagItems").and.returnValue(
      Promise.resolve([])
    );

    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        thumbnail: "thumbnail/custom.png",
        thumbnailUrl: "https://some-thumbnail-url.com",
      } as any,
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
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: "shared.fields.title.maxLengthError",
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.prompt.label",
              scope: "/properties/prompt",
              type: "Control",
              options: {
                helperText: {
                  labelKey: "some.scope.fields.prompt.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "required",
                    icon: true,
                    labelKey: "some.scope.fields.prompt.requiredError",
                  },
                ],
              },
            },
            {
              labelKey: "shared.fields._thumbnail.label",
              scope: "/properties/_thumbnail",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-thumbnail-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                helperText: {
                  labelKey: "some.scope.fields._thumbnail.helperText",
                },
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
                },
                messages: [],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.location.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.location.helperText",
            },
          },
          elements: [
            {
              scope: "/properties/location",
              type: "Control",
              options: {
                control: "hub-field-input-location-picker",
                extent: [],
                options: [],
                mapTools: ["polygon", "rectangle"],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.searchDiscoverability.label",
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
            {
              labelKey: "some.scope.fields.categories.label",
              scope: "/properties/categories",
              type: "Control",
              options: {
                control: "hub-field-input-combobox",
                items: [],
                allowCustomValues: false,
                selectionMode: "multiple",
                placeholderIcon: "select-category",
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
                helperText: {
                  labelKey: "some.scope.fields.summary.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: "shared.fields.purpose.maxLengthError",
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.description.label",
              scope: "/properties/description",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                helperText: {
                  labelKey: "some.scope.fields.description.helperText",
                },
              },
            },
          ],
        },
      ],
    });
  });
  it("returns the full discussion edit uiSchema when entity does have a view", async () => {
    spyOn(getCategoryItemsModule, "getCategoryItems").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getAuthedImageUrlModule, "getAuthedImageUrl").and.returnValue(
      "https://some-image-url.com"
    );
    spyOn(getLocationExtentModule, "getLocationExtent").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getLocationOptionsModule, "getLocationOptions").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getTagItemsModule, "getTagItems").and.returnValue(
      Promise.resolve([])
    );

    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        thumbnail: "thumbnail/custom.png",
        thumbnailUrl: "https://some-thumbnail-url.com",
        view: {
          featuredImageUrl: "https://some-image-url.com",
        },
      } as any,
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
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: "shared.fields.title.maxLengthError",
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.prompt.label",
              scope: "/properties/prompt",
              type: "Control",
              options: {
                helperText: {
                  labelKey: "some.scope.fields.prompt.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "required",
                    icon: true,
                    labelKey: "some.scope.fields.prompt.requiredError",
                  },
                ],
              },
            },
            {
              labelKey: "shared.fields._thumbnail.label",
              scope: "/properties/_thumbnail",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-thumbnail-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                helperText: {
                  labelKey: "some.scope.fields._thumbnail.helperText",
                },
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
                },
                messages: [],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.location.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.location.helperText",
            },
          },
          elements: [
            {
              scope: "/properties/location",
              type: "Control",
              options: {
                control: "hub-field-input-location-picker",
                extent: [],
                options: [],
                mapTools: ["polygon", "rectangle"],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.searchDiscoverability.label",
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
            {
              labelKey: "some.scope.fields.categories.label",
              scope: "/properties/categories",
              type: "Control",
              options: {
                control: "hub-field-input-combobox",
                items: [],
                allowCustomValues: false,
                selectionMode: "multiple",
                placeholderIcon: "select-category",
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
                helperText: {
                  labelKey: "some.scope.fields.summary.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: "shared.fields.purpose.maxLengthError",
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.description.label",
              scope: "/properties/description",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                helperText: {
                  labelKey: "some.scope.fields.description.helperText",
                },
              },
            },
          ],
        },
      ],
    });
  });
});
