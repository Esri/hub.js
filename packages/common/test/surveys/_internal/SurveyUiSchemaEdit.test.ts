import { buildUiSchema } from "../../../src/surveys/_internal/SurveyUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as fetchCategoryItemsModule from "../../../src/core/schemas/internal/fetchCategoryItems";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";

describe("buildUiSchema: survey edit", () => {
  it("returns the full survey edit uiSchema", async () => {
    spyOn(fetchCategoryItemsModule, "fetchCategoryItems").and.returnValue(
      Promise.resolve([
        {
          value: "/categories",
          label: "/categories",
        },
      ])
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
                    labelKey: "shared.fields.title.maxLengthError",
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
                extent: {
                  xmin: -180,
                  ymin: -90,
                  xmax: 180,
                  ymax: 90,
                  spatialReference: {
                    wkid: 4326,
                  },
                },
                options: [
                  {
                    label: "{{shared.fields.location.none:translate}}",
                    location: {
                      type: "none",
                    },
                  },
                  {
                    label: "{{shared.fields.location.org:translate}}",
                    description: "My org",
                    location: {
                      type: "org",
                      extent: [
                        [-180, -90],
                        [180, 90],
                      ],
                      spatialReference: {
                        wkid: 4326,
                      },
                    },
                  },
                  {
                    label: "{{shared.fields.location.custom:translate}}",
                    description:
                      "{{shared.fields.location.customDescription:translate}}",
                    entityType: undefined,
                    location: {
                      type: "custom",
                      spatialReference: {
                        wkid: 4326,
                      },
                    },
                    selected: true,
                  },
                ],
                noticeTitleElementAriaLevel: 3,
              },
            },
          ],
        },
      ],
    });
  });
});
