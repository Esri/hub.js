import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import * as getCategoryItemsModule from "../../../src/core/schemas/internal/getCategoryItems";
import * as getFeaturedContentCatalogsModule from "../../../src/core/schemas/internal/getFeaturedContentCatalogs";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import * as getAuthedImageUrlModule from "../../../src/core/_internal/getAuthedImageUrl";

describe("buildUiSchema: initiative edit", () => {
  it("returns the full initiative edit uiSchema", async () => {
    spyOn(getCategoryItemsModule, "getCategoryItems").and.returnValue(
      Promise.resolve([
        {
          value: "/categories",
          label: "/categories",
        },
      ])
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
    spyOn(
      getFeaturedContentCatalogsModule,
      "getFeaturedContentCatalogs"
    ).and.returnValue({});
    spyOn(getAuthedImageUrlModule, "getAuthedImageUrl").and.returnValue(
      "https://some-image-url.com"
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
                    labelKey: `some.scope.fields.name.maxLengthError`,
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
                helperText: {
                  labelKey: "some.scope.fields.summary.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: `shared.fields.purpose.maxLengthError`,
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.description.label",
              scope: "/properties/description",
              type: "Control",
              options: {
                control: "hub-field-input-rich-text",
                type: "textarea",
                helperText: {
                  labelKey: "some.scope.fields.description.helperText",
                },
              },
            },
            {
              labelKey: `some.scope.fields.hero.label`,
              scope: "/properties/view/properties/hero",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                layout: "horizontal",
                helperText: {
                  labelKey: `some.scope.fields.hero.helperText`,
                },
                labels: [
                  `{{some.scope.fields.hero.map.label:translate}}`,
                  `{{some.scope.fields.hero.image.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.hero.map.description:translate}}`,
                  `{{some.scope.fields.hero.image.description:translate}}`,
                ],
                icons: ["map-pin", "image"],
              },
            },
            {
              labelKey: `some.scope.fields.featuredImage.label`,
              scope: "/properties/view/properties/featuredImage",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/view/properties/hero",
                  schema: { const: "map" },
                },
              },
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-image-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                sizeDescription: {
                  labelKey: `some.scope.fields.featuredImage.sizeDescription`,
                },
                helperText: {
                  labelKey: `some.scope.fields.featuredImage.helperText`,
                },
              },
            },
            {
              labelKey: `some.scope.fields.featuredImage.altText.label`,
              scope: "/properties/view/properties/featuredImageAltText",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/view/properties/hero",
                  schema: { const: "map" },
                },
              },
              options: {
                helperText: {
                  labelKey: `some.scope.fields.featuredImage.altText.helperText`,
                },
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
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.searchDiscoverability.label",
          elements: [
            {
              labelKey: "shared.fields.categories.label",
              scope: "/properties/categories",
              type: "Control",
              options: {
                control: "hub-field-input-combobox",
                items: [
                  {
                    value: "/categories",
                    label: "/categories",
                  },
                ],
                allowCustomValues: false,
                selectionMode: "ancestors",
                placeholderIcon: "select-category",
                helperText: {
                  labelKey: "some.scope.fields.categories.helperText",
                },
              },
            },
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
                helperText: { labelKey: "some.scope.fields.tags.helperText" },
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
          labelKey: "some.scope.sections.status.label",
          elements: [
            {
              scope: "/properties/status",
              type: "Control",
              labelKey: "some.scope.fields.status.label",
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: "some.scope.fields.status.enum",
                },
              },
            },
          ],
        },
        // Feature Content - hiding for MVP
        // {
        //   type: "Section",
        //   labelKey: "some.scope.sections.featuredContent.label",
        //   options: {
        //     helperText: {
        //       labelKey: "some.scope.sections.featuredContent.helperText",
        //     },
        //   },
        //   elements: [
        //     {
        //       scope: "/properties/view/properties/featuredContentIds",
        //       type: "Control",
        //       options: {
        //         control: "hub-field-input-gallery-picker",
        //         targetEntity: "item",
        //         catalogs: {},
        //         facets: [
        //           {
        //             label:
        //               "{{some.scope.fields.featuredContent.facets.type:translate}}",
        //             key: "type",
        //             display: "multi-select",
        //             field: "type",
        //             options: [],
        //             operation: "OR",
        //             aggLimit: 100,
        //           },
        //           {
        //             label:
        //               "{{some.scope.fields.featuredContent.facets.sharing:translate}}",
        //             key: "access",
        //             display: "multi-select",
        //             field: "access",
        //             options: [],
        //             operation: "OR",
        //           },
        //         ],
        //       },
        //     },
        //   ],
        // },
      ],
    });
  });
  it("returns the full initiative edit uiSchema with a defined view", async () => {
    spyOn(getCategoryItemsModule, "getCategoryItems").and.returnValue(
      Promise.resolve([
        {
          value: "/categories",
          label: "/categories",
        },
      ])
    );
    spyOn(
      getFeaturedContentCatalogsModule,
      "getFeaturedContentCatalogs"
    ).and.returnValue({});
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
                    labelKey: `some.scope.fields.name.maxLengthError`,
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
                helperText: {
                  labelKey: "some.scope.fields.summary.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: `shared.fields.purpose.maxLengthError`,
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.description.label",
              scope: "/properties/description",
              type: "Control",
              options: {
                control: "hub-field-input-rich-text",
                type: "textarea",
                helperText: {
                  labelKey: "some.scope.fields.description.helperText",
                },
              },
            },
            {
              labelKey: `some.scope.fields.hero.label`,
              scope: "/properties/view/properties/hero",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                layout: "horizontal",
                helperText: {
                  labelKey: `some.scope.fields.hero.helperText`,
                },
                labels: [
                  `{{some.scope.fields.hero.map.label:translate}}`,
                  `{{some.scope.fields.hero.image.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.hero.map.description:translate}}`,
                  `{{some.scope.fields.hero.image.description:translate}}`,
                ],
                icons: ["map-pin", "image"],
              },
            },
            {
              labelKey: `some.scope.fields.featuredImage.label`,
              scope: "/properties/view/properties/featuredImage",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/view/properties/hero",
                  schema: { const: "map" },
                },
              },
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-image-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                sizeDescription: {
                  labelKey: `some.scope.fields.featuredImage.sizeDescription`,
                },
                helperText: {
                  labelKey: `some.scope.fields.featuredImage.helperText`,
                },
              },
            },
            {
              labelKey: `some.scope.fields.featuredImage.altText.label`,
              scope: "/properties/view/properties/featuredImageAltText",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.HIDE,
                condition: {
                  scope: "/properties/view/properties/hero",
                  schema: { const: "map" },
                },
              },
              options: {
                helperText: {
                  labelKey: `some.scope.fields.featuredImage.altText.helperText`,
                },
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
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.searchDiscoverability.label",
          elements: [
            {
              labelKey: "shared.fields.categories.label",
              scope: "/properties/categories",
              type: "Control",
              options: {
                control: "hub-field-input-combobox",
                items: [
                  {
                    value: "/categories",
                    label: "/categories",
                  },
                ],
                allowCustomValues: false,
                selectionMode: "ancestors",
                placeholderIcon: "select-category",
                helperText: {
                  labelKey: "some.scope.fields.categories.helperText",
                },
              },
            },
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
                helperText: { labelKey: "some.scope.fields.tags.helperText" },
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
          labelKey: "some.scope.sections.status.label",
          elements: [
            {
              scope: "/properties/status",
              type: "Control",
              labelKey: "some.scope.fields.status.label",
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: "some.scope.fields.status.enum",
                },
              },
            },
          ],
        },
        // Feature Content - hiding for MVP
        // {
        //   type: "Section",
        //   labelKey: "some.scope.sections.featuredContent.label",
        //   options: {
        //     helperText: {
        //       labelKey: "some.scope.sections.featuredContent.helperText",
        //     },
        //   },
        //   elements: [
        //     {
        //       scope: "/properties/view/properties/featuredContentIds",
        //       type: "Control",
        //       options: {
        //         control: "hub-field-input-gallery-picker",
        //         targetEntity: "item",
        //         catalogs: {},
        //         facets: [
        //           {
        //             label:
        //               "{{some.scope.fields.featuredContent.facets.type:translate}}",
        //             key: "type",
        //             display: "multi-select",
        //             field: "type",
        //             options: [],
        //             operation: "OR",
        //             aggLimit: 100,
        //           },
        //           {
        //             label:
        //               "{{some.scope.fields.featuredContent.facets.sharing:translate}}",
        //             key: "access",
        //             display: "multi-select",
        //             field: "access",
        //             options: [],
        //             operation: "OR",
        //           },
        //         ],
        //       },
        //     },
        //   ],
        // },
      ],
    });
  });
});
