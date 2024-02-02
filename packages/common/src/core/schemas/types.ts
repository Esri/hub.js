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

export interface IEditorConfig {
  schema: IConfigurationSchema;
  uiSchema: IUiSchema;
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
] as const;

/** 
 * The following types define the possible editor type values for various
 * hub cards. These correspond to the supported/defined uiSchema configurations
 * for that card.
 * 
 * Note: each should have its own signature in the getEditorConfig function.
 */
export type StatCardEditorType = (typeof validStatCardEditorTypes)[number];
export const validStatCardEditorTypes = ["hub:card:stat"] as const;

export type FollowCardEditorType = (typeof validFollowCardEditorTypes)[number];
export const validFollowCardEditorTypes = ["hub:card:follow"] as const;

export type ActionCardEditorType = (typeof validActionCardEditorTypes)[number];
export const validActionCardEditorTypes = ["hub:card:action"] as const;


export type ActionLinksFieldEditorType = (typeof validActionLinksFieldEditorTypes)[number];
export const validActionLinksFieldEditorTypes = ["hub:field:actionLinks:card", "hub:field:actionLinks:projectCallToAction"] as const;


/**
 * Defines the possible editor type values for any layout card. These
 * correspond to the supported/defined uiSchema configurations for cards.
 */
export type CardEditorType = (typeof validCardEditorTypes)[number];
export const validCardEditorTypes = [
  ...validStatCardEditorTypes,
  ...validFollowCardEditorTypes,
  ...validActionCardEditorTypes
] as const;

export type FieldEditorType = (typeof validFieldEditorTypes)[number];
export const validFieldEditorTypes = [
  ...validActionLinksFieldEditorTypes
] as const;

/**
 * All supported editor types - these "map"
 * to defined schema/uiSchema configurations
 */
export type EditorType = (typeof validEditorTypes)[number];
export const validEditorTypes = [
  ...validEntityEditorTypes,
  ...validCardEditorTypes,
  ...validFieldEditorTypes
] as const;

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
