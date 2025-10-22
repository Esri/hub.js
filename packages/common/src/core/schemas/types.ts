import { JSONSchema } from "json-schema-typed";
import { ProjectEditorTypes } from "../../projects/_internal/projectEditorTypes";
import { InitiativeEditorTypes } from "../../initiatives/_internal/initiativeEditorTypes";
import { SiteEditorTypes } from "../../sites/_internal/siteEditorTypes";
import { DiscussionEditorTypes } from "../../discussions/_internal/discussionEditorTypes";
import { PageEditorTypes } from "../../pages/_internal/pageEditorTypes";
import { ContentEditorTypes } from "../../content/_internal/contentEditorTypes";
import { TemplateEditorTypes } from "../../templates/_internal/templateEditorTypes";
import { GroupEditorTypes } from "../../groups/_internal/groupEditorTypes";
import { InitiativeTemplateEditorTypes } from "../../initiative-templates/_internal/initiativeTemplateEditorTypes";
import {
  CardEditorOptions,
  EntityEditorOptions,
} from "./internal/EditorOptions";
import type { IArcGISContext } from "../../types/IArcGISContext";
import { EventEditorTypes } from "../../events/_internal/eventEditorTypes";
import { UserEditorTypes } from "../../users/_internal/userEditorTypes";
import { ChannelEditorTypes } from "../../channels/_internal/channelEditorTypes";
import { HubActionLink } from "../types/ActionLinks";
import { UiSchemaRuleEffects } from "../enums/uiSchemaRuleEffects";
import { UiSchemaMessageTypes } from "../enums/uiSchemaMessageTypes";

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
  ...EventEditorTypes,
  ...UserEditorTypes,
  ...ChannelEditorTypes,
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

/** Defines the possible editor type values for an event gallery card. These
 * correspond to the supported/defined uiSchema configurations. This should
 * have its own signature in the getEditorConfig function.
 */
export const validEventGalleryCardEditorTypes = [
  "hub:card:eventGallery",
] as const;
export type EventGalleryCardEditorType =
  (typeof validEventGalleryCardEditorTypes)[number];

/** Defines the possible editor type values for an embed card. These
 * correspond to the supported/defined uiSchema configurations. This should
 * have its own signature in the getEditorConfig function.
 */
export const validEmbedCardEditorTypes = ["hub:card:embed"] as const;
export type EmbedCardEditorType = (typeof validEmbedCardEditorTypes)[number];

export const validDiscussionSettingsEditorTypes = [
  "hub:discussion:settings:discussions",
  "hub:site:settings:discussions",
  "hub:content:settings:discussions",
  "hub:content:settings:discussions:compact",
  "hub:group:settings:discussions",
] as const;
export type DiscussionSettingsEditorType =
  (typeof validDiscussionSettingsEditorTypes)[number];

/**
 * Defines the possible editor type values for any layout card. These
 * correspond to the supported/defined uiSchema configurations for cards.
 */
export type CardEditorType = (typeof validCardEditorTypes)[number];
export const validCardEditorTypes = [
  ...validStatCardEditorTypes,
  ...validFollowCardEditorTypes,
  ...validEventGalleryCardEditorTypes,
  ...validEmbedCardEditorTypes,
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

export interface IConfigurationSchema extends JSONSchema {
  type?: "object";
}

export interface IAsyncConfigurationSchema extends IConfigurationSchema {
  $async: true;
}

export interface IConfigurationValues {
  [key: string]: any;
}

export interface IChangeEventDetail {
  valid: boolean;
  values?: {
    [key: string]: any;
  };
  schema?: IConfigurationSchema;
  /**
   * The currently required properties in the schema
   */
  required?: Set<string>;
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
  // NOTE: rule is deprecated and remains for backwards compatibility only. Please use rules instead.
  rule?: IUiSchemaRule;
  rules?: IUiSchemaRule[];
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

export interface IUiSchemaComboboxItemGroup {
  label: string;
  items: IUiSchemaComboboxItem[];
}

export interface IUiSchemaComboboxItem {
  value: string;
  label?: string;
  icon?: string;
  selected?: boolean;
  children?: IUiSchemaComboboxItem[];
}

/**
 * A rule for a uiSchema element. This rule will be evaluated
 * to determine if the element should assume the provided effect.
 *
 * NOTE: `.condition` is deprecated and remains for backwards compatibility only. Please use `.conditions` instead.
 */
export interface IUiSchemaRule {
  effect: UiSchemaRuleEffects;
  // NOTE: condition is deprecated and remains for backwards compatibility only. Please use conditions instead.
  condition?: IUiSchemaCondition;
  conditions?: Array<IUiSchemaCondition | boolean>;
}

export interface IUiSchemaCondition {
  scope?: string;
  schema: IConfigurationSchema;
}

/**
 * A message to display for a uiSchema element.
 *
 * NOTE: `.condition` is deprecated and remains for backwards compatibility only. Please use `.conditions` instead.
 * NOTE: `.display`, `.title`, `.titleKey`, `.kind`, `.alwaysShow` are deprecated and remain for backwards compatibility only. Please use the new method of notices in the configuration editor instead.
 */
export interface IUiSchemaMessage {
  type: UiSchemaMessageTypes;
  keyword?: string;
  label?: string;
  labelKey?: string;
  icon?: boolean | string;
  link?: HubActionLink;
  hidden?: boolean;
  conditions?: Array<IUiSchemaCondition | boolean>;
  allowShowBeforeInteract?: boolean;
  /** DEPRECATED */
  // NOTE: condition is deprecated and remains for backwards compatibility only. Please use conditions instead.
  condition?: IUiSchemaCondition;
  // NOTE: display is deprecated and remains for backwards compatibility only. Please use the new method of notices in the configuration editor instead.
  display?: "message" | "notice";
  // NOTE: title is deprecated and remains for backwards compatibility only. Please use the new method of notices in the configuration editor instead.
  title?: string;
  // NOTE: titleKey is deprecated and remains for backwards compatibility only. Please use the new method of notices in the configuration editor instead.
  titleKey?: string;
  // NOTE: kind is deprecated and remains for backwards compatibility only. Please use the new method of notices in the configuration editor instead.
  kind?: "brand" | "danger" | "info" | "success" | "warning";
  // NOTE: alwaysShow is deprecated and remains for backwards compatibility only. Please use the new method of notices in the configuration editor instead.
  alwaysShow?: boolean;
}
