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

/**
 * Defines the possible editor type values - these correspond
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
  ...TemplateEditorTypes,
  ...GroupEditorTypes,
  ...InitiativeTemplateEditorTypes,
] as const;

export enum UiSchemaRuleEffects {
  SHOW = "SHOW",
  HIDE = "HIDE",
  DISABLE = "DISABLE",
  NONE = "",
}

export enum UiSchemaElementTypes {
  accordionItem = "AccordionItem",
  section = "Section",
  step = "Step",
  control = "Control",
  layout = "Layout",
  slot = "Slot",
}

export enum UiSchemaSectionTypes {
  accordion = "accordion",
  block = "block",
  stepper = "stepper",
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
}

export interface IUiSchemaRule {
  effect: UiSchemaRuleEffects;
  condition: IUiSchemaCondition;
}

export interface IUiSchemaCondition {
  scope?: string;
  schema: IConfigurationSchema;
}
