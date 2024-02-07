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
        scope: "/properties/entityId",
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
                          type: "Hub Site Application",
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
        scope: "/properties/callToActionText",
        type: "Control",
        options: {
          type: "textarea",
          rows: 4,
        },
      },
      {
        label: "Alignment",
        scope: "/properties/callToActionAlign",
        type: "Control",
        options: {
          control: "hub-field-input-alignment",
          layout: "inline-space-between",
        },
      },
      {
        label: "Follow",
        scope: "/properties/buttonText",
        type: "Control",
      },
      {
        label: "Unfollow",
        scope: "/properties/unfollowButtonText",
        type: "Control",
      },
      {
        label: "Button Alignment",
        scope: "/properties/buttonAlign",
        type: "Control",
        options: {
          control: "hub-field-input-alignment",
          layout: "inline-space-between",
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
