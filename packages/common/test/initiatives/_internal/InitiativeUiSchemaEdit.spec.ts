import { vi } from "vitest";
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
    ).mockReturnValue({} as any);
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

  afterEach(() => vi.restoreAllMocks());

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
    expect(uiSchema).toBeDefined();
  });
});
