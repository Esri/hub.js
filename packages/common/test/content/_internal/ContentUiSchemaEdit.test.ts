import { buildUiSchema } from "../../../src/content/_internal/ContentUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as fetchCategoryItemsModule from "../../../src/core/schemas/internal/fetchCategoryItems";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";

describe("buildUiSchema: content edit", () => {
  it("returns the full content edit uiSchema", async () => {
    spyOn(fetchCategoryItemsModule, "fetchCategoryItems").and.returnValue(
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
          labelKey: "some.scope.sections.basic.title",
          options: {
            helperText: {
              labelKey: "some.scope.sections.basic.helperText",
            },
          },
          elements: [
            {
              labelKey: "some.scope.fields.title.label",
              scope: "/properties/name",
              type: "Control",
              options: {
                helperText: {
                  labelKey: "some.scope.fields.title.hint",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "required",
                    icon: true,
                    labelKey: "some.scope.fields.title.requiredError",
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
              labelKey: "some.scope.fields.slug.label",
              scope: "/properties/_slug",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                messages: [
                  {
                    type: "ERROR",
                    keyword: "pattern",
                    icon: true,
                    labelKey: "some.scope.fields.slug.patternError",
                  },
                  {
                    type: "ERROR",
                    keyword: "isUniqueSlug",
                    icon: true,
                    labelKey: "some.scope.fields.slug.isUniqueError",
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
                    labelKey: "shared.fields.summary.maxLengthError",
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
                defaultImgUrl:
                  "https://www.customUrl/apps/sites/ember-arcgis-opendata-components/assets/images/placeholders/content.png",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
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
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [false],
                    },
                  ],
                },
                {
                  type: "Notice",
                  options: {
                    notice: {
                      configuration: {
                        id: "no-categories-notice",
                        noticeType: "notice",
                        closable: false,
                        icon: "exclamation-mark-triangle",
                        kind: "warning",
                        scale: "m",
                      },
                      message:
                        "{{shared.fields.categories.noCategoriesNotice.body:translate}}",
                      autoShow: true,
                      actions: [
                        {
                          label:
                            "{{shared.fields.categories.noCategoriesNotice.link:translate}}",
                          icon: "launch",
                          href: "https://doc.arcgis.com/en/arcgis-online/reference/content-categories.htm",
                          target: "_blank",
                        },
                      ],
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [false],
                    },
                  ],
                },
              ],
            },
            {
              labelKey: "some.scope.fields.license.label",
              scope: "/properties/licenseInfo",
              type: "Control",
              options: {
                control: "arcgis-hub-license-picker",
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.location.label",
          elements: [
            {
              scope: "/properties/location",
              type: "Control",
              options: {
                control: "hub-field-input-location-picker",
                extent: [],
                options: [],
                noticeTitleElementAriaLevel: 3,
              },
            },
          ],
        },
      ],
    });
  });
});
