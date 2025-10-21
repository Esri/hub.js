import { describe, it, expect, vi } from "vitest";

// mock internal helpers used by buildUiSchema
vi.mock(
  "/Users/tom6947/code/hub.js/packages/common/src/core/schemas/internal/getTagItems",
  () => ({ getTagItems: vi.fn().mockResolvedValue([]) })
);
vi.mock(
  "/Users/tom6947/code/hub.js/packages/common/src/core/schemas/internal/getLocationExtent",
  () => ({ getLocationExtent: vi.fn().mockResolvedValue(undefined) })
);
vi.mock(
  "/Users/tom6947/code/hub.js/packages/common/src/core/schemas/internal/getLocationOptions",
  () => ({ getLocationOptions: vi.fn().mockResolvedValue([]) })
);
vi.mock(
  "/Users/tom6947/code/hub.js/packages/common/src/core/schemas/internal/fetchCategoriesUiSchemaElement",
  () => ({ fetchCategoriesUiSchemaElement: vi.fn().mockResolvedValue([]) })
);
vi.mock(
  "/Users/tom6947/code/hub.js/packages/common/src/core/schemas/internal/getThumbnailUiSchemaElement",
  () => ({ getThumbnailUiSchemaElement: vi.fn().mockReturnValue([]) })
);
vi.mock(
  "/Users/tom6947/code/hub.js/packages/common/src/core/schemas/internal/getTagItems",
  () => ({ getTagItems: vi.fn().mockResolvedValue([]) })
);

import { buildUiSchema } from "/Users/tom6947/code/hub.js/packages/common/src/projects/_internal/ProjectUiSchemaEdit";

describe("ProjectUiSchemaEdit buildUiSchema", () => {
  it("returns a schema with sections and uses mocked helpers", async () => {
    const context: any = {
      portal: { id: "p1", name: "portal" },
      hubRequestOptions: {},
      requestOptions: {},
      currentUser: {},
    };

    const schema = await buildUiSchema(
      "proj",
      { name: "test" } as any,
      context
    );
    expect(schema).toBeTruthy();
    // high-level sanity checks
    expect(
      schema.elements.some((s: any) => s.labelKey.includes("basicInfo"))
    ).toBe(true);
    expect(
      schema.elements.some((s: any) => s.labelKey.includes("location"))
    ).toBe(true);
  });
});
