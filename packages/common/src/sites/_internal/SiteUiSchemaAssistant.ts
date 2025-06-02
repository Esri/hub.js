import type { IArcGISContext } from "../../types/IArcGISContext";
import { IHubSite } from "../../core";
import { IUiSchema } from "../../core/schemas/types";

/**
 * @private
 * constructs the edit uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site editing experience
 */
export const buildUiSchema = (
  i18nScope: string,
  options: Partial<IHubSite>,
  context: IArcGISContext
): IUiSchema => {
  // NOTE: if this is not defined on the site then
  // the component will use the authenticated user's org
  // which may not be the same as the site's org
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        label: "Availability",
        elements: [
          {
            label: "Enable AI Assistant",
            scope: "/properties/enabled",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
            },
          },
          {
            scope: "/properties/access",
            type: "Control",
            options: {
              control: "arcgis-hub-access-level-controls",
              itemType: "assistant",
              orgName: context.portal.name,
            },
          },
        ],
      },
      {
        type: "Section",
        label: "Personality",
        options: {
          helperText: {
            label:
              "Configure the type of personality you would like your assistant to have when speaking to users",
          },
        },
        elements: [
          {
            label: "Assistant Personality",
            scope: "/properties/personality",
            type: "Control",
            options: {
              control: "hub-field-input-input",
              type: "textarea",
              placeholder:
                "Describe the personality you would like the assistant to have.",
              helperText: {
                label:
                  'Examples: "Speak in a casual manner", "Be upbeat and positive", "Respond at an 8th grade level"',
              },
            },
          },
        ],
      },
      {
        type: "Section",
        label: "Example Prompts",
        options: {
          helperText: {
            label:
              "Configure the example prompts your assistant will suggest to users",
          },
        },
        elements: [
          {
            label: "Example Prompts",
            scope: "/properties/examplePrompts",
            type: "Control",
            options: {
              control: "hub-field-input-combobox",
              placeholder: "Enter prompt...",
              allowCustomValues: true,
              helperText: {
                label:
                  'Examples: "Find parks in my area", "Show me a map of polling locations"',
              },
            },
          },
        ],
      },
    ],
  };
};
