import { getEditorSchemas } from "../../../../src/core/schemas/internal/getEditorSchemas";
import * as filterSchemaModule from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";
import * as checkPermissionModule from "../../../../src/permissions/checkPermission";
import {
  EditorType,
  IEditorModuleType,
  validCardEditorTypes,
} from "../../../../src/core/schemas/types";

import { ProjectEditorTypes } from "../../../../src/projects/_internal/projectEditorTypes";
import * as ProjectBuildEditUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaEdit";
import * as ProjectBuildCreateUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaCreate";
import * as ProjectBuildCreateUiSchema2 from "../../../../src/projects/_internal/ProjectUiSchemaCreate2";
import * as ProjectBuildMetricUiSchema from "../../../../src/core/schemas/internal/metrics/ProjectUiSchemaMetrics";
import * as ProjectBuildSettingsUiSchema from "../../../../src/projects/_internal/ProjectUiSchemaSettings";

import { InitiativeEditorTypes } from "../../../../src/initiatives/_internal/initiativeEditorTypes";
import * as InitiativeBuildEditUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaEdit";
import * as InitiativeBuildCreateUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaCreate";
import * as InitiativeBuildCreateUiSchema2 from "../../../../src/initiatives/_internal/InitiativeUiSchemaCreate2";
import * as InitiativeBuildMetricUiSchema from "../../../../src/core/schemas/internal/metrics/InitiativeUiSchemaMetrics";
import * as InitiativeBuildAssociationsUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaAssociations";
import * as InitiativeBuildSettingsUiSchema from "../../../../src/initiatives/_internal/InitiativeUiSchemaSettings";

import { SiteEditorTypes } from "../../../../src/sites/_internal/siteEditorTypes";
import * as SiteBuildEditUiSchema from "../../../../src/sites/_internal/SiteUiSchemaEdit";
import * as SiteBuildCreateUiSchema from "../../../../src/sites/_internal/SiteUiSchemaCreate";
import * as SiteBuildFollowersUiSchema from "../../../../src/sites/_internal/SiteUiSchemaFollowers";
import * as SiteBuildTelemetryUiSchema from "../../../../src/sites/_internal/SiteUiSchemaSettings";
import * as SiteBuildAssistantUiSchema from "../../../../src/sites/_internal/SiteUiSchemaAssistant";

import { DiscussionEditorTypes } from "../../../../src/discussions/_internal/discussionEditorTypes";
import * as DiscussionBuildEditUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaEdit";
import * as DiscussionBuildCreateUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaCreate";
import * as DiscussionBuildSettingsUiSchema from "../../../../src/discussions/_internal/DiscussionUiSchemaSettings";
import * as EntityBuildDiscussionSettingsUiSchema from "../../../../src/core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";
import * as EntityUiSchemaDiscussionsSettingsCompact from "../../../../src/core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettingsCompact";

import { ChannelEditorTypes } from "../../../../src/channels/_internal/channelEditorTypes";
import * as ChannelBuildEditUiSchema from "../../../../src/channels/_internal/ChannelUiSchemaEdit";
import * as ChannelBuildCreateUiSchema from "../../../../src/channels/_internal/ChannelUiSchemaCreate";

import { ContentEditorTypes } from "../../../../src/content/_internal/contentEditorTypes";
import * as ContentBuildEditUiSchema from "../../../../src/content/_internal/ContentUiSchemaEdit";
import * as ContentBuildSettingsUiSchema from "../../../../src/content/_internal/ContentUiSchemaSettings";

import { PageEditorTypes } from "../../../../src/pages/_internal/pageEditorTypes";
import * as PageBuildEditUiSchema from "../../../../src/pages/_internal/PageUiSchemaEdit";
import * as PageBuildCreateUiSchema from "../../../../src/pages/_internal/PageUiSchemaCreate";

import { TemplateEditorTypes } from "../../../../src/templates/_internal/templateEditorTypes";
import * as TemplateBuildEditUiSchema from "../../../../src/templates/_internal/TemplateUiSchemaEdit";

import { GroupEditorTypes } from "../../../../src/groups/_internal/groupEditorTypes";
import * as GroupBuildEditUiSchema from "../../../../src/groups/_internal/GroupUiSchemaEdit";
import * as GroupBuildSettingsUiSchema from "../../../../src/groups/_internal/GroupUiSchemaSettings";
import * as GroupBuildCreateFollowersUiSchema from "../../../../src/groups/_internal/GroupUiSchemaCreateFollowers";
import * as GroupBuildCreateAssociationUiSchema from "../../../../src/groups/_internal/GroupUiSchemaCreateAssociation";
import * as GroupBuildCreateViewUiSchema from "../../../../src/groups/_internal/GroupUiSchemaCreateView";
import * as GroupBuildCreateEditUiSchema from "../../../../src/groups/_internal/GroupUiSchemaCreateEdit";
import * as GroupBuildCreateUiSchema from "../../../../src/groups/_internal/GroupUiSchemaCreate";

import { InitiativeTemplateEditorTypes } from "../../../../src/initiative-templates/_internal/initiativeTemplateEditorTypes";
import * as InitiativeTemplateBuildEditUiSchema from "../../../../src/initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";

import { EventEditorTypes } from "../../../../src/events/_internal/eventEditorTypes";
import * as EventBuildCreateUiSchema from "../../../../src/events/_internal/EventUiSchemaCreate";
import * as EventBuildEditUiSchema from "../../../../src/events/_internal/EventUiSchemaEdit";
import * as EventAttendeesSettingsUiSchema from "../../../../src/events/_internal/EventUiSchemaAttendeesSettings";

import { UserEditorTypes } from "../../../../src/users/_internal/userEditorTypes";
import * as UserBuildUiSchemaSettings from "../../../../src/users/_internal/UserUiSchemaSettings";

import * as statUiSchemaModule from "../../../../src/core/schemas/internal/metrics/StatCardUiSchema";

import { vi } from "vitest";

describe("getEditorSchemas: ", () => {
  let uiSchemaBuildFnSpy: any;
  let defaultsFnSpy: any;
  afterEach(() => {
    // restore any vi spies/mocks
    vi.restoreAllMocks();
  });
  const modules: Array<{ type: EditorType; module: IEditorModuleType }> = [
    { type: ProjectEditorTypes[0], module: ProjectBuildCreateUiSchema },
    { type: ProjectEditorTypes[1], module: ProjectBuildCreateUiSchema2 },
    { type: ProjectEditorTypes[2], module: ProjectBuildEditUiSchema },
    { type: ProjectEditorTypes[3], module: ProjectBuildMetricUiSchema },
    { type: ProjectEditorTypes[4], module: ProjectBuildSettingsUiSchema },

    { type: InitiativeEditorTypes[0], module: InitiativeBuildEditUiSchema },
    { type: InitiativeEditorTypes[1], module: InitiativeBuildCreateUiSchema },
    { type: InitiativeEditorTypes[2], module: InitiativeBuildCreateUiSchema2 },
    { type: InitiativeEditorTypes[3], module: InitiativeBuildMetricUiSchema },
    {
      type: InitiativeEditorTypes[4],
      module: InitiativeBuildAssociationsUiSchema,
    },
    { type: InitiativeEditorTypes[5], module: InitiativeBuildSettingsUiSchema },

    { type: SiteEditorTypes[0], module: SiteBuildEditUiSchema },
    { type: SiteEditorTypes[1], module: SiteBuildCreateUiSchema },
    { type: SiteEditorTypes[2], module: SiteBuildFollowersUiSchema },
    { type: SiteEditorTypes[3], module: SiteBuildTelemetryUiSchema },
    { type: SiteEditorTypes[4], module: SiteBuildAssistantUiSchema },
    { type: SiteEditorTypes[5], module: EntityBuildDiscussionSettingsUiSchema },

    {
      type: InitiativeTemplateEditorTypes[0],
      module: InitiativeTemplateBuildEditUiSchema,
    },

    { type: DiscussionEditorTypes[0], module: DiscussionBuildEditUiSchema },
    { type: DiscussionEditorTypes[1], module: DiscussionBuildCreateUiSchema },
    { type: DiscussionEditorTypes[2], module: DiscussionBuildSettingsUiSchema },

    { type: DiscussionEditorTypes[0], module: DiscussionBuildEditUiSchema },
    { type: DiscussionEditorTypes[1], module: DiscussionBuildCreateUiSchema },
    { type: DiscussionEditorTypes[2], module: DiscussionBuildSettingsUiSchema },
    {
      type: DiscussionEditorTypes[3],
      module: EntityBuildDiscussionSettingsUiSchema,
    },

    { type: ContentEditorTypes[0], module: ContentBuildEditUiSchema },
    { type: ContentEditorTypes[1], module: ContentBuildSettingsUiSchema },
    {
      type: ContentEditorTypes[2],
      module: EntityBuildDiscussionSettingsUiSchema,
    },
    {
      type: ContentEditorTypes[3],
      module: EntityUiSchemaDiscussionsSettingsCompact,
    },

    { type: PageEditorTypes[0], module: PageBuildEditUiSchema },
    { type: PageEditorTypes[1], module: PageBuildCreateUiSchema },

    { type: TemplateEditorTypes[0], module: TemplateBuildEditUiSchema },

    { type: GroupEditorTypes[0], module: GroupBuildEditUiSchema },
    { type: GroupEditorTypes[1], module: GroupBuildSettingsUiSchema },
    {
      type: GroupEditorTypes[2],
      module: EntityBuildDiscussionSettingsUiSchema,
    },
    { type: GroupEditorTypes[3], module: GroupBuildCreateFollowersUiSchema },
    { type: GroupEditorTypes[4], module: GroupBuildCreateAssociationUiSchema },
    { type: GroupEditorTypes[5], module: GroupBuildCreateViewUiSchema },
    { type: GroupEditorTypes[6], module: GroupBuildCreateEditUiSchema },
    { type: GroupEditorTypes[7], module: GroupBuildCreateUiSchema },

    { type: ChannelEditorTypes[0], module: ChannelBuildCreateUiSchema },
    { type: ChannelEditorTypes[1], module: ChannelBuildEditUiSchema },

    {
      type: InitiativeTemplateEditorTypes[0],
      module: InitiativeTemplateBuildEditUiSchema,
    },

    { type: EventEditorTypes[0], module: EventBuildCreateUiSchema },
    { type: EventEditorTypes[1], module: EventBuildEditUiSchema },
    { type: EventEditorTypes[2], module: EventAttendeesSettingsUiSchema },

    { type: UserEditorTypes[0], module: UserBuildUiSchemaSettings },

    {
      type: validCardEditorTypes[0],
      module: statUiSchemaModule as IEditorModuleType,
    },
  ];

  modules.forEach(({ type, module }) => {
    it(`returns a schema & uiSchema for a given entity and editor type ${type}`, async () => {
      uiSchemaBuildFnSpy = vi
        .spyOn(module, "buildUiSchema")
        .mockResolvedValue({} as any);
      if (module.buildDefaults) {
        defaultsFnSpy = vi
          .spyOn(module, "buildDefaults")
          .mockResolvedValue({} as any);
      }

      vi.spyOn(checkPermissionModule, "checkPermission").mockReturnValue({
        access: true,
        policy: undefined,
        checks: [],
        code: 200,
        response: undefined,
      } as any);

      const { schema, uiSchema, defaults } = await getEditorSchemas(
        "some.scope",
        type,
        {} as any,
        {} as any
      );
      expect(uiSchemaBuildFnSpy).toHaveBeenCalledTimes(1);
      expect(schema).toBeDefined();
      expect(uiSchema).toBeDefined();

      if (module.buildDefaults) {
        expect(defaultsFnSpy).toHaveBeenCalledTimes(1);
        expect(defaults).toBeDefined();
      }
    });
  });
  it("filters the schemas to the uiSchema elements before returning", async () => {
    const filterSchemaToUiSchemaSpy = vi
      .spyOn(filterSchemaModule, "filterSchemaToUiSchema")
      .mockImplementation((s: any) => s);
    uiSchemaBuildFnSpy = vi
      .spyOn(ProjectBuildEditUiSchema, "buildUiSchema")
      .mockReturnValue({} as any);
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
