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
import { SiteEditorType } from "../../../sites/_internal/SiteSchema";
import { ProjectEditorType } from "../../../projects/_internal/ProjectSchema";
import { InitiativeEditorType } from "../../../initiatives/_internal/InitiativeSchema";
import { DiscussionEditorType } from "../../../discussions/_internal/DiscussionSchema";
import { ChannelEditorType } from "../../../channels/_internal/ChannelSchema";
import { PageEditorType } from "../../../pages/_internal/PageSchema";
import { ContentEditorType } from "../../../content/_internal/ContentSchema";
import { TemplateEditorType } from "../../../templates/_internal/TemplateSchema";
import { GroupEditorType } from "../../../groups/_internal/GroupSchema";
import {
  CardEditorOptions,
  EditorOptions,
  EntityEditorOptions,
} from "./EditorOptions";
import type { IArcGISContext } from "../../../types/IArcGISContext";
import { InitiativeTemplateEditorType } from "../../../initiative-templates/_internal/InitiativeTemplateSchema";
import { getCardEditorSchemas } from "./getCardEditorSchemas";
import { SurveyEditorType } from "../../../surveys/_internal/SurveySchema";
import { EventEditorType } from "../../../events/_internal/EventSchemaCreate";
import { UserEditorType } from "../../../users/_internal/UserSchema";
import { addDynamicSlugValidation } from "./addDynamicSlugValidation";

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
    case "site":
      const { getSiteSchema } = await import(
        "../../../sites/_internal/SiteSchema"
      );
      // site id is needed for validation of site url
      schema = getSiteSchema((options as HubEntity).id);

      const siteModule: IEntityEditorModuleType = await {
        "hub:site:edit": () =>
          import("../../../sites/_internal/SiteUiSchemaEdit"),
        "hub:site:create": () =>
          import("../../../sites/_internal/SiteUiSchemaCreate"),
        "hub:site:followers": () =>
          import("../../../sites/_internal/SiteUiSchemaFollowers"),
        "hub:site:discussions": () =>
          import("../../../sites/_internal/SiteUiSchemaDiscussions"),
        "hub:site:settings": () =>
          import("../../../sites/_internal/SiteUiSchemaSettings"),
      }[type as SiteEditorType]();
      uiSchema = await siteModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when implementing buildDefaults for sites, remove the ignore line

      /* istanbul ignore next */
      if (siteModule.buildDefaults) {
        defaults = await siteModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "discussion":
      const { DiscussionSchema } = await import(
        "../../../discussions/_internal/DiscussionSchema"
      );
      schema = cloneObject(DiscussionSchema);

      const discussionModule: IEntityEditorModuleType = await {
        "hub:discussion:edit": () =>
          import("../../../discussions/_internal/DiscussionUiSchemaEdit"),
        "hub:discussion:create": () =>
          import("../../../discussions/_internal/DiscussionUiSchemaCreate"),
        "hub:discussion:settings": () =>
          import("../../../discussions/_internal/DiscussionUiSchemaSettings"),
      }[type as DiscussionEditorType]();
      uiSchema = await discussionModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for discussions, remove the ignore line

      /* istanbul ignore next */
      if (discussionModule.buildDefaults) {
        defaults = await discussionModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "channel":
      const { ChannelSchema } = await import(
        "../../../channels/_internal/ChannelSchema"
      );
      schema = cloneObject(ChannelSchema);

      const channelModule: IEntityEditorModuleType = await {
        "hub:channel:edit": () =>
          import("../../../channels/_internal/ChannelUiSchemaEdit"),
        "hub:channel:create": () =>
          import("../../../channels/_internal/ChannelUiSchemaCreate"),
      }[type as ChannelEditorType]();
      uiSchema = await channelModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for discussions, remove the ignore line

      /* istanbul ignore next */
      if (channelModule.buildDefaults) {
        defaults = await channelModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "project":
      const { ProjectSchema } = await import(
        "../../../projects/_internal/ProjectSchema"
      );
      schema = cloneObject(ProjectSchema);

      const projectModule: IEntityEditorModuleType = await {
        "hub:project:edit": () =>
          import("../../../projects/_internal/ProjectUiSchemaEdit"),
        "hub:project:create": () =>
          import("../../../projects/_internal/ProjectUiSchemaCreate"),
        "hub:project:create2": () =>
          import("../../../projects/_internal/ProjectUiSchemaCreate2"),
        "hub:project:metrics": () => import("./metrics/ProjectUiSchemaMetrics"),
        "hub:project:settings": () =>
          import("../../../projects/_internal/ProjectUiSchemaSettings"),
      }[type as ProjectEditorType]();
      uiSchema = await projectModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      if (projectModule.buildDefaults) {
        defaults = await projectModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "initiative":
      const { InitiativeSchema } = await import(
        "../../../initiatives/_internal/InitiativeSchema"
      );
      schema = cloneObject(InitiativeSchema);

      const initiativeModule: IEntityEditorModuleType = await {
        "hub:initiative:edit": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaEdit"),
        "hub:initiative:create": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaCreate"),
        "hub:initiative:create2": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaCreate2"),
        "hub:initiative:metrics": () =>
          import("./metrics/InitiativeUiSchemaMetrics"),
        "hub:initiative:associations": () =>
          import(
            "../../../initiatives/_internal/InitiativeUiSchemaAssociations"
          ),
        "hub:initiative:settings": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaSettings"),
      }[type as InitiativeEditorType]();
      uiSchema = await initiativeModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      if (initiativeModule.buildDefaults) {
        defaults = await initiativeModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "page":
      const { PageSchema } = await import(
        "../../../pages/_internal/PageSchema"
      );
      schema = cloneObject(PageSchema);

      const pageModule: IEntityEditorModuleType = await {
        "hub:page:edit": () =>
          import("../../../pages/_internal/PageUiSchemaEdit"),
        "hub:page:create": () =>
          import("../../../pages/_internal/PageUiSchemaCreate"),
      }[type as PageEditorType]();
      uiSchema = await pageModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for pages, remove the ignore line

      /* istanbul ignore next */
      if (pageModule.buildDefaults) {
        defaults = await pageModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "content":
      const { ContentSchema } = await import(
        "../../../content/_internal/ContentSchema"
      );
      schema = cloneObject(ContentSchema);

      const contentModule: IEntityEditorModuleType = await {
        "hub:content:edit": () =>
          import("../../../content/_internal/ContentUiSchemaEdit"),
        "hub:content:discussions": () =>
          import("../../../content/_internal/ContentUiSchemaDiscussions"),
        "hub:content:settings": () =>
          import("../../../content/_internal/ContentUiSchemaSettings"),
      }[type as ContentEditorType]();
      uiSchema = await contentModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for content, remove the ignore line

      /* istanbul ignore next */
      if (contentModule.buildDefaults) {
        defaults = await contentModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "template":
      const { TemplateSchema } = await import(
        "../../../templates/_internal/TemplateSchema"
      );
      schema = cloneObject(TemplateSchema);

      const templateModule: IEntityEditorModuleType = await {
        "hub:template:edit": () =>
          import("../../../templates/_internal/TemplateUiSchemaEdit"),
      }[type as TemplateEditorType]();
      uiSchema = await templateModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for templates, remove the ignore line

      /* istanbul ignore next */
      if (templateModule.buildDefaults) {
        defaults = await templateModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "group":
      const { GroupSchema } = await import(
        "../../../groups/_internal/GroupSchema"
      );
      schema = cloneObject(GroupSchema);

      const groupModule: IEntityEditorModuleType = await {
        "hub:group:create:followers": () =>
          import("../../../groups/_internal/GroupUiSchemaCreateFollowers"),
        "hub:group:create:association": () =>
          import("../../../groups/_internal/GroupUiSchemaCreateAssociation"),
        "hub:group:create:view": () =>
          import("../../../groups/_internal/GroupUiSchemaCreateView"),
        "hub:group:create:edit": () =>
          import("../../../groups/_internal/GroupUiSchemaCreateEdit"),
        "hub:group:create": () =>
          import("../../../groups/_internal/GroupUiSchemaCreate"),
        "hub:group:edit": () =>
          import("../../../groups/_internal/GroupUiSchemaEdit"),
        "hub:group:settings": () =>
          import("../../../groups/_internal/GroupUiSchemaSettings"),
        "hub:group:discussions": () =>
          import("../../../groups/_internal/GroupUiSchemaDiscussions"),
      }[type as GroupEditorType]();
      uiSchema = await groupModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      if (groupModule.buildDefaults) {
        defaults = await groupModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;
    // ----------------------------------------------------
    case "survey":
      const { SurveySchema } = await import(
        "../../../surveys/_internal/SurveySchema"
      );
      schema = cloneObject(SurveySchema);

      const surveyModule = await {
        "hub:survey:edit": () =>
          import("../../../surveys/_internal/SurveyUiSchemaEdit"),
        "hub:survey:settings": () =>
          import("../../../surveys/_internal/SurveyUiSchemaSettings"),
      }[type as SurveyEditorType]();
      uiSchema = await surveyModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );
      break;
    // ----------------------------------------------------
    case "event":
      const eventSchemaModule = await {
        "hub:event:create": () =>
          import("../../../events/_internal/EventSchemaCreate"),
        "hub:event:edit": () =>
          import("../../../events/_internal/EventSchemaEdit"),
        "hub:event:registrants": () =>
          import("../../../events/_internal/EventSchemaAttendeesSettings"),
      }[type as EventEditorType]();
      const eventUiSchemaModule = await {
        "hub:event:create": () =>
          import("../../../events/_internal/EventUiSchemaCreate"),
        "hub:event:edit": () =>
          import("../../../events/_internal/EventUiSchemaEdit"),
        "hub:event:registrants": () =>
          import("../../../events/_internal/EventUiSchemaAttendeesSettings"),
      }[type as EventEditorType]();
      schema = eventSchemaModule.buildSchema();
      uiSchema = await eventUiSchemaModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );
      break;

    case "initiativeTemplate":
      const { InitiativeTemplateSchema } = await import(
        "../../../initiative-templates/_internal/InitiativeTemplateSchema"
      );
      schema = cloneObject(InitiativeTemplateSchema);
      const initiativeTemplateModule: IEntityEditorModuleType = await {
        "hub:initiativeTemplate:edit": () =>
          import(
            "../../../initiative-templates/_internal/InitiativeTemplateUiSchemaEdit"
          ),
      }[type as InitiativeTemplateEditorType]();

      uiSchema = await initiativeTemplateModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for initiative templates, remove the ignore line

      /* istanbul ignore next */
      if (initiativeTemplateModule.buildDefaults) {
        defaults = await initiativeTemplateModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;

    case "user":
      const { UserSchema } = await import(
        "../../../users/_internal/UserSchema"
      );
      schema = cloneObject(UserSchema);

      const userModule: IEntityEditorModuleType = await {
        "hub:user:settings": () =>
          import("../../../users/_internal/UserUiSchemaSettings"),
      }[type as UserEditorType]();

      uiSchema = await userModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      // if we have the buildDefaults fn, then construct the defaults
      // TODO: when first implementing buildDefaults for users, remove the ignore line

      /* istanbul ignore next */
      if (userModule.buildDefaults) {
        defaults = await userModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;

    case "card":
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

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema, uiSchema);

  // if schema includes slug, add conditional validation
  schema = addDynamicSlugValidation(schema, options);

  return Promise.resolve({ schema, uiSchema, defaults });
}
