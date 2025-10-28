import { vi, describe, it, expect, beforeEach } from "vitest";

import { buildUiSchema } from "../../../src/projects/_internal/ProjectUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getFeaturedContentCatalogsModule from "../../../src/core/schemas/internal/getFeaturedContentCatalogs";
import * as getAuthedImageUrlModule from "../../../src/core/_internal/getAuthedImageUrl";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import { UiSchemaRuleEffects } from "../../../src/core/enums/uiSchemaRuleEffects";
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

describe("buildUiSchema: project edit", () => {
  let fetchCategoriesUiSchemaElementSpy: any;
  beforeEach(() => {
    fetchCategoriesUiSchemaElementSpy = vi
      .spyOn(
        fetchCategoriesUiSchemaElementModule,
        "fetchCategoriesUiSchemaElement"
      )
      .mockResolvedValue(CATEGORIES_ELEMENTS as any);
    vi.spyOn(
      getFeaturedContentCatalogsModule,
      "getFeaturedContentCatalogs"
    ).mockReturnValue([] as any);
    vi.spyOn(getAuthedImageUrlModule, "getAuthedImageUrl").mockReturnValue(
      "https://some-image-url.com"
    );
    vi.spyOn(getLocationExtentModule, "getLocationExtent").mockResolvedValue(
      [] as any
    );
    vi.spyOn(getLocationOptionsModule, "getLocationOptions").mockResolvedValue(
      [] as any
    );
    vi.spyOn(getTagItemsModule, "getTagItems").mockResolvedValue([] as any);
  });
  it("returns the full project edit uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        categories: ["/categories/category1"],
        thumbnail: "thumbnail/custom.png",
        thumbnailUrl: "https://some-thumbnail-url.com",
      } as any,
      MOCK_CONTEXT
    );
    expect(fetchCategoriesUiSchemaElementSpy).toHaveBeenCalledWith({
      source: "org",
      currentValues: ["/categories/category1"],
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
              labelKey: "shared.sections.heroActions.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "shared.sections.heroActions.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/heroActions",
                  type: "Control",
                  options: {
                    control: "hub-composite-input-action-links",
                    type: "button",
                    catalogs: [],
                    facets: [
                      {
                        label:
                          "{{some.scope.fields.callToAction.facets.type:translate}}",
                        key: "type",
                        display: "multi-select",
                        field: "type",
                        options: [],
                        operation: "OR",
                        aggLimit: 100,
                      },
                      {
                        label:
                          "{{some.scope.fields.callToAction.facets.sharing:translate}}",
                        key: "access",
                        display: "multi-select",
                        field: "access",
                        options: [],
                        operation: "OR",
                      },
                    ],
                    showAllCollectionFacet: true,
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.view.label",
          elements: [
            {
              type: "Section",
              labelKey: "some.scope.sections.view.image.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.view.image.helperText",
                },
              },
              elements: [
                {
                  labelKey: "shared.fields.featuredImage.label",
                  scope: "/properties/view/properties/featuredImage",
                  type: "Control",
                  options: {
                    control: "hub-field-input-image-picker",
                    imgSrc: "https://some-image-url.com",
                    maxWidth: 727,
                    maxHeight: 484,
                    aspectRatio: 1.5,
                    sizeDescription: {
                      labelKey: "shared.fields.featuredImage.sizeDescription",
                    },
                  },
                },
                {
                  labelKey: "shared.fields.featuredImage.altText.label",
                  scope: "/properties/view/properties/featuredImageAltText",
                  type: "Control",
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.view.embed.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.view.embed.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/embeds",
                  type: "Control",
                  options: {
                    control: "hub-composite-input-embeds",
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.view.content.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.view.content.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/featuredContentIds",
                  type: "Control",
                  options: {
                    control: "hub-field-input-gallery-picker",
                    targetEntity: "item",
                    catalogs: [],
                    facets: [
                      {
                        label:
                          "{{some.scope.fields.featuredContent.facets.type:translate}}",
                        key: "type",
                        display: "multi-select",
                        field: "type",
                        options: [],
                        operation: "OR",
                        aggLimit: 100,
                      },
                      {
                        label:
                          "{{some.scope.fields.featuredContent.facets.sharing:translate}}",
                        key: "access",
                        display: "multi-select",
                        field: "access",
                        options: [],
                        operation: "OR",
                      },
                    ],
                    showAllCollectionFacet: true,
                    showAddContent: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it("returns the full project edit uiSchema with a defined view", async () => {
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
              labelKey: "shared.sections.heroActions.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "shared.sections.heroActions.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/heroActions",
                  type: "Control",
                  options: {
                    control: "hub-composite-input-action-links",
                    type: "button",
                    catalogs: [],
                    facets: [
                      {
                        label:
                          "{{some.scope.fields.callToAction.facets.type:translate}}",
                        key: "type",
                        display: "multi-select",
                        field: "type",
                        options: [],
                        operation: "OR",
                        aggLimit: 100,
                      },
                      {
                        label:
                          "{{some.scope.fields.callToAction.facets.sharing:translate}}",
                        key: "access",
                        display: "multi-select",
                        field: "access",
                        options: [],
                        operation: "OR",
                      },
                    ],
                    showAllCollectionFacet: true,
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.view.label",
          elements: [
            {
              type: "Section",
              labelKey: "some.scope.sections.view.image.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.view.image.helperText",
                },
              },
              elements: [
                {
                  labelKey: "shared.fields.featuredImage.label",
                  scope: "/properties/view/properties/featuredImage",
                  type: "Control",
                  options: {
                    control: "hub-field-input-image-picker",
                    imgSrc: "https://some-image-url.com",
                    maxWidth: 727,
                    maxHeight: 484,
                    aspectRatio: 1.5,
                    sizeDescription: {
                      labelKey: "shared.fields.featuredImage.sizeDescription",
                    },
                  },
                },
                {
                  labelKey: "shared.fields.featuredImage.altText.label",
                  scope: "/properties/view/properties/featuredImageAltText",
                  type: "Control",
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.view.embed.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.view.embed.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/embeds",
                  type: "Control",
                  options: {
                    control: "hub-composite-input-embeds",
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.view.content.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.view.content.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/featuredContentIds",
                  type: "Control",
                  options: {
                    control: "hub-field-input-gallery-picker",
                    targetEntity: "item",
                    catalogs: [],
                    facets: [
                      {
                        label:
                          "{{some.scope.fields.featuredContent.facets.type:translate}}",
                        key: "type",
                        display: "multi-select",
                        field: "type",
                        options: [],
                        operation: "OR",
                        aggLimit: 100,
                      },
                      {
                        label:
                          "{{some.scope.fields.featuredContent.facets.sharing:translate}}",
                        key: "access",
                        display: "multi-select",
                        field: "access",
                        options: [],
                        operation: "OR",
                      },
                    ],
                    showAllCollectionFacet: true,
                    showAddContent: true,
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
