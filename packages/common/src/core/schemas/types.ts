import { JSONSchema } from "json-schema-typed";
import Ajv from "ajv";

export type UiSchemaRuleEffects = "SHOW" | "HIDE" | "DISABLE" | "NONE";

export type UiSchemaElementTypes =
  | "Section"
  | "Step"
  | "Control"
  | "Layout"
  | "Slot";

export enum UiSchemaControls {
  input = "hub-field-input-input",
  select = "hub-field-input-select",
  multiselect = "hub-field-input-multiselect",
  boundaryPicker = "hub-field-input-boundary-picker",
  timeline = "arcgis-hub-timeline-editor",
  imagePicker = "hub-field-input-image-picker",
  galleryPicker = "hub-field-input-gallery-picker",
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
    scope: string;
    schema: IConfigurationSchema;
  };
}

export interface IUiSchemaElement {
  type: UiSchemaElementTypes;
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
