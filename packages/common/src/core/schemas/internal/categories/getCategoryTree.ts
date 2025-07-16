import { capitalize } from "../../../../util";
import {
  isAggregationCategory,
  isFullyQualifiedCategory,
  isOrganizationCategory,
} from "./isFullyQualifiedCategory";

/**
 * Represents a category tree structure.
 * Each node has a label, a value, and potentially children.
 */
export interface ICategoryTree {
  label: string;
  value: string;
  children: Record<string, ICategoryTree>;
}

/**
 * Constructs a hierarchical category tree from an array of fully qualified category strings.
 * The categories must all start with the same prefix, either "/categories/" or "/Categories/".
 * Intermediary nodes are created as necessary to complete the tree structure.
 *
 * @param categories An array of fully qualified category strings.
 * @returns An ICategoryTree representing the hierarchical structure of the categories.
 */
export function getCategoryTree(categories: string[]): ICategoryTree {
  // Ensure that all categories are fully qualified
  const invalidCategories = categories.filter(
    (category) => !isFullyQualifiedCategory(category)
  );
  if (invalidCategories.length) {
    throw new Error(
      `Invalid categories found: ${invalidCategories.join(", ")}`
    );
  }

  // Ensure that all categories start with the same prefix
  const hasAggCategoryPrefix = categories.every(isAggregationCategory);
  const hasOrgCategoryPrefix = categories.every(isOrganizationCategory);
  if (!hasAggCategoryPrefix && !hasOrgCategoryPrefix) {
    throw new Error(
      "All categories must have the same prefix ('/categories/' or '/Categories/')"
    );
  }

  // Calculate any categories that we need to complete the tree
  const missingCategories = getMissingCategories(categories);

  // Append each category to the tree
  const parentTree: ICategoryTree = {
    label: "root",
    children: {},
    value: null,
  };
  [...categories, ...missingCategories].forEach((category) => {
    const path = category.slice(1).split("/");
    addTreeBranches(parentTree, category, path);
  });

  // The first child of the root is the actual category tree, so we return it directly.
  return Object.values(parentTree.children)[0];
}

/**
 * This function checks for any missing categories in the existing categories.
 * It returns an array of categories that are missing, which are necessary to complete the tree structure.
 *
 * The function assumes that the categories are fully qualified and start with the same prefix.
 *
 * @param existingCategories An array of existing fully qualified category strings.
 * @returns array of missing categories that need to be added to complete the tree structure.
 */
function getMissingCategories(existingCategories: string[]): string[] {
  const missingCategories: string[] = [];
  const pathsChecked: Record<string, boolean> = {};
  existingCategories.forEach((category) => {
    // Split the path into segments and check if each segment is present in the existing categories.
    // NOTE: we omit the first `/` for ease of processing
    const pathSegments = category.slice(1).split("/");
    pathSegments.reduce((pathSoFar, segment) => {
      const updatedPath = `${pathSoFar}/${segment}`;

      // If we haven't already checked this path, check if it exists in the existing categories.
      if (!pathsChecked[updatedPath]) {
        // Mark this path to avoid duplicate checks
        pathsChecked[updatedPath] = true;
        // Create a new category if it doesn't exist.
        const match = existingCategories.find((c) => c === updatedPath);
        if (!match) {
          missingCategories.push(updatedPath);
        }
      }

      return updatedPath;
    }, "");
  });

  return missingCategories;
}

/**
 * Akin to mkdir -p, this function recursively traverses
 * a tree path and creates the final indicated node. Also
 * creates intermediary nodes if they do not exist.
 *
 * @param subtree the current root node
 * @param category the fully qualified category to be added to the final node
 * @param path the remaining path to the final node
 */
const addTreeBranches = (
  subtree: ICategoryTree,
  category: string,
  path: string[]
): void => {
  if (!path.length) {
    const label = category.split("/").pop();
    // Search aggregation categories are all lowercase, so we capitalize the first letter for display purposes.
    subtree.label = isAggregationCategory(category) ? capitalize(label) : label;
    subtree.value = category;
  } else {
    const nextPath = path.shift();
    const nextSubTree = subtree.children[nextPath] || {
      label: nextPath,
      children: {},
      value: null,
    };
    subtree.children[nextPath] = nextSubTree;
    addTreeBranches(nextSubTree, category, path);
  }
};
