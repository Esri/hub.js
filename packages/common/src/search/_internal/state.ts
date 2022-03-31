import { getProp } from "../../objects";
import { cloneObject, maybeAdd } from "../../util";
import {
  ICollection,
  ICollectionState,
  IFacet,
  IFacetState,
  ISortOption,
} from "../types";

/**
 * Apply ICollectionState to an ICollection
 *
 * Typically used in a Gallery or Catalog component to
 * set the inital state, based on values deserialized
 * from a query string
 * @param collection
 * @param state
 * @returns
 */
export function applyCollectionState(
  collection: ICollection,
  state: ICollectionState
): ICollection {
  let updated = cloneObject(collection);
  // Apply default query
  if (state.query) {
    updated.defaultQuery = state.query;
  }

  // Apply Sort State
  updated.sortOption = applySortState(updated.sortOption, state.sort);

  // Apply Facet State
  updated.facets = updated.facets.map((facet) => {
    if (getProp(state, `facetState.${facet.key}`)) {
      return applyFacetState(facet, state.facetState);
    } else {
      return facet;
    }
  });

  return updated;
}

export function applySortState(
  sortOptions: ISortOption,
  sortState: string
): ISortOption {
  const updated = cloneObject(sortOptions);
  if (sortState) {
    const [label, attribute, order] = sortState.split("|");
    updated.label = label;
    updated.attribute = attribute;
    updated.order = order;
  }
  return updated;
}

export function serializeSortState(sort: ISortOption): string {
  return `${sort.label}|${sort.attribute}|${sort.order}`;
}

/**
 * Intentionally mutates
 * @param facet
 * @param state
 * @returns
 */
export function applyFacetState(facet: IFacet, state: IFacetState): IFacet {
  let updated = cloneObject(facet);

  switch (facet.display) {
    case "single-select":
      updated = applySingleSelectFacetState(facet, state);
      break;
    case "multi-select":
      updated = applyMultiSelectFacetState(facet, state);
      break;
    case "date-range":
      break;
    case "histogram":
      break;
    default:
      // no default behavior
      break;
  }

  return updated;
}

/**
 * Apply the Facet State onto a Facet
 *
 * Intentionally mutates the facet.
 * @param facet
 * @param state
 * @returns
 */
function applySingleSelectFacetState(
  facet: IFacet,
  state: IFacetState
): IFacet {
  const updated = cloneObject(facet);
  updated.options = updated.options.map((o) => {
    o.selected = o.key === state[facet.key];
    return o;
  });
  return updated;
}

function serializeSingleSelectFacetState(facet: IFacet): IFacetState {
  const state: IFacetState = {};
  const selected = facet.options.find((o) => o.selected);
  state[facet.key] = selected.key;
  return state;
}

/**
 * Apply the Facet State onto a Facet
 *
 * Intentionally mutates the facet.
 * @param facet
 * @param state
 * @returns
 */
function applyMultiSelectFacetState(facet: IFacet, state: IFacetState): IFacet {
  const updated = cloneObject(facet);
  const selectedKeys = state[facet.key].split(",");
  updated.options = updated.options.map((o) => {
    o.selected = selectedKeys.includes(o.key);
    return o;
  });
  return updated;
}

function serializeMultiSelectFacetState(facet: IFacet): IFacetState {
  const state: IFacetState = {};
  const selected = facet.options.filter((o) => o.selected);
  state[facet.key] = selected.map((o) => o.key).join(",");
  return state;
}
