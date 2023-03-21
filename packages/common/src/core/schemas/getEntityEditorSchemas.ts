import { interpolate } from "../../items";
import { cloneObject } from "../../util";
import { IEditorConfig } from "../behaviors";
import { UiSchemaElementOptions } from "./types";
import { applyUiSchemaElementOptions } from "./internal/applyUiSchemaElementOptions";
import { filterSchemaToUiSchema } from "./internal/filterSchemaToUiSchema";
import {
  ProjectEditorTypes,
  ProjectEditorType,
  ProjectSchema,
  ProjectCreateUiSchema,
  ProjectEditUiSchema,
} from "../../projects/_internal/ProjectSchemas";
import {
  InitiativeEditorTypes,
  InitiativeEditorType,
  InitiativeSchema,
  InitiativeEditUiSchema,
} from "../../initiatives/_internal/InitiativeSchemas";

export type EditorType = (typeof validEditorTypes)[number];
const validEditorTypes = [
  ...ProjectEditorTypes,
  ...InitiativeEditorTypes,
] as const;

export const getEntityEditorSchemas = async (
  i18nScope: string,
  type: EditorType,
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> => {
  const entityType = type.split(":")[1];

  // schema and uiSchema are determined by the entity type
  // and the provided editor type
  let schema;
  let uiSchema;
  switch (entityType) {
    case "project":
      schema = cloneObject(ProjectSchema);
      uiSchema = {
        "hub:project:edit": ProjectEditUiSchema,
        "hub:project:create": ProjectCreateUiSchema,
      }[type as ProjectEditorType];
      break;
    case "initiative":
      schema = cloneObject(InitiativeSchema);
      uiSchema = {
        "hub:initiative:edit": InitiativeEditUiSchema,
      }[type as InitiativeEditorType];
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
