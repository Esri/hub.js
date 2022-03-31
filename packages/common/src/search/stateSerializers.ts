import {
  serializeMultiSelectFacetState,
  serializeSingleSelectFacetState,
} from "./_internal/state";
import { IFacet, IFacetState, ISortOption } from "./types";

/**
 * Serialize the state of the SortOption into a key/value pair
 *
 * Called from the Sort component
 * @param sort
 * @returns
 */
export function serializeSortState(sort: ISortOption): string {
  return `${sort.label}|${sort.attribute}|${sort.order}`;
}

/**
 * Serialize the state of a facet into a key/value pair
 *
 * Called from the various facet components
 * @param facet
 * @returns
 */
export function serializeFacetState(facet: IFacet): IFacetState {
  let state = {};

  switch (facet.display) {
    case "single-select":
      state = serializeSingleSelectFacetState(facet);
      break;
    case "multi-select":
      state = serializeMultiSelectFacetState(facet);
      break;
    case "date-range":
      break;
    case "histogram":
      break;
    default:
      // no default behavior
      break;
  }

  return state;
}
