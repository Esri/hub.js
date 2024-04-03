import { JSONSchema } from "json-schema-typed";
import Ajv from "ajv";

import { ProjectEditorTypes } from "../../projects/_internal/ProjectSchema";
import { InitiativeEditorTypes } from "../../initiatives/_internal/InitiativeSchema";
import { SiteEditorTypes } from "../../sites/_internal/SiteSchema";
import { DiscussionEditorTypes } from "../../discussions/_internal/DiscussionSchema";
import { PageEditorTypes } from "../../pages/_internal/PageSchema";
import { ContentEditorTypes } from "../../content/_internal/ContentSchema";
import { TemplateEditorTypes } from "../../templates/_internal/TemplateSchema";
import { GroupEditorTypes } from "../../groups/_internal/GroupSchema";
import { InitiativeTemplateEditorTypes } from "../../initiative-templates/_internal/InitiativeTemplateSchema";
import { SurveyEditorTypes } from "../../surveys/_internal/SurveySchema";
import {
  CardEditorOptions,
  EntityEditorOptions,
} from "./internal/EditorOptions";
import { IArcGISContext } from "../../ArcGISContext";

export interface IEditorConfig {
  schema: IConfigurationSchema;
  uiSchema: IUiSchema;
  defaults?: IConfigurationValues;
}

/**
 * Defines the possible editor type values - these correspond
 * to the supported/defined uiSchema configurations
 */
export type EntityEditorType = (typeof validEntityEditorTypes)[number];
export const validEntityEditorTypes = [
  ...ProjectEditorTypes,
  ...ContentEditorTypes,
  ...InitiativeEditorTypes,
  ...SiteEditorTypes,
  ...DiscussionEditorTypes,
  ...PageEditorTypes,
  ...TemplateEditorTypes,
  ...GroupEditorTypes,
  ...InitiativeTemplateEditorTypes,
  ...SurveyEditorTypes,
] as const;

/** Defines the possible editor type values for a stat card. These
 * correspond to the supported/defined uiSchema configurations. This should
 * have its own signature in the getEditorConfig function.
 */
export type StatCardEditorType = (typeof validStatCardEditorTypes)[number];
export const validStatCardEditorTypes = ["hub:card:stat"] as const;

/** Defines the possible editor type values for a follow card. These
 * correspond to the supported/defined uiSchema configurations. This should
 * have its own signature in the getEditorConfig function.
 */
export type FollowCardEditorType = (typeof validFollowCardEditorTypes)[number];
export const validFollowCardEditorTypes = ["hub:card:follow"] as const;

/**
 * Defines the possible editor type values for any layout card. These
 * correspond to the supported/defined uiSchema configurations for cards.
 */
export type CardEditorType = (typeof validCardEditorTypes)[number];
export const validCardEditorTypes = [
  ...validStatCardEditorTypes,
  ...validFollowCardEditorTypes,
] as const;

/**
 * All supported editor types - these "map"
 * to defined schema/uiSchema configurations
 */
export type EditorType = (typeof validEditorTypes)[number];
export const validEditorTypes = [
  ...validEntityEditorTypes,
  ...validCardEditorTypes,
] as const;

/**
 * An editor's module when dynamically imported depending on the EditorType. This
 * will always have a buildUiSchema function, and sometimes it will have a
 * buildDefaults function to override default values in the editor.
 */
export type IEditorModuleType = IEntityEditorModuleType | ICardEditorModuleType;

/**
 * An entity editor's module when dynamically imported depending on the EditorType. This
 * will always have a buildUiSchema function, and sometimes it will have a
 * buildDefaults function to override default values in the editor.
 */
export interface IEntityEditorModuleType {
  buildUiSchema: (
    i18nScope: string,
    options: EntityEditorOptions,
    context: IArcGISContext
  ) => Promise<IUiSchema>;
  buildDefaults?: (
    i18nScope: string,
    options: EntityEditorOptions,
    context: IArcGISContext
  ) => Promise<IConfigurationValues>;
}

/**
 * A card editor's module when dynamically imported depending on the EditorType. This
 * will always have a buildUiSchema function, and sometimes it will have a
 * buildDefaults function to override default values in the editor.
 */
export interface ICardEditorModuleType {
  buildUiSchema: (
    i18nScope: string,
    config: CardEditorOptions,
    context: IArcGISContext
  ) => Promise<IUiSchema>;

  buildDefaults?: (
    i18nScope: string,
    options: CardEditorOptions,
    context: IArcGISContext
  ) => Promise<IConfigurationValues>;
}

export enum UiSchemaRuleEffects {
  SHOW = "SHOW",
  HIDE = "HIDE",
  DISABLE = "DISABLE",
  NONE = "",
}

export enum UiSchemaElementTypes {
  section = "Section",
  control = "Control",
  layout = "Layout",
  slot = "Slot",
}

export enum UiSchemaSectionTypes {
  accordion = "accordion",
  accordionItem = "accordionItem",
  block = "block",
  stepper = "stepper",
  step = "step",
  subblock = "subblock",
  card = "card",
}

export enum UiSchemaMessageTypes {
  error = "ERROR",
  success = "SUCCESS",
  custom = "CUSTOM",
}

export interface IConfigurationSchema extends JSONSchema {
  type?: "object";
}

export interface IConfigurationValues {
  [key: string]: any;
}

export interface IChangeEventDetail {
  valid: boolean;
  values?: {
    [key: string]: any;
  };
}

/**
 * **DEPRECATED:** this should not have been hoisted
 * to hub.js and should live in opendata-ui. It is now
 * duplicated there, and this interface should be removed
 * during the next breaking change
 *
 * Note: once removed, we should also be able to remove
 * ajv as a dependency in this repo
 */
export interface IValidationResult {
  valid: boolean;
  errors?: Ajv.ErrorObject[];
}

export interface IUiSchemaRule {
  effect: UiSchemaRuleEffects;
  condition: {
    scope?: string;
    schema: IConfigurationSchema;
  };
}

export interface IUiSchemaElement {
  type: string;
  id?: string;
  labelKey?: string;
  label?: string;
  options?: {
    [key: string]: any;
  };
  scope?: string;
  rule?: IUiSchemaRule;
  elements?: IUiSchemaElement[];
  tooltip?: string;
}

export interface IUiSchema extends IUiSchemaElement {
  elements?: IUiSchemaElement[];
}

/**
 * Run-time configuration for UiSchema Elements
 */
export type UiSchemaElementOptions = Pick<
  IUiSchemaElement,
  "scope" | "options"
>;

export interface IUiSchemaComboboxItem {
  value: string;
  label?: string;
  icon?: string;
  selected?: boolean;
}

export interface IUiSchemaRule {
  effect: UiSchemaRuleEffects;
  condition: IUiSchemaCondition;
}

export interface IUiSchemaCondition {
  scope?: string;
  schema: IConfigurationSchema;
}

export interface IUiSchemaMessage {
  type: UiSchemaMessageTypes;
  display?: "message" | "notice";
  keyword?: string;
  label?: string;
  labelKey?: string;
  icon?: boolean | string;
  kind?: "brand" | "danger" | "info" | "success" | "warning";
  hidden?: boolean;
  condition?: IUiSchemaCondition;
  allowShowBeforeInteract?: boolean;
  alwaysShow?: boolean;
}

export interface IUiSchemaRule {
  effect: UiSchemaRuleEffects;
  condition: IUiSchemaCondition;
}

export interface IUiSchemaCondition {
  scope?: string;
  schema: IConfigurationSchema;
}

export interface IUiSchemaMessage {
  type: UiSchemaMessageTypes;
  display?: "message" | "notice";
  keyword?: string;
  title?: string;
  titleKey?: string;
  label?: string;
  labelKey?: string;
  icon?: boolean | string;
  kind?: "brand" | "danger" | "info" | "success" | "warning";
  hidden?: boolean;
  condition?: IUiSchemaCondition;
  allowShowBeforeInteract?: boolean;
  alwaysShow?: boolean;
}
