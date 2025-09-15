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
export function getLayoutSetupUiSchemaElement(
  i18nScope: string
): IUiSchemaElement[] {
  const siteOrPageString = i18nScope.includes("site")
    ? "{{shared.fields._layoutSetup.type.siteLayout:translate}}"
    : "{{shared.fields._layoutSetup.type.pageLayout:translate}}";
  return [
    {
      label: siteOrPageString,
      scope: "/properties/_layoutSetup/properties/layout",
      type: "Control",
      options: {
        control: "hub-field-input-tile-select",
        labels: [
          "{{shared.fields._layoutSetup.type.blank.label:translate}}",
          "{{shared.fields._layoutSetup.type.simple.label:translate}}",
        ],
        descriptions: [
          "{{shared.fields._layoutSetup.type.blank.description:translate}}",
          "{{shared.fields._layoutSetup.type.simple.description:translate}}",
        ],
        icons: ["rectangle", "group-layout-elements"],
        layout: "horizontal",
      },
    },
  ];
}
