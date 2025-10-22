import { vi } from "vitest";
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
  let fetchCategoriesUiSchemaElementSpy: any;
  beforeEach(() => {
    vi.spyOn(
      getRecommendedTemplatesCatalogModule as any,
      "getRecommendedTemplatesCatalog"
    ).mockReturnValue([] as any);
    fetchCategoriesUiSchemaElementSpy = vi
      .spyOn(
        fetchCategoriesUiSchemaElementModule as any,
        "fetchCategoriesUiSchemaElement"
      )
      .mockResolvedValue(CATEGORIES_ELEMENTS as any);
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
      elements: expect.any(Array),
    });
  });
});
