import { getEntityEditorSchemas } from "../../../../src/core/schemas/internal/getEntityEditorSchemas";
import * as filterSchemaModule from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";

import { ProjectEditorTypes } from "../../../../src/projects/_internal/ProjectSchema";
import * as ProjectBuildEditUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaEdit";
import * as ProjectBuildCreateUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaCreate";

import { InitiativeEditorTypes } from "../../../../src/initiatives/_internal/InitiativeSchema";
import * as InitiativeBuildEditUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaEdit";
import * as InitiativeBuildCreateUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaCreate";

import { SiteEditorTypes } from "../../../../src/sites/_internal/SiteSchema";
import * as SiteBuildEditUiSchema from "../../../../src/sites/_internal/SiteUiSchemaEdit";
import * as SiteBuildCreateUiSchema from "../../../../src/sites/_internal/SiteUiSchemaCreate";

import { DiscussionEditorTypes } from "../../../../src/discussions/_internal/DiscussionSchema";
import * as DiscussionBuildEditUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaEdit";
import * as DiscussionBuildCreateUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaCreate";

import { ContentEditorTypes } from "../../../../src/content/_internal/ContentSchema";
import * as ContentBuildEditUiSchema from "../../../../src/content/_internal/ContentUiSchemaEdit";

import { PageEditorTypes } from "../../../../src/pages/_internal/PageSchema";
import * as PageBuildEditUiSchema from "../../../../src/pages/_internal/PageUiSchemaEdit";

import { GroupEditorTypes } from "../../../../src/groups/_internal/GroupSchema";
import * as GroupBuildEditUiSchema from "../../../../src/groups/_internal/GroupUiSchemaEdit";
import * as GroupBuildSettingsUiSchema from "../../../../src/groups/_internal/GroupUiSchemaSettings";

import { InitiativeTemplateEditorTypes } from "../../../../src/initiativeTemplates/_internal/InitiativeTemplateSchema";
import * as InitiativeTemplateBuildEditUiSchema from "../../../../src/initiativeTemplates/_internal/InitiativeTemplateUiSchemaEdit";

describe("getEntityEditorSchemas: ", () => {
  let uiSchemaBuildFnSpy: any;
  afterEach(() => {
    uiSchemaBuildFnSpy.calls.reset();
  });
  [
    { type: ProjectEditorTypes[0], buildFn: ProjectBuildCreateUiSchema },
    { type: ProjectEditorTypes[1], buildFn: ProjectBuildEditUiSchema },
    { type: InitiativeEditorTypes[0], buildFn: InitiativeBuildEditUiSchema },
    { type: InitiativeEditorTypes[1], buildFn: InitiativeBuildCreateUiSchema },
    { type: SiteEditorTypes[0], buildFn: SiteBuildEditUiSchema },
    { type: SiteEditorTypes[1], buildFn: SiteBuildCreateUiSchema },
    { type: DiscussionEditorTypes[0], buildFn: DiscussionBuildEditUiSchema },
    { type: DiscussionEditorTypes[1], buildFn: DiscussionBuildCreateUiSchema },
    { type: ContentEditorTypes[0], buildFn: ContentBuildEditUiSchema },
    { type: PageEditorTypes[0], buildFn: PageBuildEditUiSchema },
    { type: GroupEditorTypes[0], buildFn: GroupBuildEditUiSchema },
    { type: GroupEditorTypes[1], buildFn: GroupBuildSettingsUiSchema },
    {
      type: InitiativeTemplateEditorTypes[0],
      buildFn: InitiativeTemplateBuildEditUiSchema,
    },
  ].forEach(async ({ type, buildFn }) => {
    it("returns a schema & uiSchema for a given entity and editor type", async () => {
      uiSchemaBuildFnSpy = spyOn(buildFn, "buildUiSchema").and.returnValue(
        Promise.resolve({})
      );
      const { schema, uiSchema } = await getEntityEditorSchemas(
        "some.scope",
        type,
        {} as any,
        {} as any
      );

      expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
      expect(schema).toBeDefined();
      expect(uiSchema).toBeDefined();
    });
  });
  it("filters the schemas to the uiSchema elements before returning", async () => {
    const filterSchemaToUiSchemaSpy = spyOn(
      filterSchemaModule,
      "filterSchemaToUiSchema"
    ).and.callThrough();
    uiSchemaBuildFnSpy = spyOn(
      ProjectBuildEditUiSchema,
      "buildUiSchema"
    ).and.returnValue({});

    await getEntityEditorSchemas(
      "some.scope",
      "hub:project:edit",
      {} as any,
      {} as any
    );

    expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
  });
});
