import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubInitiative } from "../../core/types";

/**
 * @private
 * constructs the settings uiSchema for Hub Initiatives.
 * This defines how the schema should be rendered
 * in the initiative settings pane
 */
export const buildUiSchema = async (
  i18nScope: string,
  options: Partial<IHubInitiative>,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        labelKey: `${i18nScope}.sections.map.label`,
        elements: [
          {
            type: "Control",
            scope: "/properties/view/properties/mapSettings",
            labelKey: `${i18nScope}.fields.map.label`,
            options: {
              type: "Control",
              control: "hub-field-input-map",
              // the settings that are visible for configuring the map
              visibleSettings: ["gallery"],
              // if the map preview is displayed
              showPreview: true,
              gallery: {
                facets: [
                  {
                    label: "Type",
                    key: "type",
                    display: "multi-select",
                    field: "type",
                    options: [],
                    operation: "OR",
                    aggLimit: 100,
                  },
                  {
                    label: "Sharing",
                    key: "access",
                    display: "multi-select",
                    field: "access",
                    options: [],
                    operation: "OR",
                  },
                ],
                catalogs: [
                  {
                    schemaVersion: 1,
                    title: "My content",
                    scopes: {
                      item: {
                        targetEntity: "item",
                        filters: [
                          {
                            predicates: [
                              { owner: context.currentUser.username },
                            ],
                          },
                        ],
                      },
                    },
                    collections: [
                      {
                        label: "Maps",
                        key: "maps",
                        targetEntity: "item",
                        include: [],
                        scope: {
                          targetEntity: "item",
                          filters: [
                            {
                              predicates: [{ type: ["Web Map", "Web Scene"] }],
                            },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    schemaVersion: 1,
                    title: "My organization",
                    scopes: {
                      item: {
                        targetEntity: "item",
                        filters: [
                          {
                            predicates: [{ orgid: context.currentUser.orgId }],
                          },
                        ],
                      },
                    },
                    collections: [
                      {
                        label: "Maps",
                        key: "maps",
                        targetEntity: "item",
                        include: [],
                        scope: {
                          targetEntity: "item",
                          filters: [
                            {
                              predicates: [{ type: ["Web Map", "Web Scene"] }],
                            },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    schemaVersion: 1,
                    title: "World (Public)",
                    scopes: {
                      item: {
                        targetEntity: "item",
                        filters: [{ predicates: [{ access: "public" }] }],
                      },
                    },
                    collections: [
                      {
                        label: "Maps",
                        key: "maps",
                        targetEntity: "item",
                        include: [],
                        scope: {
                          targetEntity: "item",
                          filters: [
                            {
                              predicates: [{ type: ["Web Map", "Web Scene"] }],
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  };
};
