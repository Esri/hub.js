import { fetchOrgCategories } from "./categories/fetchOrgCategories";
import { fetchQueryCategories } from "./categories/fetchQueryCategories";
import { getCategoryTree, ICategoryTree } from "./categories/getCategoryTree";
import { isFullyQualifiedCategory } from "./categories/isFullyQualifiedCategory";
import { IQuery } from "../../../search/types/IHubCatalog";
import type { IArcGISContext } from "../../../types/IArcGISContext";
import {
  IUiSchemaComboboxItem,
  IUiSchemaElement,
  UiSchemaRuleEffects,
} from "../types";
import { Logger } from "../../../utils/logger";

export type IFetchCategoriesUiSchemaElementOptions =
  | IFromOrgOptions
  | IFromQueryOptions;

interface IBaseOptions {
  source: "org" | "query";
  currentValues?: string[];
  context: IArcGISContext;
}

interface IFromOrgOptions extends IBaseOptions {
  source: "org";
}

interface IFromQueryOptions extends IBaseOptions {
  source: "query";
  query: IQuery;
}

/**
 * Fetches categories UI schema element based on the source type, authentication context, and current values.
 *
 * @param opts Options for fetching categories UI schema element.
 * @param opts.source The source of categories, either "org" or "query".
 * @param opts.currentValues Current values to consider when building the UI schema element.
 * @param opts.context The ArcGIS context containing request options and portal information.
 * @param opts.query The query to use if the source is "query".
 * @returns An array of UI schema elements for categories, including recognized and unrecognized categories.
 */
export async function fetchCategoriesUiSchemaElement(
  opts: IFetchCategoriesUiSchemaElementOptions
): Promise<IUiSchemaElement[]> {
  const recognizedCategories =
    opts.source === "org"
      ? await fetchOrgCategories(
          opts.context.portal.id,
          opts.context.hubRequestOptions
        )
      : await fetchQueryCategories(opts.query, opts.context.hubRequestOptions);

  const unrecognizedValues = (opts.currentValues || []).filter(
    (value) => !recognizedCategories.includes(value)
  );

  // Split unrecognized values into full and partial categories
  const unrecognizedFullCategories: string[] = [];
  const unrecognizedPartialCategories: string[] = [];
  unrecognizedValues.forEach((value) => {
    isFullyQualifiedCategory(value)
      ? unrecognizedFullCategories.push(value)
      : unrecognizedPartialCategories.push(value);
  });

  // Convert the recognized categories to nested combobox items
  const recognizedItems = toNestedComboboxItems(recognizedCategories);

  // Convert the unrecognized fully-qualified categories to nested combobox items
  const unrecognizedFullItems = toNestedComboboxItems(
    unrecognizedFullCategories
  );

  // Convert the unrecognized partial categories to top-level combobox items since we don't have a full path for them
  const unrecognizedPartialItems = toFlattenedComboboxItems(
    unrecognizedPartialCategories
  );

  // Place partial items at the front for better visibility
  const unrecognizedItems = [
    ...unrecognizedPartialItems,
    ...unrecognizedFullItems,
  ];

  const fieldOptions: Record<string, unknown> = {
    control: "hub-field-input-combobox",
    allowCustomValues: false,
    placeholder: "{{shared.fields.categories.placeholder:translate}}",
    selectionDisplay: "fit",
    selectionMode: "multiple",
  };

  // Construct groups for the combobox items
  fieldOptions.groups = [
    !!unrecognizedItems.length && {
      label:
        "{{shared.fields.categories.unrecognizedCategoriesGroup.label:translate}}",
      items: unrecognizedItems,
    },
    !!recognizedItems.length && {
      label:
        "{{shared.fields.categories.recognizedCategoriesGroup.label:translate}}",
      items: recognizedItems,
    },
  ].filter(Boolean);

  const noCategoriesPresent =
    !recognizedItems.length && !unrecognizedItems.length;
  return [
    {
      labelKey: `shared.fields.categories.label`,
      scope: "/properties/categories",
      type: "Control",
      options: fieldOptions,
      rules: [
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [noCategoriesPresent],
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
              href: "https://doc.arcgis.com/en/arcgis-online/reference/content-categories.htm",
              target: "_blank",
            },
          ],
        },
      },
      rules: [
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [noCategoriesPresent],
        },
      ],
    },
  ];
}

function toNestedComboboxItems(categories: string[]): IUiSchemaComboboxItem[] {
  if (!categories.length) {
    return [];
  }

  let result: IUiSchemaComboboxItem[];
  try {
    // Calculate the category tree from the provided categories
    const tree = getCategoryTree(categories);
    // Convert the tree to combobox items, excluding the root `/categories/` node
    result = treeToComboboxItems(tree, false);
  } catch (e) {
    const error = e as Error;
    Logger.error(
      `Error building nested category list; falling back to flattened list: ${error.message}`
    );
    result = toFlattenedComboboxItems(categories);
  }

  return result;
}

function toFlattenedComboboxItems(
  categories: string[]
): IUiSchemaComboboxItem[] {
  return categories.map((category) => ({
    label: category,
    value: category,
    children: [] as IUiSchemaComboboxItem[],
  }));
}

function treeToComboboxItems(
  tree: ICategoryTree,
  includeRoot = true
): IUiSchemaComboboxItem[] {
  // Calculate child items from the tree
  const childItems: IUiSchemaComboboxItem[] = Object.values(
    tree.children
  ).reduce(
    (items: IUiSchemaComboboxItem[], child: ICategoryTree) =>
      items.concat(treeToComboboxItems(child)),
    []
  );

  // If includeRoot is true, create a parent item that represents the root of the tree
  let parentItem: IUiSchemaComboboxItem;
  if (includeRoot) {
    parentItem = {
      label: tree.label,
      value: tree.value,
      children: childItems,
    };
  }

  return parentItem ? [parentItem] : childItems;
}
