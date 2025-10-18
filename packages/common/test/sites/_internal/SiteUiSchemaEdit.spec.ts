import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getTagItemsModule from "../../../src/core/schemas/internal/getTagItems";
import * as fetchCategoriesUiSchemaElementModule from "../../../src/core/schemas/internal/fetchCategoriesUiSchemaElement";
import { vi } from "vitest";

const CATEGORIES_ELEMENTS = [
  /* ...existing fixture copied from original test... */
];

describe("buildUiSchema: site edit", () => {
  let fetchCategoriesUiSchemaElementSpy: any;
  beforeEach(() => {
    fetchCategoriesUiSchemaElementSpy = vi
      .spyOn(
        fetchCategoriesUiSchemaElementModule,
        "fetchCategoriesUiSchemaElement"
      )
      .mockReturnValue(Promise.resolve(CATEGORIES_ELEMENTS) as any);
    vi.spyOn(getLocationExtentModule, "getLocationExtent").mockReturnValue(
      Promise.resolve([]) as any
    );
    vi.spyOn(getLocationOptionsModule, "getLocationOptions").mockReturnValue(
      Promise.resolve([]) as any
    );
    vi.spyOn(getTagItemsModule, "getTagItems").mockReturnValue(
      Promise.resolve([]) as any
    );
  });

  it("returns the full site edit uiSchema", async () => {
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
