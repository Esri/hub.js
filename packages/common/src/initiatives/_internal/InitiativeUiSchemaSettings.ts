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
  initiative: IHubInitiative,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    label: "Map settings",
    options: {
      // TODO: i18nScope this string
      helperText: "Select an existing web map or scene to display",
    },
    elements: [
      {
        scope: "/properties/view/properties/mapSettings",
        type: "Control",
        options: {
          control: "hub-field-input-map",
          type: "Control",
          // TODO: i18nScope this string
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
  };
};
