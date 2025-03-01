import {
  EntityEditorType,
  IEditorConfig,
  StatCardEditorType,
  FollowCardEditorType,
  EventGalleryCardEditorType,
} from "./types";
import type { IArcGISContext } from "../../types/IArcGISContext";
import {
  EditorOptions,
  EntityEditorOptions,
  IStatCardEditorOptions,
  IFollowCardEditorOptions,
  IEventGalleryCardEditorOptions,
} from "./internal/EditorOptions";
import { getEditorSchemas } from "./internal/getEditorSchemas";
import { EditorType } from "./types";

/**
 * NOTE: We use the concept of function overloading to write getEditorConfig.
 * In doing so, we create multiple signatures for the function.
 * When the function is called, its types will need to agree with one of the signatures.
 * This prevents a function call from having an EntityEditorType type, and IStatCardEditorOptions options, for example.
 */

/**
 * Construct the Editor Configuration (schema + uiSchema)
 * for a given entity editor type
 * @param i18nScope
 * @param type
 * @param options - options to integrate into the schema + uiSchema
 * @param context
 * @returns
 */

// Entity editor overload
export async function getEditorConfig(
  i18nScope: string,
  type: EntityEditorType,
  options: EntityEditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig>;

// Stat card editor overload
export async function getEditorConfig(
  i18nScope: string,
  type: StatCardEditorType,
  options: IStatCardEditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig>;

// Follow card editor overload
export async function getEditorConfig(
  i18nScope: string,
  type: FollowCardEditorType,
  options: IFollowCardEditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig>;

// Event gallery card editor overload
export async function getEditorConfig(
  i18nScope: string,
  type: EventGalleryCardEditorType,
  options: IEventGalleryCardEditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig>;

// General function
export async function getEditorConfig(
  i18nScope: string,
  type: EditorType,
  options: EditorOptions,
  context: IArcGISContext
): Promise<IEditorConfig> {
  return getEditorSchemas(i18nScope, type, options, context);
}
