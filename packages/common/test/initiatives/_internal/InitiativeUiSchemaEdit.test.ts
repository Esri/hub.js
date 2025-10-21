import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import * as getFeaturedContentCatalogsModule from "../../../src/core/schemas/internal/getFeaturedContentCatalogs";
import { UiSchemaRuleEffects } from "../../../src/core/enums/uiSchemaRuleEffects";
import * as getAuthedImageUrlModule from "../../../src/core/_internal/getAuthedImageUrl";
import * as fetchCategoriesUiSchemaElementModule from "../../../src/core/schemas/internal/fetchCategoriesUiSchemaElement";

const CATEGORIES_ELEMENTS = [
  {
    labelKey: "shared.fields.categories.label",
    scope: "/properties/categories",
    type: "Control",
    options: {
      control: "hub-field-input-combobox",
      groups: [
        {
          label:
            "{{shared.fields.categories.recognizedCategoriesGroup.label:translate}}",
          items: [
            {
              value: "/categories",
              label: "/categories",
            },
          ],
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
];

describe("buildUiSchema: initiative edit", () => {
  let fetchCategoriesUiSchemaElementSpy: jasmine.Spy;
  beforeEach(() => {
    fetchCategoriesUiSchemaElementSpy = spyOn(
      fetchCategoriesUiSchemaElementModule,
      "fetchCategoriesUiSchemaElement"
    ).and.returnValue(Promise.resolve(CATEGORIES_ELEMENTS));
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
  });
  it("returns the full initiative edit uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        categories: ["/Categories/Category"],
        thumbnail: "thumbnail/custom.png",
        thumbnailUrl: "https://some-thumbnail-url.com",
      } as any,
      MOCK_CONTEXT
    );
    expect(fetchCategoriesUiSchemaElementSpy).toHaveBeenCalledWith({
      source: "org",
      currentValues: ["/Categories/Category"],
      context: MOCK_CONTEXT,
    });
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
                    labelKey: "shared.fields.purpose.maxLengthError",
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
                ...CATEGORIES_ELEMENTS,
              ],
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
            {
              type: "Section",
              labelKey: "some.scope.sections.timeline.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.timeline.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/timeline",
                  type: "Control",
                  options: {
                    control: "arcgis-hub-timeline-editor",
                    showTitleAndDescription: false,
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          labelKey: "shared.sections.heroBanner.label",
          elements: [
            {
              type: "Section",
              labelKey: "shared.sections.heroBannerAppearance.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "shared.sections.heroBannerAppearance.helperText",
                },
              },
              elements: [
                {
                  labelKey: "some.scope.fields.hero.label",
                  scope: "/properties/view/properties/hero",
                  type: "Control",
                  options: {
                    control: "hub-field-input-tile-select",
                    layout: "horizontal",
                    labels: [
                      "{{some.scope.fields.hero.map.label:translate}}",
                      "{{some.scope.fields.hero.image.label:translate}}",
                    ],
                    descriptions: [
                      "{{some.scope.fields.hero.map.description:translate}}",
                      "{{some.scope.fields.hero.image.description:translate}}",
                    ],
                    icons: ["map-pin", "image"],
                  },
                },
                {
                  labelKey: "some.scope.fields.featuredImage.label",
                  scope: "/properties/view/properties/featuredImage",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: {
                        const: "map",
                      },
                    },
                  },
                  options: {
                    control: "hub-field-input-image-picker",
                    imgSrc: "https://some-image-url.com",
                    maxWidth: 727,
                    maxHeight: 484,
                    aspectRatio: 1.5,
                    sizeDescription: {
                      labelKey:
                        "some.scope.fields.featuredImage.sizeDescription",
                    },
                  },
                },
                {
                  labelKey: "some.scope.fields.featuredImage.altText.label",
                  scope: "/properties/view/properties/featuredImageAltText",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: {
                        const: "map",
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it("returns the full initiative edit uiSchema with a defined view", async () => {
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
                    labelKey: "shared.fields.purpose.maxLengthError",
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
                ...CATEGORIES_ELEMENTS,
              ],
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
            {
              type: "Section",
              labelKey: "some.scope.sections.timeline.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.timeline.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/timeline",
                  type: "Control",
                  options: {
                    control: "arcgis-hub-timeline-editor",
                    showTitleAndDescription: false,
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          labelKey: "shared.sections.heroBanner.label",
          elements: [
            {
              type: "Section",
              labelKey: "shared.sections.heroBannerAppearance.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "shared.sections.heroBannerAppearance.helperText",
                },
              },
              elements: [
                {
                  labelKey: "some.scope.fields.hero.label",
                  scope: "/properties/view/properties/hero",
                  type: "Control",
                  options: {
                    control: "hub-field-input-tile-select",
                    layout: "horizontal",
                    labels: [
                      "{{some.scope.fields.hero.map.label:translate}}",
                      "{{some.scope.fields.hero.image.label:translate}}",
                    ],
                    descriptions: [
                      "{{some.scope.fields.hero.map.description:translate}}",
                      "{{some.scope.fields.hero.image.description:translate}}",
                    ],
                    icons: ["map-pin", "image"],
                  },
                },
                {
                  labelKey: "some.scope.fields.featuredImage.label",
                  scope: "/properties/view/properties/featuredImage",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: {
                        const: "map",
                      },
                    },
                  },
                  options: {
                    control: "hub-field-input-image-picker",
                    imgSrc: "https://some-image-url.com",
                    maxWidth: 727,
                    maxHeight: 484,
                    aspectRatio: 1.5,
                    sizeDescription: {
                      labelKey:
                        "some.scope.fields.featuredImage.sizeDescription",
                    },
                  },
                },
                {
                  labelKey: "some.scope.fields.featuredImage.altText.label",
                  scope: "/properties/view/properties/featuredImageAltText",
                  type: "Control",
                  rule: {
                    effect: UiSchemaRuleEffects.HIDE,
                    condition: {
                      scope: "/properties/view/properties/hero",
                      schema: {
                        const: "map",
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
