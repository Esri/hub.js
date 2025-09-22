import { IUiSchemaElement } from "../types";

/**
 * When creating an entity, an editor can elect to choose
 * a layout for the new entity. The following util builds
 * the UiSchema elements to render this configuration in
 * various creation flows.
 *
 * @param i18nScope intl - scope for translations
 */
export function getLayoutSetupUiSchemaElement(
  i18nScope: string
): IUiSchemaElement[] {
  const itemTypeNameSpace = i18nScope.includes("page") ? "page" : "site";
  const intlScopePrefix = `${itemTypeNameSpace}.fields._layoutSetup.type`;
  const typeSpecificLayoutLabel = `{{${intlScopePrefix}.layout:translate}}`;

  const layoutTypes = ["blank", "simple"] as const;
  const buildI18nStrings = (part: "label" | "description") =>
    layoutTypes.map(
      (type) => `{{${intlScopePrefix}.${type}.${part}:translate}}`
    );

  const labels = buildI18nStrings("label");
  const descriptions = buildI18nStrings("description");
  return [
    {
      label: typeSpecificLayoutLabel,
      scope: "/properties/_layoutSetup/properties/layout",
      type: "Control",
      options: {
        control: "hub-field-input-tile-select",
        labels,
        descriptions,
        icons: ["rectangle", "group-layout-elements"],
        layout: "horizontal",
      },
    },
  ];
}
