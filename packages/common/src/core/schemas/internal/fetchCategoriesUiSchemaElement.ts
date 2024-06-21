import { IArcGISContext } from "../../../ArcGISContext";
import {
  IUiSchemaElement,
  IUiSchemaMessage,
  UiSchemaMessageTypes,
} from "../types";
import { getCategoryItems } from "./getCategoryItems";

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
): Promise<IUiSchemaElement> {
  const categoryItems = await getCategoryItems(
    context.portal.id,
    context.hubRequestOptions
  );

  const result: IUiSchemaElement = {
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
  };

  if (!categoryItems.length) {
    result.options.disabled = true;
    result.options.messages = [
      {
        type: UiSchemaMessageTypes.custom,
        display: "notice",
        kind: "warning",
        icon: "exclamation-mark-triangle",
        labelKey: "shared.fields.categories.noCategoriesNotice.body",
        link: {
          href: "https://doc.arcgis.com/en/arcgis-online/reference/content-categories.htm",
          labelKey: "shared.fields.categories.noCategoriesNotice.link",
          target: "_blank",
          iconEnd: "launch",
        },
        allowShowBeforeInteract: true,
        alwaysShow: true,
      } as IUiSchemaMessage,
    ];
  }

  return result;
}
