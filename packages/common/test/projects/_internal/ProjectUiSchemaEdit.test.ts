import { buildUiSchema } from "../../../src/projects/_internal/ProjectUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as fetchCategoryItemsModule from "../../../src/core/schemas/internal/fetchCategoryItems";
import * as getFeaturedContentCatalogsModule from "../../../src/core/schemas/internal/getFeaturedContentCatalogs";
import * as getAuthedImageUrlModule from "../../../src/core/_internal/getAuthedImageUrl";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import * as getSlugSchemaElementModule from "../../../src/core/schemas/internal/getSlugSchemaElement";

describe("buildUiSchema: project edit", () => {
  const mockSlugElement = {
    labelKey: "slug",
    scope: "/properties/_slug",
  } as any;
  beforeEach(() => {
    spyOn(fetchCategoryItemsModule, "fetchCategoryItems").and.returnValue(
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
    spyOn(getSlugSchemaElementModule, "getSlugSchemaElement").and.returnValue(
      mockSlugElement
    );
  });
  it("returns the full project edit uiSchema", async () => {
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
              labelKey: "some.scope.fields.featuredImage.label",
              scope: "/properties/view/properties/featuredImage",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-image-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                helperText: {
                  labelKey: "some.scope.fields.featuredImage.helperText",
                },
                sizeDescription: {
                  labelKey: "some.scope.fields.featuredImage.sizeDescription",
                },
              },
            },
            {
              labelKey: "some.scope.fields.featuredImage.altText.label",
              scope: "/properties/view/properties/featuredImageAltText",
              type: "Control",
              options: {
                helperText: {
                  labelKey:
                    "some.scope.fields.featuredImage.altText.helperText",
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
            mockSlugElement,
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
                helperText: {
                  labelKey: "some.scope.fields._thumbnail.helperText",
                },
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
                },
              },
            },
            {
              type: "Notice",
              options: {
                notice: {
                  configuration: {
                    id: "no-thumbnail-or-png-notice",
                    noticeType: "notice",
                    closable: false,
                    icon: "lightbulb",
                    kind: "info",
                    scale: "m",
                  },
                  message:
                    "{{shared.fields._thumbnail.defaultThumbnailNotice:translate}}",
                  autoShow: true,
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
        {
          type: "Section",
          labelKey: "some.scope.sections.timeline.label",
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
        {
          type: "Section",
          labelKey: "some.scope.sections.featuredContent.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.featuredContent.helperText",
            },
          },
          elements: [
            {
              scope: "/properties/view/properties/featuredContentIds",
              type: "Control",
              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "item",
                catalogs: {},
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
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.callToAction.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.callToAction.helperText",
            },
          },
          elements: [
            {
              scope: "/properties/view/properties/heroActions",
              type: "Control",
              options: {
                control: "hub-composite-input-action-links",
                type: "button",
                catalogs: {},
                facets: [
                  {
                    label: `{{some.scope.fields.callToAction.facets.type:translate}}`,
                    key: "type",
                    display: "multi-select",
                    field: "type",
                    options: [],
                    operation: "OR",
                    aggLimit: 100,
                  },
                  {
                    label: `{{some.scope.fields.callToAction.facets.sharing:translate}}`,
                    key: "access",
                    display: "multi-select",
                    field: "access",
                    options: [],
                    operation: "OR",
                  },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sections.embeds.label`,
          options: {
            headerTag: "h2",
            helperText: { labelKey: "some.scope.sections.embeds.helperText" },
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
              labelKey: "some.scope.fields.featuredImage.label",
              scope: "/properties/view/properties/featuredImage",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-image-url.com",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                helperText: {
                  labelKey: "some.scope.fields.featuredImage.helperText",
                },
                sizeDescription: {
                  labelKey: "some.scope.fields.featuredImage.sizeDescription",
                },
              },
            },
            {
              labelKey: "some.scope.fields.featuredImage.altText.label",
              scope: "/properties/view/properties/featuredImageAltText",
              type: "Control",
              options: {
                helperText: {
                  labelKey:
                    "some.scope.fields.featuredImage.altText.helperText",
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
            mockSlugElement,
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
                helperText: {
                  labelKey: "some.scope.fields._thumbnail.helperText",
                },
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
                },
              },
            },
            {
              type: "Notice",
              options: {
                notice: {
                  configuration: {
                    id: "no-thumbnail-or-png-notice",
                    noticeType: "notice",
                    closable: false,
                    icon: "lightbulb",
                    kind: "info",
                    scale: "m",
                  },
                  message:
                    "{{shared.fields._thumbnail.defaultThumbnailNotice:translate}}",
                  autoShow: true,
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
        {
          type: "Section",
          labelKey: "some.scope.sections.timeline.label",
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
        {
          type: "Section",
          labelKey: "some.scope.sections.featuredContent.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.featuredContent.helperText",
            },
          },
          elements: [
            {
              scope: "/properties/view/properties/featuredContentIds",
              type: "Control",
              options: {
                control: "hub-field-input-gallery-picker",
                targetEntity: "item",
                catalogs: {},
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
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.callToAction.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.callToAction.helperText",
            },
          },
          elements: [
            {
              scope: "/properties/view/properties/heroActions",
              type: "Control",
              options: {
                control: "hub-composite-input-action-links",
                type: "button",
                catalogs: {},
                facets: [
                  {
                    label: `{{some.scope.fields.callToAction.facets.type:translate}}`,
                    key: "type",
                    display: "multi-select",
                    field: "type",
                    options: [],
                    operation: "OR",
                    aggLimit: 100,
                  },
                  {
                    label: `{{some.scope.fields.callToAction.facets.sharing:translate}}`,
                    key: "access",
                    display: "multi-select",
                    field: "access",
                    options: [],
                    operation: "OR",
                  },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: `some.scope.sections.embeds.label`,
          options: {
            headerTag: "h2",
            helperText: { labelKey: "some.scope.sections.embeds.helperText" },
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
      ],
    });
  });
});
