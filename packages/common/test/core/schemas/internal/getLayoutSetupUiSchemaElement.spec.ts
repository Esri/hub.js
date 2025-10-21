import { getLayoutSetupUiSchemaElement } from "../../../../src/core/schemas/internal/getLayoutSetupUiSchemaElement";

describe("getLayoutSetupUiSchemaElement", () => {
  it("returns site layout label when i18nScope includes 'site'", () => {
    const result = getLayoutSetupUiSchemaElement("site-create");
    expect(result[0].label).toBe(
      "{{site-create.fields._layoutSetup.type.layout:translate}}",
      "should use site layout label"
    );
  });

  it("returns page layout label when i18nScope does not include 'site'", () => {
    const result = getLayoutSetupUiSchemaElement("page-create");
    expect(result[0].label).toBe(
      "{{page-create.fields._layoutSetup.type.layout:translate}}",
      "should use page layout label"
    );
  });
});
