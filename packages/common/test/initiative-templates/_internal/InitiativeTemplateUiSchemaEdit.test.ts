import { buildUiSchema } from "../../../src/initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import * as getRecommendedTemplatesCatalogModule from "../../../src/initiative-templates/_internal/getRecommendedTemplatesCatalog";
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
        conditions: [true],
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
        conditions: [true],
      },
    ],
  },
];

describe("buildUiSchema: initiative template edit", () => {
  let fetchCategoriesUiSchemaElementSpy: jasmine.Spy;
  beforeEach(() => {
    spyOn(
      getRecommendedTemplatesCatalogModule,
      "getRecommendedTemplatesCatalog"
    ).and.returnValue([]);
    fetchCategoriesUiSchemaElementSpy = spyOn(
      fetchCategoriesUiSchemaElementModule,
      "fetchCategoriesUiSchemaElement"
    ).and.returnValue(Promise.resolve(CATEGORIES_ELEMENTS));
  });
  it("returns the full initiative template edit uiSchema", async () => {
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
      context: MOCK_CONTEXT,
      currentValues: ["/Categories/Category"],
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
              type: "Control",
              scope: "/properties/name",
              labelKey: "some.scope.fields.name.label",
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
                    labelKey: "shared.fields.name.maxLengthError",
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
              type: "Control",
              scope: "/properties/summary",
              labelKey: "some.scope.fields.summary.label",
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
                  type: "Control",
                  scope: "/properties/description",
                  labelKey: "some.scope.fields.description.label",
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
                extent: {
                  spatialReference: { wkid: 4326 },
                  xmax: 180,
                  xmin: -180,
                  ymax: 90,
                  ymin: -90,
                },
                options: [
                  {
                    label: "{{shared.fields.location.none:translate}}",
                    location: {
                      type: "none",
                    },
                  },
                  {
                    description: "My org",
                    label: "{{shared.fields.location.org:translate}}",
                    location: {
                      extent: [
                        [-180, -90],
                        [180, 90],
                      ],
                      spatialReference: {
                        wkid: 4326,
                      },
                      type: "org",
                    },
                  },
                  {
                    description:
                      "{{shared.fields.location.customDescription:translate}}",
                    entityType: undefined,
                    label: "{{shared.fields.location.custom:translate}}",
                    location: {
                      spatialReference: {
                        wkid: 4326,
                      },
                      type: "custom",
                    },
                    selected: true,
                  },
                ],
                noticeTitleElementAriaLevel: 3,
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.templateDetails.label",
          elements: [
            {
              type: "Control",
              scope: "/properties/previewUrl",
              labelKey: "some.scope.fields.previewUrl.label",
              options: {
                helperText: {
                  labelKey: "some.scope.fields.previewUrl.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "format",
                    icon: true,
                    labelKey: "shared.errors.urlFormat",
                  },
                  {
                    type: "ERROR",
                    keyword: "if",
                    hidden: true,
                  },
                ],
              },
            },
            {
              type: "Control",
              scope: "/properties/recommendedTemplates",
              labelKey: "some.scope.fields.recommendedTemplates.label",
              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "item",
                catalogs: [],
                facets: [
                  {
                    label:
                      "{{some.scope.fields.recommendedTemplates.facets.sharing:translate}}",
                    key: "access",
                    field: "access",
                    display: "multi-select",
                    operation: "OR",
                  },
                ],
                canReorder: false,
                linkTarget: "siteRelative",
                pickerTitle: {
                  labelKey:
                    "some.scope.fields.recommendedTemplates.pickerTitle",
                },
              },
            },
          ],
        },
      ],
    });
  });
});
