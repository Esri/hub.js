import { getEntityEditorSchemas } from "../../../../src/core/schemas/internal/getEntityEditorSchemas";
import { ProjectEditorTypes } from "../../../../src/projects/_internal/ProjectSchema";
import { InitiativeEditorTypes } from "../../../../src/initiatives/_internal/InitiativeSchema";
import { SiteEditorTypes } from "../../../../src/sites/_internal/SiteSchema";
import { DiscussionEditorTypes } from "../../../../src/discussions/_internal/DiscussionSchema";
import { ContentEditorTypes } from "../../../../src/content/_internal/ContentSchema";
import { PageEditorTypes } from "../../../../src/pages/_internal/PageSchema";
import * as applyOptionsModule from "../../../../src/core/schemas/internal/applyUiSchemaElementOptions";
import * as filterSchemaModule from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";
import { UiSchemaElementOptions } from "../../../../src";

describe("getEntityEditorSchemas: ", () => {
  it("returns a schema & uiSchema for a given entity and editor type", () => {
    [
      ...ProjectEditorTypes,
      ...InitiativeEditorTypes,
      ...SiteEditorTypes,
      ...DiscussionEditorTypes,
      ...ContentEditorTypes,
      ...PageEditorTypes,
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
    ).and.callThrough();
    const applyUiSchemaElementOptionsSpy = spyOn(
      applyOptionsModule,
      "applyUiSchemaElementOptions"
    ).and.callThrough();

    const opts: UiSchemaElementOptions[] = [
      {
        scope: "/properties/location",
        options: {
          extent: [],
          options: [
            {
              selected: true,
              label: "{{shared.fields.location.none:translate}}",
              location: { type: "none" },
            },
          ],
        },
      },
    ];

    await getEntityEditorSchemas("some.scope", "hub:project:edit", opts);

    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
    expect(applyUiSchemaElementOptionsSpy).toHaveBeenCalledTimes(1);
  });
});
