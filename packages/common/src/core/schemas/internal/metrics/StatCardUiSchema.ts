import { IArcGISContext } from "../../../../ArcGISContext";
import { IStatCardEditorOptions } from "../EditorOptions";
import { UiSchemaRuleEffects, IUiSchema } from "../../types";
import { ICONS, VISUAL_INTEREST } from "./interfaces";

/**
 * @private
 * Exports the uiSchema of the stat card
 * @returns
 */
export const buildUiSchema = async (
  i18nScope: string,
  config: IStatCardEditorOptions,
  context: IArcGISContext
): Promise<IUiSchema> => {
  const { themeColors } = config;
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `statistic.sectionTitle`,
        options: {
          section: "block",
          open: true,
        },
        elements: [
          {
            type: "Control",
            scope: "/properties/type",
            labelKey: `statistic.type.label`,
            options: {
              control: "hub-field-input-tile-select",
              enum: {
                i18nScope: `statistic.type.enum`,
              },
            },
          },
          {
            labelKey: `statistic.displayValue`,
            scope: "/properties/value",
            type: "Control",
            rule: SHOW_FOR_STATIC_RULE,
            options: {
              control: "hub-field-input-input",
            },
          },
          {
            scope: "/properties/dynamicMetric",
            type: "Control",
            labelKey: `statistic.dataSource`,
            rule: SHOW_FOR_DYNAMIC_RULE,
            options: {
              control: "hub-composite-input-service-query-metric",
            },
          },
          {
            type: "Section",
            labelKey: `formatting.sectionTitle`,
            scope: "/properties/allowUnitFormatting",
            options: {
              section: "subblock",
              scale: "m",
              toggleDisplay: "switch",
            },
            elements: [
              {
                labelKey: `formatting.unit.label`,
                scope: "/properties/unit",
                type: "Control",
                rule: SHOW_FOR_UNITS_SECTION_ENABLED,
                options: {
                  helperText: {
                    labelKey: `formatting.unit.helperText`,
                    placement: "bottom",
                  },
                },
              },
              {
                labelKey: `formatting.unitPosition.label`,
                scope: "/properties/unitPosition",
                type: "Control",
                rule: SHOW_FOR_UNITS_SECTION_ENABLED,
                options: {
                  control: "hub-field-input-select",
                  enum: {
                    i18nScope: `formatting.unitPosition.enum`,
                  },
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `advancedConfig.label`,
            options: {
              section: "subblock",
              scale: "m",
            },
            rule: SHOW_FOR_DYNAMIC_RULE,
            elements: [
              {
                scope: "/properties/serverTimeout",
                labelKey: `advancedConfig.serverTimeout.label`,
                type: "Control",
                rule: SHOW_FOR_DYNAMIC_RULE,
                options: {
                  control: "hub-field-input-input",
                  type: "number",
                  helperText: {
                    labelKey: `advancedConfig.serverTimeout.helperText`,
                    placement: "bottom",
                  },
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "type",
                      labelKey: `advancedConfig.serverTimeout.errors.type`,
                      icon: true,
                    },
                    {
                      type: "ERROR",
                      keyword: "minimum",
                      labelKey: `advancedConfig.serverTimeout.errors.minimum`,
                      icon: true,
                    },
                    {
                      type: "ERROR",
                      keyword: "maximum",
                      labelKey: `advancedConfig.serverTimeout.errors.maximum`,
                      icon: true,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        type: "Section",
        labelKey: `details.sectionTitle`,
        options: {
          section: "block",
        },
        elements: [
          {
            labelKey: `details.title`,
            scope: "/properties/cardTitle",
            type: "Control",
          },
          {
            labelKey: `details.subtitle`,
            scope: "/properties/subtitle",
            type: "Control",
          },
          {
            labelKey: `details.trailingText`,
            scope: "/properties/trailingText",
            type: "Control",
          },
          {
            type: "Section",
            labelKey: `details.link.sectionTitle`,
            scope: "/properties/allowLink",
            options: {
              section: "subblock",
              scale: "m",
              toggleDisplay: "switch",
            },
            rule: SHOW_FOR_STATIC_RULE,
            elements: [
              {
                labelKey: `details.link.sourceLink`,
                scope: "/properties/sourceLink",
                type: "Control",
                rule: SHOW_FOR_LINK_SECTION_ENABLED_AND_STATIC,
                options: {
                  placeholder: "https://esri.com",
                  messages: [
                    {
                      type: "ERROR",
                      keyword: "required",
                      icon: true,
                      labelKey: `errors.sourceLink.required`,
                      allowShowBeforeInteract: true,
                    },
                    {
                      type: "ERROR",
                      keyword: "format",
                      icon: true,
                      labelKey: `errors.sourceLink.formatError`,
                    },
                    {
                      type: "ERROR",
                      keyword: "if",
                      hidden: true,
                    },
                  ],
                },
              },
              {
                labelKey: `details.link.sourceTitle`,
                scope: "/properties/sourceTitle",
                type: "Control",
                rule: SHOW_FOR_LINK_SECTION_ENABLED_AND_STATIC,
              },
            ],
          },
          {
            type: "Control",
            scope: "/properties/allowDynamicLink",
            labelKey: `details.allowDynamicLink`,
            rule: SHOW_FOR_DYNAMIC_RULE,
            options: {
              layout: "inline-space-between",
              control: "hub-field-input-switch",
            },
          },
        ],
      },
      {
        type: "Section",
        labelKey: `appearance.sectionTitle`,
        options: { section: "block" },
        elements: [
          {
            labelKey: `appearance.layout.label`,
            scope: "/properties/layout",
            type: "Control",
            options: {
              control: "hub-field-input-select",
              enum: {
                i18nScope: `appearance.layout.enum`,
              },
            },
          },
          {
            labelKey: `appearance.textAlign`,
            scope: "/properties/textAlign",
            type: "Control",
            options: {
              control: "hub-field-input-alignment",
            },
          },
          {
            labelKey: `appearance.valueColor`,
            scope: "/properties/valueColor",
            type: "Control",
            options: {
              control: "hub-field-input-color",
              savedColors: themeColors,
            },
          },
          {
            labelKey: `appearance.dropShadow.label`,
            scope: "/properties/dropShadow",
            type: "Control",
            rule: HIDE_FOR_ALL,
            options: {
              control: "hub-field-input-select",
              enum: {
                i18nScope: `appearance.dropShadow.enum`,
              },
            },
          },
          {
            type: "Section",
            labelKey: `appearance.styleSpecificSettings.label`,
            rule: SHOW_FOR_SIMPLE_RULE,
            options: {
              helperText: {
                labelKey: `appearance.styleSpecificSettings.helperVizText`,
              },
            },
            elements: [
              {
                labelKey: `appearance.visualInterest.label`,
                scope: "/properties/visualInterest",
                type: "Control",
                rule: SHOW_FOR_SIMPLE_RULE,
                options: {
                  control: "hub-field-input-combobox",
                  items: [
                    {
                      value: VISUAL_INTEREST.none,
                      labelKey: `appearance.visualInterest.none.label`,
                    },
                    {
                      value: VISUAL_INTEREST.icon,
                      labelKey: `appearance.visualInterest.icon.label`,
                    },
                  ],
                  selectionMode: "single",
                },
              },
              {
                labelKey: `appearance.icon.label`,
                scope: "/properties/icon",
                type: "Control",
                rule: SHOW_FOR_ICON_RULE,
                options: {
                  control: "hub-field-input-combobox",
                  items: [
                    {
                      value: ICONS.caretUp,
                      labelKey: `appearance.icon.caretUp.label`,
                      icon: ICONS.caretUp,
                    },
                    {
                      value: ICONS.caretDown,
                      labelKey: `appearance.icon.caretDown.label`,
                      icon: ICONS.caretDown,
                    },
                    {
                      value: ICONS.caretDouble,
                      labelKey: `appearance.icon.caretDouble.label`,
                      icon: ICONS.caretDouble,
                    },
                  ],
                  selectionMode: "single",
                },
              },
            ],
          },
          {
            type: "Section",
            labelKey: `appearance.styleSpecificSettings.label`,
            rule: SHOW_FOR_INFORMATIONAL_RULE,
            options: {
              helperText: {
                labelKey: `appearance.styleSpecificSettings.helperInfoText`,
              },
            },
            elements: [
              {
                labelKey: `appearance.popoverText.label`,
                scope: "/properties/popoverText",
                type: "Control",
                rule: SHOW_FOR_INFORMATIONAL_RULE,
                options: {
                  control: "hub-field-input-input",
                  type: "textarea",
                  rows: 4,
                },
              },
              {
                labelKey: `appearance.publisherText.label`,
                scope: "/properties/publisherText",
                type: "Control",
                rule: SHOW_FOR_INFORMATIONAL_RULE,
                options: {
                  control: "hub-field-input-input",
                },
              },
            ],
          },
        ],
      },
      {
        type: "Section",
        labelKey: `sharing.sectionTitle`,
        options: {
          section: "block",
        },
        elements: [
          {
            labelKey: `sharing.showShareIcon`,
            scope: "/properties/shareable",
            type: "Control",
            options: {
              helperText: {
                labelKey: `sharing.showShareIconHelperText`,
              },
              control: "hub-field-input-switch",
              layout: "inline-space-between",
            },
          },
          {
            labelKey: `sharing.shareableByValue`,
            scope: "/properties/shareableByValue",
            type: "Control",
            rule: HIDE_FOR_ALL,
          },
          {
            labelKey: `sharing.shareableOnHover.label`,
            scope: "/properties/shareableOnHover",
            type: "Control",
            rule: SHOW_FOR_SHARING_RULE,
            options: {
              control: "hub-field-input-switch",
              helperText: {
                labelKey: `sharing.shareableOnHover.helperText.label`,
              },
              layout: "inline-space-between",
            },
          },
        ],
      },
    ],
  };
};

const HIDE_FOR_ALL = {
  effect: UiSchemaRuleEffects.HIDE,
  condition: {
    scope: "/properties/type",
    schema: { enum: ["static", "dynamic"] },
  },
};

const SHOW_FOR_INFORMATIONAL_RULE = {
  effect: UiSchemaRuleEffects.SHOW,
  condition: {
    scope: "/properties/layout",
    schema: { const: "informational" },
  },
};

const SHOW_FOR_SIMPLE_RULE = {
  effect: UiSchemaRuleEffects.SHOW,
  condition: {
    scope: "/properties/layout",
    schema: { const: "simple" },
  },
};

const SHOW_FOR_ICON_RULE = {
  effect: UiSchemaRuleEffects.SHOW,
  condition: {
    scope: "/properties/visualInterest",
    schema: { const: "icon" },
  },
};

const SHOW_FOR_DYNAMIC_RULE = {
  condition: {
    scope: "/properties/type",
    schema: { const: "dynamic" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const SHOW_FOR_STATIC_RULE = {
  condition: {
    scope: "/properties/type",
    schema: { const: "static" },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const SHOW_FOR_SHARING_RULE = {
  condition: {
    scope: "/properties/shareable",
    schema: { const: true },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const SHOW_FOR_UNITS_SECTION_ENABLED = {
  condition: {
    schema: { const: true },
    scope: "/properties/allowUnitFormatting",
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const SHOW_FOR_LINK_SECTION_ENABLED_AND_STATIC = {
  condition: {
    schema: {
      properties: {
        type: { const: "static" },
        allowLink: { const: true },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};
