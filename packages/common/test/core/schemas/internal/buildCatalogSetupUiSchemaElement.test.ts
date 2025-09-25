import { buildCatalogSetupUiSchemaElement } from "../../../../src/core/schemas/internal/buildCatalogSetupUiSchemaElement";
import * as wellKnownCatalogModule from "../../../../src/search/wellKnownCatalog";
import * as checkPermissionModule from "../../../../src/permissions/checkPermission";
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
      wellKnownCatalogModule,
      "getWellKnownCatalogs"
    ).and.returnValue(["mockCatalog"]);
    spyOn(checkPermissionModule, "checkPermission").and.returnValues(
      { access: true },
      { access: false }
    );

    const i18nScope = "test.scope";
    let result = buildCatalogSetupUiSchemaElement(i18nScope, context);

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
    // 5. verify the "quick-select" option only renders if
    // the current user can create a view group
    expect(result[0].options.rules[1][0].conditions[0]).toBe(true);
    result = buildCatalogSetupUiSchemaElement(i18nScope, context);
    expect(result[0].options.rules[1][0].conditions[0]).toBe(false);
  });
});
