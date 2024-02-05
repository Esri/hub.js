import { IArcGISContext } from "../../../../ArcGISContext";
import { CardEditorOptions } from "../EditorOptions";
import { IUiSchema } from "../../types";

/**
 * @private
 * Exports the uiSchema of the stat card
 * @returns
 */
export const buildUiSchema = (
  i18nScope: string,
  config: CardEditorOptions,
  context: IArcGISContext
): IUiSchema => {
  return {
    type: "Layout",
    elements: [
      {
        label: "Select Entity to Follow",
        scope: "/properties/followedItemId",
        type: "Control",
        options: {
          control: "hub-field-input-gallery-picker",
          targetEntity: "item",
          catalogs: [
            {
              schemaVersion: 1,
              title: "Esri",
              scopes: {
                item: {
                  targetEntity: "item",
                  filters: [
                    {
                      predicates: [
                        {
                          type: "Hub Project",
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        label: "Call-to-Action",
        scope: "/properties/callToAction",
        type: "Control",
      },
      {
        label: "Alignment",
        scope: "/properties/callToActionAlignment",
        type: "Control",
        options: {
          control: "hub-field-input-alignment",
        },
      },
      {
        label: "Button State",
        scope: "/properties/followStateText",
        type: "Control",
        options: {
          control: "hub-field-input-input",
          type: "textarea",
        },
      },
      {
        scope: "/properties/unfollowStateText",
        type: "Control",
        options: {
          control: "hub-field-input-input",
          type: "textarea",
        },
      },
      {
        label: "Button Alignment",
        scope: "/properties/callToActionAlignment",
        type: "Control",
        options: {
          control: "hub-field-input-alignment",
        },
      },
      {
        label: "Button Style",
        scope: "/properties/buttonStyle",
        type: "Control",
        options: {
          control: "hub-field-input-select",
          labels: ["Solid Background", "Outline"],
        },
      },
    ],
  };
};
