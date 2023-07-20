import { interpolate } from "../../items";
import { cloneObject } from "../../util";
import { IEditorConfig } from "../behaviors";
import { UiSchemaElementOptions } from "./types";
import { applyUiSchemaElementOptions } from "./internal/applyUiSchemaElementOptions";
import { filterSchemaToUiSchema } from "./internal/filterSchemaToUiSchema";
import {
  ProjectEditorType,
  ProjectEditorTypes,
} from "../../projects/_internal/ProjectSchema";
import {
  InitiativeEditorTypes,
  InitiativeEditorType,
} from "../../initiatives/_internal/InitiativeSchema";
import {
  SiteEditorType,
  SiteEditorTypes,
} from "../../sites/_internal/SiteSchema";
import {
  DiscussionEditorType,
  DiscussionEditorTypes,
} from "../../discussions/_internal/DiscussionSchema";
import {
  PageEditorType,
  PageEditorTypes,
} from "../../pages/_internal/PageSchema";
import {
  ContentEditorType,
  ContentEditorTypes,
} from "../../content/_internal/ContentSchema";

/**
 * defines the possible editor type values - these correspond
 * to the supported/defined uiSchema configurations
 */
export type EditorType = (typeof validEditorTypes)[number];
export const validEditorTypes = [
  ...ProjectEditorTypes,
  ...ContentEditorTypes,
  ...InitiativeEditorTypes,
  ...SiteEditorTypes,
  ...DiscussionEditorTypes,
  ...PageEditorTypes,
  ...ContentEditorTypes,
] as const;

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
export const getEntityEditorSchemas = async (
  i18nScope: string,
  type: EditorType,
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> => {
  const entityType = type.split(":")[1];

  // schema and uiSchema are dynamically imported based on
  // the entity type and the provided editor type
  let schema;
  let uiSchema;
  switch (entityType) {
    case "project":
      const { ProjectSchema } = await import(
        "../../projects/_internal/ProjectSchema"
      );
      schema = cloneObject(ProjectSchema);

      ({ uiSchema } = await {
        "hub:project:edit": () =>
          import("../../projects/_internal/ProjectUiSchemaEdit"),
        "hub:project:create": () =>
          import("../../projects/_internal/ProjectUiSchemaCreate"),
      }[type as ProjectEditorType]());
      break;
    case "initiative":
      const { InitiativeSchema } = await import(
        "../../initiatives/_internal/InitiativeSchema"
      );
      schema = cloneObject(InitiativeSchema);

      ({ uiSchema } = await {
        "hub:initiative:edit": () =>
          import("../../initiatives/_internal/InitiativeUiSchemaEdit"),
      }[type as InitiativeEditorType]());
      break;
    case "site":
      const { SiteSchema } = await import("../../sites/_internal/SiteSchema");
      schema = cloneObject(SiteSchema);

      ({ uiSchema } = await {
        "hub:site:edit": () => import("../../sites/_internal/SiteUiSchemaEdit"),
      }[type as SiteEditorType]());
      break;
    case "discussion":
      const { DiscussionSchema } = await import(
        "../../discussions/_internal/DiscussionSchema"
      );
      schema = cloneObject(DiscussionSchema);

      ({ uiSchema } = await {
        "hub:discussion:edit": () =>
          import("../../discussions/_internal/DiscussionUiSchemaEdit"),
        "hub:discussion:create": () =>
          import("../../discussions/_internal/DiscussionUiSchemaCreate"),
      }[type as DiscussionEditorType]());
      break;
    case "page":
      const { PageSchema } = await import("../../pages/_internal/PageSchema");
      schema = cloneObject(PageSchema);

      ({ uiSchema } = await {
        "hub:page:edit": () => import("../../pages/_internal/PageUiSchemaEdit"),
      }[type as PageEditorType]());
      break;
    case "content":
      const { ContentSchema } = await import(
        "../../content/_internal/ContentSchema"
      );
      schema = cloneObject(ContentSchema);

      ({ uiSchema } = await {
        "hub:content:edit": () =>
          import("../../content/_internal/ContentUiSchemaEdit"),
      }[type as ContentEditorType]());
      break;
  }

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema, uiSchema);
  // apply the options
  uiSchema = applyUiSchemaElementOptions(uiSchema, options);
  // interpolate the i18n scope into the uiSchema
  uiSchema = interpolate(uiSchema, { i18nScope });

  return Promise.resolve({ schema, uiSchema });
};
