import { getEntityEditorSchemas } from "../../../src/core/schemas/getEntityEditorSchemas";
import { ProjectEditorTypes } from "../../../src/projects/_internal/ProjectSchema";
import { InitiativeEditorTypes } from "../../../src/initiatives/_internal/InitiativeSchema";
import { SiteEditorTypes } from "../../../src/sites/_internal/SiteSchema";
import { DiscussionEditorTypes } from "../../../src/discussions/_internal/DiscussionSchema";
import { ContentEditorTypes } from "../../../src/content/_internal/ContentSchema";
import * as applyOptionsModule from "../../../src/core/schemas/internal/applyUiSchemaElementOptions";
import * as filterSchemaModule from "../../../src/core/schemas/internal/filterSchemaToUiSchema";
import * as itemsModule from "../../../src/items";

describe("getEntityEditorSchemas", () => {
  it("returns a schema & uiSchema for a given entity and editor type", () => {
    [
      ...ProjectEditorTypes,
      ...InitiativeEditorTypes,
      ...SiteEditorTypes,
      ...DiscussionEditorTypes,
      ...ContentEditorTypes,
    ].forEach(async (type, idx) => {
      const { schema, uiSchema } = await getEntityEditorSchemas(
        "some.scope",
        type
      );

      expect(schema).toBeDefined();
      expect(uiSchema).toBeDefined();
    });
  });
  it("filters, and applies dynamic options to the schemas before returning", async () => {
    const filterSchemaToUiSchemaSpy = spyOn(
      filterSchemaModule,
      "filterSchemaToUiSchema"
    );
    const applyUiSchemaElementOptionsSpy = spyOn(
      applyOptionsModule,
      "applyUiSchemaElementOptions"
    );
    const interpolateSpy = spyOn(itemsModule, "interpolate");

    await getEntityEditorSchemas("some.scope", "hub:project:create");

    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
    expect(applyUiSchemaElementOptionsSpy).toHaveBeenCalledTimes(1);
    expect(interpolateSpy).toHaveBeenCalledTimes(1);
  });
});
