import { buildCatalogSetupUiSchemaElement } from "../../../../src/core/schemas/internal/buildCatalogSetupUiSchemaElement";
import * as searchModule from "../../../../src/search";
import { IArcGISContext } from "../../../../src/types/IArcGISContext";

describe("buildCatalogSetupUiSchemaElement", () => {
  let context: IArcGISContext;
  beforeEach(() => {
    context = {
      portal: { urlKey: "orgKey" },
      userRequestOptions: {},
    } as unknown as IArcGISContext;
  });

  it("returns two elements with correct structure and calls getWellKnownCatalogs with expected args", () => {
    const getWellKnownCatalogsSpy = spyOn(
      searchModule,
      "getWellKnownCatalogs"
    ).and.returnValue(["mockCatalog"]);
    const i18nScope = "test.scope";
    const result = buildCatalogSetupUiSchemaElement(i18nScope, context);

    // 1. Result should be an array with two uiSchema elements
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    // 2. First element: type control
    const typeControl = result[0];
    expect(typeControl.scope).toBe("/properties/_catalogSetup/properties/type");
    expect(typeControl.options.control).toBe("hub-field-input-tile-select");
    // 3. Second element: groupId control
    const groupIdControl = result[1];
    expect(groupIdControl.scope).toBe(
      "/properties/_catalogSetup/properties/groupId"
    );
    expect(groupIdControl.options.control).toBe(
      "hub-field-input-gallery-picker"
    );
    expect(groupIdControl.options.catalogs).toEqual(["mockCatalog"]);
    // 4. getWellKnownCatalogs is called with correct args
    expect(getWellKnownCatalogsSpy).toHaveBeenCalledWith(
      "shared.wellKnownCatalogs.group",
      "group",
      ["myGroups", "orgGroups", "communityGroups", "publicGroups"],
      context
    );
  });
});
