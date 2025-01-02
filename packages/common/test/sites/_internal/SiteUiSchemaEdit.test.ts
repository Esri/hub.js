import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import * as fetchCategoryItemsModule from "../../../src/core/schemas/internal/fetchCategoryItems";
import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import * as getSlugSchemaElementModule from "../../../src/core/schemas/internal/getSlugSchemaElement";

describe("buildUiSchema: site edit", () => {
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
  it("returns the full site edit uiSchema", async () => {
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
                    labelKey: `some.scope.fields.name.siteEntityTitleValidatorError`,
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
                    labelKey: `shared.fields.summary.maxLengthError`,
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
                noticeTitleElementAriaLevel: 3,
              },
            },
          ],
        },
      ],
    });
  });
});
