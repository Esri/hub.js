import { JSONSchema } from "json-schema-typed";
import Ajv from "ajv";

export enum UiSchemaRuleEffects {
  SHOW = "SHOW",
  HIDE = "HIDE",
  DISABLE = "DISABLE",
  NONE = "",
}

export enum UiSchemaElementTypes {
  section = "Section",
  step = "Step",
  control = "Control",
  layout = "Layout",
  slot = "Slot",
}

export enum UiSchemaSectionTypes {
  accordion = "accordion",
  stepper = "stepper",
}
export interface IConfigurationSchema extends JSONSchema {
  type?: "object";
}

export interface IConfigurationValues {
  [key: string]: unknown;
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
  elements?: IUiSchema[] | IUiSchemaElement[];
}

/**
 * Run-time configuration for UiSchema Elements
 */
export type UiSchemaElementOptions = Pick<
  IUiSchemaElement,
  "scope" | "options"
>;
