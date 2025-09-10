import { IUiSchemaElement } from "../types";

/**
 * When creating an entity, an editor can elect to choose
 * a layout for the new entity. The following util builds
 * the UiSchema elements to render this configuration in
 * various creation flows.
 *
 * @param i18nScope intl - scope for translations
 * @param context contextual - portal & auth information
 */
export function getLayoutSetupUiSchemaElement(): IUiSchemaElement[] {
  //TODO: uncomment when adding translations
  // i18nScope: string,
  return [
    {
      type: "Layout",
      elements: [
        {
          label: "Page Layout",
          scope: "/properties/layout",
          type: "Control",
          options: {
            control: "hub-field-input-tile-select",
            labels: ["Blank", "Simple"],
            descriptions: [
              // TODO: translate these
              "Quick start with blank layout",
              "Include a few example rows and cards",
            ],
            icons: ["rectangle", "group-layout-elements"],
            layout: "horizontal",
          },
        },
      ],
    },
  ];
}
