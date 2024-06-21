import { IArcGISContext } from "../../../../src/ArcGISContext";
import { fetchCategoriesUiSchemaElement } from "../../../../src/core/schemas/internal/fetchCategoriesUiSchemaElement";
import * as getCategoryItemsModule from "../../../../src/core/schemas/internal/getCategoryItems";

describe("fetchCategoriesUiSchemaElement:", () => {
  it("excludes the no categories notice if category items are available", async () => {
    spyOn(getCategoryItemsModule, "getCategoryItems").and.returnValue(
      Promise.resolve([
        {
          value: "/categories",
          label: "/categories",
        },
      ])
    );
    const context = {
      portal: {
        id: "some-org-id",
        url: "some-org-url",
      },
    } as unknown as IArcGISContext;
    const uiSchema = await fetchCategoriesUiSchemaElement("scope", context);
    expect(uiSchema.options?.messages).toBeUndefined();
  });

  it("includes the no categories notice if category items are not available", async () => {
    spyOn(getCategoryItemsModule, "getCategoryItems").and.returnValue(
      Promise.resolve([])
    );
    const context = {
      portal: {
        id: "some-org-id",
        url: "some-org-url",
      },
    } as unknown as IArcGISContext;
    const uiSchema = await fetchCategoriesUiSchemaElement("scope", context);
    expect(uiSchema.options?.messages?.length).toBe(1);
    expect(uiSchema.options?.messages[0].labelKey).toBe(
      "shared.fields.categories.noCategoriesNotice.body"
    );
  });
});
