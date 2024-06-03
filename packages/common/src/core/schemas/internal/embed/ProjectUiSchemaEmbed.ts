import {
  IArcGISContext,
  IUiSchema,
  IUiSchemaRule,
  UiSchemaRuleEffects,
  WellKnownCatalog,
  WellKnownCollection,
  getWellKnownCatalog,
} from "../../../..";
import { IHubProject } from "../../../types";

const SCHEMA_SCOPE = "/properties/view/properties/featuredEmbed";

const SHOW_FOR_STANDARD_ID: IUiSchemaRule = {
  condition: {
    schema: {
      type: "object",
      properties: {
        view: {
          properties: {
            featuredEmbed: {
              properties: {
                standard: {
                  properties: { id: { not: { const: [] } } },
                },
              },
            },
          },
        },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const SHOW_FOR_MOBILE_ID: IUiSchemaRule = {
  condition: {
    schema: {
      type: "object",
      properties: {
        view: {
          properties: {
            featuredEmbed: {
              properties: {
                mobile: {
                  properties: { id: { not: { const: [] } } },
                },
              },
            },
          },
        },
      },
    },
  },
  effect: UiSchemaRuleEffects.SHOW,
};

const buildEmbedCatalogs = (context: IArcGISContext) => {
  const catalogNames: WellKnownCatalog[] = [
    "myContent",
    "favorites",
    "organization",
    "world",
  ];

  const catalogs = catalogNames.map((name: WellKnownCatalog) => {
    const opts = {
      user: context.currentUser,
      collectionNames: ["appAndMap" as WellKnownCollection],
    };
    const catalog = getWellKnownCatalog(
      "shared.fields.featuredEmbed",
      name,
      "item",
      opts
    );
    return catalog;
  });

  return catalogs;
};

export const buildUiSchema = async (
  i18nScope: string,
  config: Partial<IHubProject>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        options: {
          section: "stepper",
        },
        elements: [
          {
            type: "Section",
            label: "Default",
            options: {
              section: "step",
            },
            elements: [
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/standard/properties/id`,
                options: {
                  control: "hub-field-input-gallery-picker",
                  linkTarget: "siteRelative",
                  catalogs: buildEmbedCatalogs(context),
                  pickerTitle: {
                    label: "Select application",
                  },
                  facets: [
                    {
                      label: `{{${i18nScope}.fields.featuredContent.facets.type:translate}}`,
                      key: "type",
                      display: "multi-select",
                      field: "type",
                      options: [],
                      operation: "OR",
                      aggLimit: 100,
                    },
                    {
                      label: `{{${i18nScope}.fields.featuredContent.facets.sharing:translate}}`,
                      key: "access",
                      display: "multi-select",
                      field: "access",
                      options: [],
                      operation: "OR",
                    },
                  ],
                },
              },
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/standard/properties/height`,
                label: "Height (px)",
                rule: SHOW_FOR_STANDARD_ID,
                options: {
                  control: "hub-field-input-input",
                  type: "number",
                },
              },
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/standard/properties/scrollable`,
                label: "Allow scrolling",
                rule: SHOW_FOR_STANDARD_ID,
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                },
              },
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/standard/properties/hideOnMobile`,
                label: "Hide on mobile",
                rule: SHOW_FOR_STANDARD_ID,
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                  messages: [
                    {
                      type: "CUSTOM",
                      display: "notice",
                      kind: "info",
                      label:
                        "Default map will not display on smaller screens if a mobile map is selected.",
                      allowShowBeforeInteract: true,
                      alwaysShow: true,
                    },
                  ],
                },
              },
            ],
          },
          {
            type: "Section",
            label: "Mobile",
            options: {
              section: "step",
            },
            elements: [
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/mobile/properties/id`,
                options: {
                  control: "hub-field-input-gallery-picker",
                  targetEntity: "item",
                  catalogs: buildEmbedCatalogs(context),
                  linkTarget: "siteRelative",
                  pickerTitle: {
                    label: "Select application",
                  },
                  facets: [
                    {
                      label: `{{${i18nScope}.fields.featuredContent.facets.type:translate}}`,
                      key: "type",
                      display: "multi-select",
                      field: "type",
                      options: [],
                      operation: "OR",
                      aggLimit: 100,
                    },
                    {
                      label: `{{${i18nScope}.fields.featuredContent.facets.sharing:translate}}`,
                      key: "access",
                      display: "multi-select",
                      field: "access",
                      options: [],
                      operation: "OR",
                    },
                  ],
                },
              },
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/mobile/properties/height`,
                label: "Height (px)",
                rule: SHOW_FOR_MOBILE_ID,
                options: {
                  control: "hub-field-input-input",
                  type: "number",
                },
              },
              {
                type: "Control",
                scope: `${SCHEMA_SCOPE}/properties/mobile/properties/scrollable`,
                label: "Allow scrolling",
                rule: SHOW_FOR_MOBILE_ID,
                options: {
                  control: "hub-field-input-switch",
                  layout: "inline-space-between",
                },
              },
            ],
          },
        ],
      },
    ],
  };
};
