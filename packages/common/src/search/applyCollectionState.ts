import { getProp } from "../objects";
import { cloneObject } from "../util";
import { ICollection, ICollectionState } from "./types";
import { applySortState, applyFacetState } from "./_internal/state";

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
  const updated = cloneObject(collection);
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
