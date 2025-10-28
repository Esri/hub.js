import type { HubEntity } from "../core/types/HubEntity";
import type {
  IChangeEventDetail,
  IConfigurationSchema,
} from "../core/schemas/types";
import type { IEntityPermissionPolicy } from "../permissions/types/IEntityPermissionPolicy";
import type { IHubSite } from "../core/types/IHubSite";
import type { IUiSchema } from "../core/schemas/types";
import type { IMigratableSchema } from "../migrations/types";

/** Type representing supported responsive breakpoints.  */
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/** Map of breakpoint names to their minimum pixel widths.  */
export const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1440,
};

/** Defines a union type for valid ARIA roles */
export type AriaRole =
  | "application"
  | "article"
  | "button"
  | "cell"
  | "checkbox"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "directory"
  | "document"
  | "feed"
  | "figure"
  | "form"
  | "group"
  | "heading"
  | "img"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "main"
  | "math"
  | "menu"
  | "menubar"
  | "menuitem"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "switch"
  | "tab"
  | "table"
  | "tabpanel"
  | "term"
  | "textbox"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem";

/**
 * Type for a value that can be either a single value or a map of
 * breakpoint-specific values.
 */
export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>> | T;

/** Type representing valid column widths (1-12). */
export type ColumnWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Interface representing a translation map for layout strings.
 * Each key is a language code, and the value is a map of
 * translation keys to translated strings:
 * ```
 * {
 *   "en": {
 *     "welcome": "Welcome to our site",
 *     "goodbye": "Thank you for visiting"
 *   },
 *   "fr": {
 *     "welcome": "Bienvenue sur notre site",
 *     "goodbye": "Merci de votre visite"
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ITranslationMap {
  /**
   * A key-value pair where the key is a language
   * code and the value is a map of translation
   * keys to translated text.
   */
  [language: string]: Record<string, unknown>;
}
/**
 * Type representing a map of CSS property names to values:
 * {
 *  "color": "red",
 *  "font-size": "16px"
 * }
 */
export type StyleMap = Record<string, string>;

/**
 * Type representing a reference or a value.
 * References are resolved before variable interpolation.
 */
export type RefOrValue = Date | number | string | { $ref: string };

export type Ref = { $ref: string };
export type SectionOrRef = ISection | Ref;

/**
 * Interface representing a layout variable. These can be used
 * anywhere in the layout, and the values will be interpolated
 * into the layout before rendering. All `$ref` values will be
 * resolved before interpolation.
 */
export interface ILayoutVariable {
  /**
   * The type of the variable. Used to generate a json & ui
   * schemas allowing values to be provided by the user,
   * during a "Create from..." operation.
   */
  type:
    | "boolean"
    | "color"
    | "date"
    | "datetime"
    | "number"
    | "string"
    | "time"
    | "url";
  /**
   * A description of the variable. This is used to provide
   * a hint to the user when they are entering a value for
   * the variable.
   */
  description?: string;
  /**
   * The value of the variable. This can be a string, number,
   * boolean, date, datetime, time, color, or url. If the value
   * is a reference, it will be resolved before interpolation
   */
  value: RefOrValue;
}

/** Interface representing overrides for layout nodes. */
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface INodeOverrides {
  /** Overrides for the node's properties */
  [nodeId: string]: Partial<LayoutNode>;
}

/** Type representing any node in the layout tree.  */
export type LayoutNode = IColumn | ILayoutNode | IRow | ISection;

/** Interface representing a generic layout node. */
export interface ILayoutNode extends IMigratableSchema {
  /** Unique identifier for the node. */
  id: string;
  /** Tag name to render for this node. */
  tag: LayoutNodeTag;
  /** Optional properties for the node. */
  properties?: Record<string, unknown>;
  /** Optional array of child nodes. */
  children?: LayoutNode[];
  /** Optional slotted content for the node */
  slots?: Record<string, ILayoutNode | string>;
  /** Optional schema version for the settings of this specific component. */
  schemaVersion?: number;
  /** Optional map of CSS styles for the node. */
  styles?: StyleMap;
  /** Optional array of CSS classes for the node. */
  classes?: string[];
  /** If true, the node is only rendered in the editor */
  hidden?: boolean;
  /** Optional array of permission policies for access control. */
  permissions?: IEntityPermissionPolicy[];
  /** Optional: when true the node can not be editied, regardless of the component rules.
   * This is a means to control the edit access to sections of the layout, but  */
  readOnly?: boolean;
  /** Optional translations for the layout. */
  translations?: ITranslationMap;
}

/** Interface representing a layout section node.  */
export interface ISection extends ILayoutNode {
  /** Tag for a section node (always 'arcgis-layout-section'). */
  tag: "arcgis-layout-section";
  /** Array of row children for the section. */
  children?: IRow[];
  /** Optional section-specific properties. */
  sectionProps?: ISectionProps;
  /** Optional section label */
  label?: string;
}

/** Interface representing a layout row node.  */
export interface IRow extends ILayoutNode {
  /** Tag for a row node (always 'arcgis-layout-row'). */
  tag: "arcgis-layout-row";
  /** Array of column children for the row. */
  children?: IColumn[];
  /** Optional row-specific properties. */
  rowProps?: IRowProps;
}

/**
 * type for column children - a column can contain
 * rows, or cards
 */
export type LayoutColumnChild = ILayoutNode | IRow;
/**
 * Interface representing a layout column node.
 */
export interface IColumn extends ILayoutNode {
  /** Tag for a column node (always 'arcgis-hub-layout-column'). */
  tag: "arcgis-layout-column";
  /** Array of child nodes for the column (excluding sections). */
  children?: LayoutColumnChild[];
  /** Optional column-specific properties. */
  columnProps?: IColumnProps;
  /** Optional properties for the column node. */
  properties?: Record<string, unknown>;
}

/** Interface for common accessible properties.  */
export interface IAccessibleProps {
  /** Optional ARIA role for accessibility. */
  role?: AriaRole;
  /** Optional ARIA label for accessibility. */
  ariaLabel?: string;
}

/**
 * Interface for section-specific properties, including
 * accessibility and layout options.
 */
export interface ISectionProps extends IAccessibleProps {
  /** Remove horizontal gutters (column padding) from the section. */
  noGutters?: boolean;
  /**
   * Responsive full width for the section.
   * Section will be 100% wide above this breakpoint.
   */
  fullWidthAt?: Breakpoint | "fluid";
}

/**
 * Interface for row-specific properties, including
 * accessibility and layout options.
 */
export interface IRowProps extends IAccessibleProps {
  /** How to align columns vertically (cross axis). */
  alignItems?: ResponsiveValue<
    "around" | "between" | "center" | "end" | "start" | "stretch"
  >;
}

/**
 * Interface for column-specific properties, including
 * accessibility and layout options.
 */
export interface IColumnProps extends IAccessibleProps {
  /** Responsive width for the column (1-12). */
  width?: ResponsiveValue<ColumnWidth>;
  /** Responsive offset (left margin) for the column. */
  offset?: ResponsiveValue<
    0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  >;
  /** Responsive self-alignment for the column. */
  alignSelf?: ResponsiveValue<
    "auto" | "baseline" | "center" | "end" | "start" | "stretch"
  >;
  alignItems?: ResponsiveValue<
    "auto" | "baseline" | "center" | "end" | "start" | "stretch"
  >;
  /**
   * Controls horizontal alignment of children within the column.
   * Accepts standard CSS 'justify-content' values, or responsive values.
   * Example: 'flex-start', 'center', 'flex-end', 'space-between', etc.
   */
  justifyContent?: ResponsiveValue<
    "around" | "between" | "center" | "end" | "evenly" | "start"
  >;
  shrink?: boolean;
}

/**
 * Interface representing a history entry for a
 * layout node.
 */
export interface IHistoryEntry {
  /** Node id for the history entry. */
  nodeId: string;
  /** UTC timestamp for the change. */
  timestamp: number;
  /** Username of the user who made the change. */
  username: string;
  /** Action performed (e.g., 'add:node', 'update:node', 'remove:block'). */
  action: string;
}

/**
 * Interface representing a configurable node in
 * the layout system. All layout node components
 * should implement this interface to ensure
 * consistency.
 */
export interface IConfigurableLayoutNode {
  layoutNodeConfig?: ILayoutNodeConfig;
}

/**
 * Type representing an HTML element that extends
 * the IConfigurableLayoutNode interface.
 */
export type HTMLConfigurableLayoutNodeElement = HTMLElement &
  IConfigurableLayoutNode;

/**
 * Interface representing the configuration for a
 * layout node.
 */
export interface ILayoutNodeConfig {
  /** Tag of the layout node. */
  tag: LayoutNodeTag;
  /** Whether the node is editable. */
  canEdit?: boolean;
  /** Whether the node is repositionable. */
  canMove?: boolean;
  /**
   * Property name for the node's values - e.g. when the
   * node is edited, the updated values from the editor
   * will be set on this property of the node.
   */
  valuesProp?: string;
  /** Default values for the node's configuration. */
  defaults: Record<string, unknown>;
  /**
   * Various translation strings to display or use for a11y
   * purposes in the node's editing UI
   */
  i18n: {
    label: string;
    description?: string;
    editLabel?: string;
    deleteLabel?: string;
    repositionUpLabel?: string;
    repositionDownLabel?: string;
  };
  /**
   * Optional editor configuration for the node. If provided
   * and the card is editable, an edit control will be enabled
   * that will open the editing experience defined here.
   */
  editor?: LayoutNodeEditorConfig;
}

/**
 * Base type representing common properties for
 * a layout node's editor configuration.
 */
type LayoutNodeEditorConfigBase = {
  /**
   * Optional callback to transform values before
   * passing to the editor.
   */
  valuesInCallback?: (val: unknown) => unknown;
  /**
   * Optional callback to transform values after
   * editing, before mapping back to the node's
   * properties.
   */
  valuesOutCallback?: (val: unknown) => unknown;
  /** Additional properties to pass to the editor. */
  properties?: Record<string, unknown>;
};

/**
 * Type representing a layout node's editor
 * configuration. This can be driven by an
 * editor tag or the full JSON schema and
 * UI schema defining a generic form-based
 * editor.
 */
export type LayoutNodeEditorConfig =
  | (LayoutNodeEditorConfigBase & {
      /** Tag of the node's editor component. */
      tag: LayoutEditorTag;
      schema?: never;
      uiSchema?: never;
    })
  | (LayoutNodeEditorConfigBase & {
      tag?: never;
      /**
       * JSON schema defining the underlying
       * properties of the node's editor.
       */
      schema: IConfigurationSchema;
      /**
       * Optional UI schema defining the UI of the
       * node's editor.
       */
      uiSchema: IUiSchema;
    });

/**
 * Interface representing the information emitted when
 * a layout node is changed in the layout editor.
 */
export interface ILayoutNodeChangeEventDetail extends IChangeEventDetail {
  // the id of the node being configured
  id: string;
  layoutNodeConfig: ILayoutNodeConfig;
}

/**
 * Interfrace representing the available options for
 * processing a layout.
 */
export interface IProcessLayoutOptions {
  entity?: HubEntity;
  site?: IHubSite;
  variables?: Record<string, unknown>;
  translations?: Record<string, string>;
}

/**
 * An array of tags representing components that are
 * supported by the layout system and can be defined
 * in an ILayout object.
 */
export const layoutNodeTags = [
  "arcgis-layout-section",
  "arcgis-layout-row",
  "arcgis-layout-column",
  "calcite-button",
  "calcite-chip",
  "calcite-avatar",
  "arcgis-text-card",
  "arcgis-hub-gallery-card",
  "arcgis-hub-image",
  "arcgis-hub-embed-card",
  "arcgis-nav-card",
  "arcgis-hub-timeline",
  "arcgis-hub-entity-metadata",
  "arcgis-hub-catalog",
  "arcgis-hub-map-view",
  "arcgis-hub-entity-metrics-card",
  "arcgis-hub-entity-associations-card",
  "arcgis-hub-entity-status-card",
  "arcgis-hub-entity-metrics-view",
  "arcgis-hub-project-initiatives-view",
  "arcgis-hub-entity-hero",
  "div",
] as const;
/** Union type of all supported layout node tags.  */
export type LayoutNodeTag = (typeof layoutNodeTags)[number];

/**
 * An array of tags representing components that are
 * supported as editors for layout nodes.
 */
export const layoutEditorTags = [
  "arcgis-hub-gallery-card-editor",
  "hub-field-input-input",
  "hub-field-input-rich-text",
  "arcgis-hub-embed-card-editor",
  "arcgis-hub-timeline-editor",
  "hub-field-input-image-picker",
] as const;
/** Union type of all supported layout editor tags.  */
export type LayoutEditorTag = (typeof layoutEditorTags)[number];
