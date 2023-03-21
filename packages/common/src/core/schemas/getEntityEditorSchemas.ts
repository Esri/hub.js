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

  // schema and uiSchema are dynamically imported based on
  // the entity type and the provided editor type
  let schema;
  let uiSchema;
  switch (entityType) {
    case "project":
      ({ ProjectSchema: schema } = cloneObject(
        await import("../../projects/_internal/ProjectSchema")
      ));
      ({ uiSchema } = await {
        "hub:project:edit": () =>
          import("../../projects/_internal/ProjectUiSchemaEdit"),
        "hub:project:create": () =>
          import("../../projects/_internal/ProjectUiSchemaCreate"),
      }[type as ProjectEditorType]());
      break;
    case "initiative":
      ({ InitiativeSchema: schema } = cloneObject(
        await import("../../initiatives/_internal/InitiativeSchema")
      ));
      ({ uiSchema } = await {
        "hub:initiative:edit": () =>
          import("../../initiatives/_internal/InitiativeUiSchemaEdit"),
      }[type as InitiativeEditorType]());
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
