import { getEditorSchemas } from "../../../../src/core/schemas/internal/getEditorSchemas";
import * as filterSchemaModule from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";

import { ProjectEditorTypes } from "../../../../src/projects/_internal/ProjectSchema";
import * as ProjectBuildEditUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaEdit";
import * as ProjectBuildCreateUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaCreate";
import * as ProjectBuildMetricUiSchema from "../../../../src/core/schemas/internal/metrics/ProjectUiSchemaMetrics";

import { InitiativeEditorTypes } from "../../../../src/initiatives/_internal/InitiativeSchema";
import * as InitiativeBuildEditUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaEdit";
import * as InitiativeBuildCreateUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaCreate";

import { SiteEditorTypes } from "../../../../src/sites/_internal/SiteSchema";
import * as SiteBuildEditUiSchema from "../../../../src/sites/_internal/SiteUiSchemaEdit";
import * as SiteBuildCreateUiSchema from "../../../../src/sites/_internal/SiteUiSchemaCreate";
import * as SiteBuildFollowersUiSchema from "../../../../src/sites/_internal/SiteUiSchemaFollowers";
import * as SiteBuildDiscussionsUiSchema from "../../../../src/sites/_internal/SiteUiSchemaDiscussions";
import * as SiteBuildTelemetryUiSchema from "../../../../src/sites/_internal/SiteUiSchemaSettings";

import { DiscussionEditorTypes } from "../../../../src/discussions/_internal/DiscussionSchema";
import * as DiscussionBuildEditUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaEdit";
import * as DiscussionBuildCreateUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaCreate";
import * as DiscussionBuildSettingsUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaSettings";

import { ContentEditorTypes } from "../../../../src/content/_internal/ContentSchema";
import * as ContentBuildEditUiSchema from "../../../../src/content/_internal/ContentUiSchemaEdit";
import * as ContentBuildSettingsUiSchema from "../../../../src/content/_internal/ContentUiSchemaSettings";
import * as ContentBuildDiscussionsUiSchema from "../../../../src/content/_internal/ContentUiSchemaDiscussions";

import { PageEditorTypes } from "../../../../src/pages/_internal/PageSchema";
import * as PageBuildEditUiSchema from "../../../../src/pages/_internal/PageUiSchemaEdit";

import { TemplateEditorTypes } from "../../../../src/templates/_internal/TemplateSchema";
import * as TemplateBuildEditUiSchema from "../../../../src/templates/_internal/TemplateUiSchemaEdit";

import { GroupEditorTypes } from "../../../../src/groups/_internal/GroupSchema";
import * as GroupBuildEditUiSchema from "../../../../src/groups/_internal/GroupUiSchemaEdit";
import * as GroupBuildSettingsUiSchema from "../../../../src/groups/_internal/GroupUiSchemaSettings";
import * as GroupBuildDiscussionsUiSchema from "../../../../src/groups/_internal/GroupUiSchemaDiscussions";

import { InitiativeTemplateEditorTypes } from "../../../../src/initiative-templates/_internal/InitiativeTemplateSchema";
import * as InitiativeTemplateBuildEditUiSchema from "../../../../src/initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";

import { validCardEditorTypes } from "../../../../src/core/schemas/types";
import * as statUiSchemaModule from "../../../../src/core/schemas/internal/metrics/StatCardUiSchema";

describe("getEditorSchemas: ", () => {
  let uiSchemaBuildFnSpy: any;
  afterEach(() => {
    uiSchemaBuildFnSpy.calls.reset();
  });
  [
    { type: ProjectEditorTypes[0], buildFn: ProjectBuildCreateUiSchema },
    { type: ProjectEditorTypes[1], buildFn: ProjectBuildEditUiSchema },
    { type: ProjectEditorTypes[2], buildFn: ProjectBuildMetricUiSchema },
    { type: InitiativeEditorTypes[0], buildFn: InitiativeBuildEditUiSchema },
    { type: InitiativeEditorTypes[1], buildFn: InitiativeBuildCreateUiSchema },
    { type: SiteEditorTypes[0], buildFn: SiteBuildEditUiSchema },
    { type: SiteEditorTypes[1], buildFn: SiteBuildCreateUiSchema },
    { type: SiteEditorTypes[2], buildFn: SiteBuildFollowersUiSchema },
    { type: SiteEditorTypes[3], buildFn: SiteBuildDiscussionsUiSchema },
    { type: SiteEditorTypes[4], buildFn: SiteBuildTelemetryUiSchema },
    { type: DiscussionEditorTypes[0], buildFn: DiscussionBuildEditUiSchema },
    { type: DiscussionEditorTypes[1], buildFn: DiscussionBuildCreateUiSchema },
    {
      type: DiscussionEditorTypes[2],
      buildFn: DiscussionBuildSettingsUiSchema,
    },
    { type: ContentEditorTypes[0], buildFn: ContentBuildEditUiSchema },
    { type: ContentEditorTypes[1], buildFn: ContentBuildSettingsUiSchema },
    { type: ContentEditorTypes[2], buildFn: ContentBuildDiscussionsUiSchema },
    { type: PageEditorTypes[0], buildFn: PageBuildEditUiSchema },
    { type: TemplateEditorTypes[0], buildFn: TemplateBuildEditUiSchema },
    { type: GroupEditorTypes[0], buildFn: GroupBuildEditUiSchema },
    { type: GroupEditorTypes[1], buildFn: GroupBuildSettingsUiSchema },
    {
      type: InitiativeTemplateEditorTypes[0],
      buildFn: InitiativeTemplateBuildEditUiSchema,
    },
    { type: GroupEditorTypes[2], buildFn: GroupBuildDiscussionsUiSchema },
    { type: validCardEditorTypes[0], buildFn: statUiSchemaModule },
  ].forEach(async ({ type, buildFn }) => {
    it("returns a schema & uiSchema for a given entity and editor type", async () => {
      uiSchemaBuildFnSpy = spyOn(buildFn, "buildUiSchema").and.returnValue(
        Promise.resolve({})
      );
      const { schema, uiSchema } = await getEditorSchemas(
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

    await getEditorSchemas(
      "some.scope",
      "hub:project:edit",
      {} as any,
      {} as any
    );

    expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
    expect(filterSchemaToUiSchemaSpy).toHaveBeenCalledTimes(1);
  });
});
