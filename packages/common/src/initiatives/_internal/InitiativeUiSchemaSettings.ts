import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubInitiative } from "../../core/types";

/**
 * @private
 * constructs the settings uiSchema for Hub Initiatives.
 * This defines how the schema properties should be rendered
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
        label: "Map settings",
        options: {
          helperText: {
            label: "Select an existing web map or scene to dispaly",
          },
        },
        elements: [
          {
            scope: "/properties/view/properties/featuredEmbed",
            type: "Control",
            options: {
              control: "hub-composite-input-embed",
              pickerTitle: "Select map or scene",
              catalogs: [
                {
                  schemaVersion: 1,
                  title: "My content",
                  scopes: {
                    item: {
                      targetEntity: "item",
                      filters: [
                        {
                          predicates: [{ owner: context.currentUser.username }],
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
                          { predicates: [{ type: ["Web Map", "Web Scene"] }] },
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
                        { predicates: [{ orgid: context.currentUser.orgId }] },
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
                          { predicates: [{ type: ["Web Map", "Web Scene"] }] },
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
                          { predicates: [{ type: ["Web Map", "Web Scene"] }] },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  };
};
