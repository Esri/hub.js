import { cloneObject } from "../../../util";
import {
  CardEditorType,
  EditorType,
  IConfigurationSchema,
  IUiSchema,
  IEditorConfig,
  IConfigurationValues,
  IEditorModuleType,
} from "../types";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { SiteEditorType } from "../../../sites/_internal/SiteSchema";
import { ProjectEditorType } from "../../../projects/_internal/ProjectSchema";
import { InitiativeEditorType } from "../../../initiatives/_internal/InitiativeSchema";
import { DiscussionEditorType } from "../../../discussions/_internal/DiscussionSchema";
import { PageEditorType } from "../../../pages/_internal/PageSchema";
import { ContentEditorType } from "../../../content/_internal/ContentSchema";
import { TemplateEditorType } from "../../../templates/_internal/TemplateSchema";
import { GroupEditorType } from "../../../groups/_internal/GroupSchema";
import {
  CardEditorOptions,
  EditorOptions,
  EntityEditorOptions,
} from "./EditorOptions";
import { IArcGISContext } from "../../../ArcGISContext";
import { InitiativeTemplateEditorType } from "../../../initiative-templates/_internal/InitiativeTemplateSchema";
import { getCardEditorSchemas } from "./getCardEditorSchemas";

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
      const { SiteSchema } = await import(
        "../../../sites/_internal/SiteSchema"
      );
      schema = cloneObject(SiteSchema);

      const siteModule: IEditorModuleType = await {
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

      break;
    // ----------------------------------------------------
    case "discussion":
      const { DiscussionSchema } = await import(
        "../../../discussions/_internal/DiscussionSchema"
      );
      schema = cloneObject(DiscussionSchema);

      const discussionModule: IEditorModuleType = await {
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

      break;
    // ----------------------------------------------------
    case "project":
      const { ProjectSchema } = await import(
        "../../../projects/_internal/ProjectSchema"
      );
      schema = cloneObject(ProjectSchema);

      const projectModule: IEditorModuleType = await {
        "hub:project:edit": () =>
          import("../../../projects/_internal/ProjectUiSchemaEdit"),
        "hub:project:create": () =>
          import("../../../projects/_internal/ProjectUiSchemaCreate"),
        "hub:project:metrics": () => import("./metrics/ProjectUiSchemaMetrics"),
      }[type as ProjectEditorType]();
      uiSchema = await projectModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      break;
    // ----------------------------------------------------
    case "initiative":
      const { InitiativeSchema } = await import(
        "../../../initiatives/_internal/InitiativeSchema"
      );
      schema = cloneObject(InitiativeSchema);

      const initiativeModule: IEditorModuleType = await {
        "hub:initiative:edit": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaEdit"),
        "hub:initiative:create": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaCreate"),
      }[type as InitiativeEditorType]();
      uiSchema = await initiativeModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      break;
    // ----------------------------------------------------
    case "page":
      const { PageSchema } = await import(
        "../../../pages/_internal/PageSchema"
      );
      schema = cloneObject(PageSchema);

      const pageModule: IEditorModuleType = await {
        "hub:page:edit": () =>
          import("../../../pages/_internal/PageUiSchemaEdit"),
      }[type as PageEditorType]();
      uiSchema = await pageModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      break;
    // ----------------------------------------------------
    case "content":
      const { ContentSchema } = await import(
        "../../../content/_internal/ContentSchema"
      );
      schema = cloneObject(ContentSchema);

      const contentModule: IEditorModuleType = await {
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

      break;
    // ----------------------------------------------------
    case "template":
      const { TemplateSchema } = await import(
        "../../../templates/_internal/TemplateSchema"
      );
      schema = cloneObject(TemplateSchema);

      const templateModule: IEditorModuleType = await {
        "hub:template:edit": () =>
          import("../../../templates/_internal/TemplateUiSchemaEdit"),
      }[type as TemplateEditorType]();
      uiSchema = await templateModule.buildUiSchema(
        i18nScope,
        options as EntityEditorOptions,
        context
      );

      break;
    // ----------------------------------------------------
    case "group":
      const { GroupSchema } = await import(
        "../../../groups/_internal/GroupSchema"
      );
      schema = cloneObject(GroupSchema);

      const groupModule: IEditorModuleType = await {
        "hub:group:create:followers": () =>
          import("../../../groups/_internal/GroupUiSchemaCreateFollowers"),
        "hub:group:create:association": () =>
          import("../../../groups/_internal/GroupUiSchemaCreateAssociation"),
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

      // TODO: check if this actually works as a check?
      if (groupModule.buildDefaults) {
        defaults = await groupModule.buildDefaults(
          i18nScope,
          options as EntityEditorOptions,
          context
        );
      }

      break;

    case "initiativeTemplate":
      const { InitiativeTemplateSchema } = await import(
        "../../../initiative-templates/_internal/InitiativeTemplateSchema"
      );
      schema = cloneObject(InitiativeTemplateSchema);
      const initiativeTemplateModule: IEditorModuleType = await {
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
  }

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema, uiSchema);

  return Promise.resolve({ schema, uiSchema, defaults });
}
