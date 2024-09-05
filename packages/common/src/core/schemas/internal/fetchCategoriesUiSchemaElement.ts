import { IArcGISContext } from "../../../ArcGISContext";
import { IUiSchemaElement, UiSchemaRuleEffects } from "../types";
import { fetchCategoryItems } from "./fetchCategoryItems";

/**
 * Returns the UI schema element needed to render
 * the categories editing control for an entity.
 *
 * @param i18nScope i18n scope for the entity translations
 * @param entity The entity to build the UI schema for
 * @returns the UI schema element for thumbnail editing
 */
export async function fetchCategoriesUiSchemaElement(
  i18nScope: string,
  context: IArcGISContext
): Promise<IUiSchemaElement[]> {
  const categoryItems = await fetchCategoryItems(
    context.portal.id,
    context.hubRequestOptions
  );

  return [
    {
      labelKey: `shared.fields.categories.label`,
      scope: "/properties/categories",
      type: "Control",
      options: {
        control: "hub-field-input-combobox",
        items: categoryItems,
        allowCustomValues: false,
        selectionMode: "ancestors",
        placeholderIcon: "select-category",
        helperText: {
          // helper text varies between entity types
          labelKey: `${i18nScope}.fields.categories.helperText`,
        },
      },
      rules: [
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [!categoryItems.length],
        },
      ],
    },
    {
      type: "Notice",
      options: {
        notice: {
          configuration: {
            id: "no-categories-notice",
            noticeType: "notice",
            closable: false,
            icon: "exclamation-mark-triangle",
            kind: "warning",
            scale: "m",
          },
          message:
            "{{shared.fields.categories.noCategoriesNotice.body:translate}}",
          autoShow: true,
          actions: [
            {
              label:
                "{{shared.fields.categories.noCategoriesNotice.link:translate}}",
              icon: "launch",
              href: "https://doc.arcgis.com/en/arcgis-online/reference/content-categories.htm",
              target: "_blank",
            },
          ],
        },
      },
      rules: [
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [!categoryItems.length],
        },
      ],
    },
  ];
}
