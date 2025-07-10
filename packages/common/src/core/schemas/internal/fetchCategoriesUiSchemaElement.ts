import { hubSearch } from "../../../search/hubSearch";
import { IQuery } from "../../../search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../search/types/IHubSearchOptions";
import type { IArcGISContext } from "../../../types/IArcGISContext";
import { IUiSchemaComboboxItem, IUiSchemaElement, UiSchemaRuleEffects } from "../types";
import { fetchCategoryItems } from "./fetchCategoryItems";

export type IFetchCategoriesUiSchemaElementOptions = IFromOrgOptions | IFromQueryOptions;

interface IBaseOptions {
  source : "org" | "query";
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

export async function fetchCategoriesUiSchemaElement(
  opts: IFetchCategoriesUiSchemaElementOptions
): Promise<IUiSchemaElement[]> {
  const recognizedCategories = opts.source === "org"
    ? await fetchOrgCategories(opts)
    : await fetchQueryCategories(opts);

  const currentValues = opts.currentValues || [];

  const unrecognizedFullCategories = (currentValues).filter(
    (value) => value.toLowerCase().startsWith("/categories/") && !recognizedCategories.includes(value)
  );

  const unrecognizedPartialCategories = (currentValues).filter(
    (value) => !value.toLowerCase().startsWith("/categories/") && !recognizedCategories.includes(value)
  );

  // Convert the recognized categories to combobox items
  const recognizedItems = categoriesToComboboxItems(recognizedCategories);

  // Convert the unrecognized categories to combobox items
  const unrecognizedFullItems = categoriesToComboboxItems(unrecognizedFullCategories);
  const unrecognizedPartialItems: IUiSchemaComboboxItem[] = unrecognizedPartialCategories.map(
    (category) => ({
      label: category,
      value: category,
      children: [] as IUiSchemaComboboxItem[],
    })
  );
  const unrecognizedItems = [...unrecognizedPartialItems, ...unrecognizedFullItems];

  const fieldOptions: Record<string, unknown> = {
    control: "hub-field-input-combobox",
    allowCustomValues: false,
    selectionMode: "ancestors",
    placeholderIcon: "select-category",
  }

  // If there are categories that don't belong to the org,
  // we need to show them in a separate group.
  fieldOptions.groups = [
    !!unrecognizedItems.length && {
      label: "{{shared.fields.categories.unrecognizedCategoriesGroup.label:translate}}",
      items: unrecognizedItems,
    },
    !!recognizedItems.length && {
      label: "{{shared.fields.categories.recognizedCategoriesGroup.label:translate}}",
      items: recognizedItems,
    },
  ].filter(Boolean);

  const noCategoriesPresent = !recognizedItems.length && !unrecognizedItems.length;
  return [
    {
      // labelKey: `shared.fields.categories.label`,
      label: opts.source === "org"
        ? "Categories (Populated from organization)"
        : "Categories (Populated from site's catalog)",
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
          conditions: [noCategoriesPresent],
        },
      ],
    },
  ];
}

async function fetchOrgCategories(opts: IFromOrgOptions): Promise<string[]> {
  // TODO: Refactor this
  const items = await fetchCategoryItems(
    opts.context.portal.id,
    opts.context.hubRequestOptions
  );

  const getCategoriesFromComboboxItem = (item: IUiSchemaComboboxItem): string[] => {
    const categories: string[] = [];
    if (item.value) {
      categories.push(item.value);
    }
    if (item.children) {
      item.children.forEach(child => {
        categories.push(...getCategoriesFromComboboxItem(child));
      });
    }
    return categories;
  }

  return items.reduce((acc: string[], item: IUiSchemaComboboxItem) => {
    return acc.concat(getCategoriesFromComboboxItem(item));
  }, []);
}

async function fetchQueryCategories(opts: IFromQueryOptions): Promise<string[]> {
  const searchOptions: IHubSearchOptions = {
      // api: this.api,
      num: 1,
      include: [],
      requestOptions: opts.context.hubRequestOptions,
      aggLimit: 200,
      httpMethod: 'POST',
      aggFields: ['categories'],
    }

    const response = await hubSearch(opts.query, searchOptions);
    const categoriesAggregation = response.aggregations?.find(
      (agg) => agg.field === 'categories'
    );
    if (!categoriesAggregation) {
      throw new Error(`No categories aggregation found while calculating categories for query`);
    }
    return categoriesAggregation.values
      .map((v) => v.value as string)
      .filter((v) => v.toLowerCase().startsWith("/categories/"));
}

/**
 * Returns the UI schema element needed to render
 * the categories editing control for an entity.
 *
 * @param i18nScope i18n scope for the entity translations
 * @param entity The entity to build the UI schema for
 * @returns the UI schema element for thumbnail editing
 */
export async function oldfetchCategoriesUiSchemaElement(
  currentValues: string[] = [],
  context: IArcGISContext,
): Promise<IUiSchemaElement[]> {
  const orgCategoryItems = await fetchCategoryItems(
    context.portal.id,
    context.hubRequestOptions
  );
  const nonOrgCategoryItems = getNonOrgCategoryItems(
    currentValues,
    orgCategoryItems
  );

  const options: Record<string, unknown> = {
    control: "hub-field-input-combobox",
    allowCustomValues: false,
    selectionMode: "ancestors",
    placeholderIcon: "select-category",
  }

  // If there are categories that don't belong to the org,
  // we need to show them in a separate group.
  options.groups = [
    !!nonOrgCategoryItems.length && {
      label: "{{shared.fields.categories.nonOrgCategoriesGroup.label:translate}}",
      items: nonOrgCategoryItems,
    },
    !!orgCategoryItems.length && {
      label: "{{shared.fields.categories.orgCategoriesGroup.label:translate}}",
      items: orgCategoryItems,
    },
  ].filter(Boolean);

  const noCategoriesPresent = !orgCategoryItems.length && !nonOrgCategoryItems.length;
  return [
    {
      labelKey: `shared.fields.categories.label`,
      scope: "/properties/categories",
      type: "Control",
      options,
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
          conditions: [noCategoriesPresent],
        },
      ],
    },
  ];
}

function getNonOrgCategoryItems(
  currentValues: string[],
  orgCategoryItems: IUiSchemaComboboxItem[],
): IUiSchemaComboboxItem[] {
  // Filter out current values that aren't prefixed with `/categories/`
  const validValues = currentValues.filter(
    (value) => value.toLowerCase().startsWith("/categories/")
  );
  // Find values that do not match any of the org category items
  const nonMatchingValues = validValues.filter(
    (value) => !orgCategoryItems.some((item) => matchesComboboxItem(value, item))
  );
  return categoriesToComboboxItems(nonMatchingValues);
}

function matchesComboboxItem(value: string, item: IUiSchemaComboboxItem): boolean {
  const hasMatchingValue = item.value === value;
  return hasMatchingValue || (item.children || []).some(child => matchesComboboxItem(value, child));
}

function categoriesToComboboxItems(categories: string[]): IUiSchemaComboboxItem[] {
  if (!categories.length) {
    return [];
  }
  // Calculate the category tree from the provided categories
  const tree = getCategoryTree(categories);
  // Convert the tree to combobox items, excluding the root `/categories/` node
  return treeToComboboxItems(tree, false);
}

function treeToComboboxItems (tree: ICategoryTree, includeRoot = true): IUiSchemaComboboxItem[] {
  // Calculate child items from the tree
  const childItems: IUiSchemaComboboxItem[] = Object.values(tree.children)
    .reduce(
      (items: IUiSchemaComboboxItem[], child: ICategoryTree) => 
        items.concat(treeToComboboxItems(child))
    , [])

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

type ICategoryTree = {
  label: string;
  value: string;
  children: Record<string, ICategoryTree>;
};

function getCategoryTree(categories: string[]): ICategoryTree {
  const parentTree: ICategoryTree = { label: 'root', children: {}, value: null };
  const missingCategories = getMissingCategories(categories);
  [...categories, ...missingCategories].forEach(category => {
      const path = category.slice(1).split('/');
      addTreeBranches(parentTree, category, path);
  });
  const children = Object.values(parentTree.children);
  // If the root has anything other than one child (/categories), throw an error as we have an invalid tree.
  if (children.length < 1 || children.length > 1) {
    throw new Error(`Expected a single child in the category tree, but found ${children.length}.`);
  }
  return children[0];
}

// Calculate any categories that we need to have a complete tree
function getMissingCategories(existingCategories: string[]): string[] {
  const missingCategories: string[] = [];
  const pathsChecked: Record<string, boolean> = {};
  existingCategories.forEach(category => {
    // Split the path into segments and check if each segment is present in the existing categories.
    // NOTE: we omit the first `/` for ease of processing
    const pathSegments = category.slice(1).split('/');
    pathSegments.reduce((pathSoFar, segment) => {
      const updatedPath = `${pathSoFar}/${segment}`;

      // If we haven't already checked this path, check if it exists in the existing categories.
      if (!pathsChecked[updatedPath]) {
        // Mark this path to avoid duplicate checks
        pathsChecked[updatedPath] = true;
        // Create a new category if it doesn't exist.
        const match = existingCategories.find(c =>  c === updatedPath);
        if (!match) {
          // NOTE: We cannot calculate the count for pseudo existing categories.
          // on the client, so we leave it as undefined.
          missingCategories.push(updatedPath);
        }
      }

      return updatedPath;
    }, '');
  });

  return missingCategories;
}

/**
 * Akin to mkdir -p, this function recursively traverses
 * a tree path and creates the final indicated node. Also
 * creates intermediary nodes if they do not exist.
 *
 * @param subtree the current root node
 * @param facetOption the facet option to be added to the final node
 * @param path the remaining path to the final node
 */
const addTreeBranches = (
    subtree: ICategoryTree,
    category: string,
    path: string[]
): void => {
    if (!path.length) {
      subtree.label = category.split('/').pop();
      subtree.value = category;
    } else {
        const nextPath = path.shift();
        const nextSubTree = subtree.children[nextPath] || { label: nextPath, children: {}, value: null };
        subtree.children[nextPath] = nextSubTree;
        addTreeBranches(nextSubTree, category, path);
    }
}