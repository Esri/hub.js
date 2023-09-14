import { cloneObject } from "../../../util";
import { IEditorConfig } from "../../behaviors/IWithEditorBehavior";
import { EditorType, UiSchemaElementOptions } from "../types";
import { applyUiSchemaElementOptions } from "./applyUiSchemaElementOptions";
import { filterSchemaToUiSchema } from "./filterSchemaToUiSchema";
import { SiteEditorType } from "../../../sites/_internal/SiteSchema";
import { ProjectEditorType } from "../../../projects/_internal/ProjectSchema";
import { InitiativeEditorType } from "../../../initiatives/_internal/InitiativeSchema";
import { DiscussionEditorType } from "../../../discussions/_internal/DiscussionSchema";
import { PageEditorType } from "../../../pages/_internal/PageSchema";
import { ContentEditorType } from "../../../content/_internal/ContentSchema";
import { interpolate } from "../../../items/interpolate";
import { GroupEditorType } from "../../../groups/_internal/GroupSchema";

/**
 * get the editor schema and uiSchema defined for an entity.
 * The schema and uiSchema that are returned can be used to
 * render a form UI (using the configuration editor)
 *
 * @param i18nScope translation scope to be interpolated into the uiSchema
 * @param type editor type - corresonds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 * @returns
 */
export async function getEntityEditorSchemas(
  i18nScope: string,
  type: EditorType,
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> {
  const entityType = type.split(":")[1];

  // schema and uiSchema are dynamically imported based on
  // the entity type and the provided editor type
  let schema;
  let uiSchema;
  switch (entityType) {
    case "site":
      const { SiteSchema } = await import(
        "../../../sites/_internal/SiteSchema"
      );
      schema = cloneObject(SiteSchema);

      ({ uiSchema } = await {
        "hub:site:edit": () =>
          import("../../../sites/_internal/SiteUiSchemaEdit"),
        "hub:site:discussions": () =>
          import("../../../sites/_internal/SiteUiSchemaDiscussions"),
      }[type as SiteEditorType]());
      break;
    // ----------------------------------------------------
    case "discussion":
      const { DiscussionSchema } = await import(
        "../../../discussions/_internal/DiscussionSchema"
      );
      schema = cloneObject(DiscussionSchema);

      ({ uiSchema } = await {
        "hub:discussion:edit": () =>
          import("../../../discussions/_internal/DiscussionUiSchemaEdit"),
        "hub:discussion:create": () =>
          import("../../../discussions/_internal/DiscussionUiSchemaCreate"),
        "hub:discussion:settings": () =>
          import("../../../discussions/_internal/DiscussionUiSchemaSettings"),
      }[type as DiscussionEditorType]());
      break;
    // ----------------------------------------------------
    case "project":
      const { ProjectSchema } = await import(
        "../../../projects/_internal/ProjectSchema"
      );
      schema = cloneObject(ProjectSchema);

      ({ uiSchema } = await {
        "hub:project:edit": () =>
          import("../../../projects/_internal/ProjectUiSchemaEdit"),
        "hub:project:create": () =>
          import("../../../projects/_internal/ProjectUiSchemaCreate"),
      }[type as ProjectEditorType]());
      break;
    // ----------------------------------------------------
    case "initiative":
      const { InitiativeSchema } = await import(
        "../../../initiatives/_internal/InitiativeSchema"
      );
      schema = cloneObject(InitiativeSchema);

      ({ uiSchema } = await {
        "hub:initiative:edit": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaEdit"),
        "hub:initiative:create": () =>
          import("../../../initiatives/_internal/InitiativeUiSchemaCreate"),
      }[type as InitiativeEditorType]());
      break;
    // ----------------------------------------------------
    case "page":
      const { PageSchema } = await import(
        "../../../pages/_internal/PageSchema"
      );
      schema = cloneObject(PageSchema);

      ({ uiSchema } = await {
        "hub:page:edit": () =>
          import("../../../pages/_internal/PageUiSchemaEdit"),
      }[type as PageEditorType]());
      break;
    // ----------------------------------------------------
    case "content":
      const { ContentSchema } = await import(
        "../../../content/_internal/ContentSchema"
      );
      schema = cloneObject(ContentSchema);

      ({ uiSchema } = await {
        "hub:content:edit": () =>
          import("../../../content/_internal/ContentUiSchemaEdit"),
        "hub:content:discussions": () =>
          import("../../../content/_internal/ContentUiSchemaDiscussions"),
      }[type as ContentEditorType]());
      break;
    case "group":
      const { GroupSchema } = await import(
        "../../../groups/_internal/GroupSchema"
      );
      schema = cloneObject(GroupSchema);

      ({ uiSchema } = await {
        "hub:group:edit": () =>
          import("../../../groups/_internal/GroupUiSchemaEdit"),
        "hub:group:settings": () =>
          import("../../../groups/_internal/GroupUiSchemaSettings"),
        "hub:group:discussions": () =>
          import("../../../groups/_internal/GroupUiSchemaDiscussions"),
      }[type as GroupEditorType]());
      break;
  }

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema, uiSchema);
  // apply the options
  uiSchema = applyUiSchemaElementOptions(uiSchema, options);
  // interpolate the i18n scope into the uiSchema
  uiSchema = interpolate(
    uiSchema,
    { i18nScope },
    // We don't have a real i18n object here, so just return the key
    {
      translate(i18nKey: string) {
        return `{{${i18nKey}:translate}}`;
      },
    }
  );

  return Promise.resolve({ schema, uiSchema });
}
