/* eslint-disable no-case-declarations */
import { cloneObject } from "../../../util";
import { HubEntity } from "../../types/HubEntity";
import {
  CardEditorType,
  EditorType,
  IConfigurationSchema,
  IUiSchema,
  IEditorConfig,
  IConfigurationValues,
  IEntityEditorModuleType,
} from "../types";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { SiteEditorType } from "../../../sites/_internal/siteEditorTypes";
import { ProjectEditorType } from "../../../projects/_internal/projectEditorTypes";
import { InitiativeEditorType } from "../../../initiatives/_internal/initiativeEditorTypes";
import { DiscussionEditorType } from "../../../discussions/_internal/discussionEditorTypes";
import { ChannelEditorType } from "../../../channels/_internal/channelEditorTypes";
import { PageEditorType } from "../../../pages/_internal/pageEditorTypes";
import { ContentEditorType } from "../../../content/_internal/contentEditorTypes";
import { TemplateEditorType } from "../../../templates/_internal/templateEditorTypes";
import { GroupEditorType } from "../../../groups/_internal/groupEditorTypes";
import {
  CardEditorOptions,
  EditorOptions,
  EntityEditorOptions,
} from "./EditorOptions";
import type { IArcGISContext } from "../../../types/IArcGISContext";
import { InitiativeTemplateEditorType } from "../../../initiative-templates/_internal/initiativeTemplateEditorTypes";
import { getCardEditorSchemas } from "./getCardEditorSchemas";
import { EventEditorType } from "../../../events/_internal/eventEditorTypes";
import { UserEditorType } from "../../../users/_internal/userEditorTypes";
import { addDynamicSlugValidation } from "./addDynamicSlugValidation";
import { getSiteSchema } from "../../../sites/_internal/SiteSchema";
import { DiscussionSchema } from "../../../discussions/_internal/DiscussionSchema";
import { ChannelSchema } from "../../../channels/_internal/ChannelSchema";
import { ProjectSchema } from "../../../projects/_internal/ProjectSchema";
import { InitiativeSchema } from "../../../initiatives/_internal/InitiativeSchema";
import { PageSchema } from "../../../pages/_internal/PageSchema";
import { ContentSchema } from "../../../content/_internal/ContentSchema";
import { TemplateSchema } from "../../../templates/_internal/TemplateSchema";
import { GroupSchema } from "../../../groups/_internal/GroupSchema";
import { InitiativeTemplateSchema } from "../../../initiative-templates/_internal/InitiativeTemplateSchema";
import * as buildSiteUiSchemaEdit from "../../../sites/_internal/SiteUiSchemaEdit";
import * as buildSiteUiSchemaCreate from "../../../sites/_internal/SiteUiSchemaCreate";
import * as buildSiteUiSchemaFollowers from "../../../sites/_internal/SiteUiSchemaFollowers";
import * as buildSiteUiSchemaSettings from "../../../sites/_internal/SiteUiSchemaSettings";
import * as buildSiteUiSchemaAssistant from "../../../sites/_internal/SiteUiSchemaAssistant";
import * as buildSiteUiSchemaDiscussionSettings from "../../../core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";
import * as buildDiscussionUiSchemaEdit from "../../../discussions/_internal/DiscussionUiSchemaEdit";
import * as buildDiscussionUiSchemaCreate from "../../../discussions/_internal/DiscussionUiSchemaCreate";
import * as buildDiscussionUiSchemaSettings from "../../../discussions/_internal/DiscussionUiSchemaSettings";
import * as buildDiscussionUiSchemaDiscussionSettings from "../../../core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";
import * as buildChannelUiSchemaEdit from "../../../channels/_internal/ChannelUiSchemaEdit";
import * as buildChannelUiSchemaCreate from "../../../channels/_internal/ChannelUiSchemaCreate";
import * as buildProjectUiSchemaEdit from "../../../projects/_internal/ProjectUiSchemaEdit";
import * as buildProjectUiSchemaCreate from "../../../projects/_internal/ProjectUiSchemaCreate";
import * as buildProjectUiSchemaCreate2 from "../../../projects/_internal/ProjectUiSchemaCreate2";
import * as buildProjectUiSchemaMetrics from "./metrics/ProjectUiSchemaMetrics";
import * as buildProjectUiSchemaSettings from "../../../projects/_internal/ProjectUiSchemaSettings";
import * as buildInitiativeUiSchemaEdit from "../../../initiatives/_internal/InitiativeUiSchemaEdit";
import * as buildInitiativeUiSchemaCreate from "../../../initiatives/_internal/InitiativeUiSchemaCreate";
import * as buildInitiativeUiSchemaCreate2 from "../../../initiatives/_internal/InitiativeUiSchemaCreate2";
import * as buildInitiativeUiSchemaMetrics from "./metrics/InitiativeUiSchemaMetrics";
import * as buildInitiativeUiSchemaAssociations from "../../../initiatives/_internal/InitiativeUiSchemaAssociations";
import * as buildInitiativeUiSchemaSettings from "../../../initiatives/_internal/InitiativeUiSchemaSettings";
import * as buildPageUiSchemaEdit from "../../../pages/_internal/PageUiSchemaEdit";
import * as buildPageUiSchemaCreate from "../../../pages/_internal/PageUiSchemaCreate";
import * as buildContentUiSchemaEdit from "../../../content/_internal/ContentUiSchemaEdit";
import * as buildContentUiSchemaSettings from "../../../content/_internal/ContentUiSchemaSettings";
import * as buildContentUiSchemaDiscussionSettings from "../../../core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";
import * as buildContentUiSchemaDiscussionSettingsCompact from "../../../core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettingsCompact";
import * as buildTemplateUiSchemaEdit from "../../../templates/_internal/TemplateUiSchemaEdit";
import * as buildGroupUiSchemaCreateFollowers from "../../../groups/_internal/GroupUiSchemaCreateFollowers";
import * as builddGroupUiSchemaCreateAssociation from "../../../groups/_internal/GroupUiSchemaCreateAssociation";
import * as builddGroupUiSchemaCreateView from "../../../groups/_internal/GroupUiSchemaCreateView";
import * as builddGroupUiSchemaCreateEdit from "../../../groups/_internal/GroupUiSchemaCreateEdit";
import * as builddGroupUiSchemaCreate from "../../../groups/_internal/GroupUiSchemaCreate";
import * as builddGroupUiSchemaEdit from "../../../groups/_internal/GroupUiSchemaEdit";
import * as builddGroupUiSchemaSettings from "../../../groups/_internal/GroupUiSchemaSettings";
import * as builddGroupUiSchemaDiscussionSettings from "../../../core/schemas/internal/discussions/EntityUiSchemaDiscussionsSettings";
import * as buildEventSchemaCreate from "../../../events/_internal/EventSchemaCreate";
import * as buildEventSchemaEdit from "../../../events/_internal/EventSchemaEdit";
import * as buildEventSchemaRegistrants from "../../../events/_internal/EventSchemaAttendeesSettings";
import * as buildEventUiSchemaCreate from "../../../events/_internal/EventUiSchemaCreate";
import * as buildEventUiSchemaEdit from "../../../events/_internal/EventUiSchemaEdit";
import * as buildEventUiSchemaRegistrants from "../../../events/_internal/EventUiSchemaAttendeesSettings";
import * as buildInitiativeTemplateUiSchemaEdit from "../../../initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";
import * as buildUserUiSchemaSettings from "../../../users/_internal/UserUiSchemaSettings";
import { UserSchema } from "../../../users/_internal/UserSchema";

/**
 * get the editor schema and uiSchema defined for an editor (either an entity or a card).
 * The schema and uiSchema that are returned can be used to
 * render a form UI (using the configuration editor)
 *
 * @param i18nScope translation scope to be interpolated into the uiSchema
 * @param type editor type - corresonds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 * @returns
 */
export async function getEditorSchemas(
  i18nScope: string,
  type: EditorType,
  options: EditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig> {
  const editorType = type.split(":")[1];

  // schema and uiSchema are dynamically imported based on
  // the entity type and the provided editor type
  let schema: IConfigurationSchema;
  let uiSchema: IUiSchema;
  let defaults: IConfigurationValues;

  switch (editorType) {
    case "site": {
      const MODULES: Record<SiteEditorType, IEntityEditorModuleType> = {
        "hub:site:edit": buildSiteUiSchemaEdit,
        "hub:site:create": buildSiteUiSchemaCreate,
        "hub:site:followers": buildSiteUiSchemaFollowers,
        "hub:site:settings": buildSiteUiSchemaSettings,
        "hub:site:assistant": buildSiteUiSchemaAssistant,
        "hub:site:settings:discussions": buildSiteUiSchemaDiscussionSettings,
      };
      const module: IEntityEditorModuleType = MODULES[type as SiteEditorType];
      // site id is needed for validation of site url
      schema = getSiteSchema((options as HubEntity).id, context);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when implementing buildDefaults for sites, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "discussion": {
      const MODULES: Record<DiscussionEditorType, IEntityEditorModuleType> = {
        "hub:discussion:edit": buildDiscussionUiSchemaEdit,
        "hub:discussion:create": buildDiscussionUiSchemaCreate,
        "hub:discussion:settings": buildDiscussionUiSchemaSettings,
        "hub:discussion:settings:discussions":
          buildDiscussionUiSchemaDiscussionSettings,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as DiscussionEditorType];
      schema = cloneObject(DiscussionSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for discussions, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "channel": {
      const MODULES: Record<ChannelEditorType, IEntityEditorModuleType> = {
        "hub:channel:edit": buildChannelUiSchemaEdit,
        "hub:channel:create": buildChannelUiSchemaCreate,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as ChannelEditorType];
      schema = cloneObject(ChannelSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for discussions, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "project": {
      const MODULES: Record<ProjectEditorType, IEntityEditorModuleType> = {
        "hub:project:edit": buildProjectUiSchemaEdit,
        "hub:project:create": buildProjectUiSchemaCreate,
        "hub:project:create2": buildProjectUiSchemaCreate2,
        "hub:project:metrics": buildProjectUiSchemaMetrics,
        "hub:project:settings": buildProjectUiSchemaSettings,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as ProjectEditorType];
      schema = cloneObject(ProjectSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "initiative": {
      const MODULES: Record<InitiativeEditorType, IEntityEditorModuleType> = {
        "hub:initiative:edit": buildInitiativeUiSchemaEdit,
        "hub:initiative:create": buildInitiativeUiSchemaCreate,
        "hub:initiative:create2": buildInitiativeUiSchemaCreate2,
        "hub:initiative:metrics": buildInitiativeUiSchemaMetrics,
        "hub:initiative:associations": buildInitiativeUiSchemaAssociations,
        "hub:initiative:settings": buildInitiativeUiSchemaSettings,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as InitiativeEditorType];
      schema = cloneObject(InitiativeSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "page": {
      const MODULES: Record<PageEditorType, IEntityEditorModuleType> = {
        "hub:page:edit": buildPageUiSchemaEdit,
        "hub:page:create": buildPageUiSchemaCreate,
      };
      const module: IEntityEditorModuleType = MODULES[type as PageEditorType];
      schema = cloneObject(PageSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for pages, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "content": {
      const MODULES: Record<ContentEditorType, IEntityEditorModuleType> = {
        "hub:content:edit": buildContentUiSchemaEdit,
        "hub:content:settings": buildContentUiSchemaSettings,
        "hub:content:settings:discussions":
          buildContentUiSchemaDiscussionSettings,
        "hub:content:settings:discussions:compact":
          buildContentUiSchemaDiscussionSettingsCompact,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as ContentEditorType];
      schema = cloneObject(ContentSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for content, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "template": {
      const MODULES: Record<TemplateEditorType, IEntityEditorModuleType> = {
        "hub:template:edit": buildTemplateUiSchemaEdit,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as TemplateEditorType];
      schema = cloneObject(TemplateSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for templates, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "group": {
      const MODULES: Record<GroupEditorType, IEntityEditorModuleType> = {
        "hub:group:create:followers": buildGroupUiSchemaCreateFollowers,
        "hub:group:create:association": builddGroupUiSchemaCreateAssociation,
        "hub:group:create:view": builddGroupUiSchemaCreateView,
        "hub:group:create:edit": builddGroupUiSchemaCreateEdit,
        "hub:group:create": builddGroupUiSchemaCreate,
        "hub:group:edit": builddGroupUiSchemaEdit,
        "hub:group:settings": builddGroupUiSchemaSettings,
        "hub:group:settings:discussions": builddGroupUiSchemaDiscussionSettings,
      };
      const module: IEntityEditorModuleType = MODULES[type as GroupEditorType];
      schema = cloneObject(GroupSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "event": {
      const SCHEMA_MODULES: Record<
        EventEditorType,
        { buildSchema(): IConfigurationSchema }
      > = {
        "hub:event:create": buildEventSchemaCreate,
        "hub:event:edit": buildEventSchemaEdit,
        "hub:event:registrants": buildEventSchemaRegistrants,
      };
      const UI_SCHEMA_MODULES: Record<
        EventEditorType,
        IEntityEditorModuleType
      > = {
        "hub:event:create": buildEventUiSchemaCreate,
        "hub:event:edit": buildEventUiSchemaEdit,
        "hub:event:registrants": buildEventUiSchemaRegistrants,
      };
      schema = SCHEMA_MODULES[type as EventEditorType].buildSchema();
      const uiSchemaModule: IEntityEditorModuleType =
        UI_SCHEMA_MODULES[type as EventEditorType];
      uiSchema = await uiSchemaModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );
      break;
    }
    // ----------------------------------------------------
    case "initiativeTemplate": {
      const MODULES: Record<
        InitiativeTemplateEditorType,
        IEntityEditorModuleType
      > = {
        "hub:initiativeTemplate:edit": buildInitiativeTemplateUiSchemaEdit,
      };
      const module: IEntityEditorModuleType =
        MODULES[type as InitiativeTemplateEditorType];
      schema = cloneObject(InitiativeTemplateSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for initiative templates, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "user": {
      const MODULES: Record<UserEditorType, IEntityEditorModuleType> = {
        "hub:user:settings": buildUserUiSchemaSettings,
      };
      const module: IEntityEditorModuleType = MODULES[type as UserEditorType];
      schema = cloneObject(UserSchema);
      uiSchema = await module.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for users, remove the ignore line

      /* istanbul ignore next @preserve */
      if (module.buildDefaults) {
        defaults = await module.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    }
    // ----------------------------------------------------
    case "card": {
      const result = await getCardEditorSchemas(
        i18nScope,
        type as CardEditorType,
        options as CardEditorOptions,
        context
      );
      schema = result.schema;
      uiSchema = result.uiSchema;
      defaults = result.defaults;
    }
  }

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema, uiSchema);

  // if schema includes slug, add conditional validation
  schema = addDynamicSlugValidation(schema, options);

  return Promise.resolve({ schema, uiSchema, defaults });
}
