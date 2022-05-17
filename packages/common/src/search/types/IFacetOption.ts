import { Filter, FilterType } from "./types";

/**
 * Facet Option shown in the UI as either a radio button or checkbox
 */
export interface IFacetOption {
  /**
   * Translated label for the option
   */
  label: string;

  /**
   * Unique key, used for query params and telemetry
   */
  key: string;
  /**
   * For aggregate based Facets, the count of entries in the index with this value
   */
  count?: number;

  /**
   * Is this option selected when the UI loads
   */
  selected: boolean;

  /**
   * Filters to be applied when this option is selected
   */
  filters?: Array<Filter<FilterType>>;

  //
  /**
   * DEPRECATED: Filter to be applied when this option is selected
   */
  filter?: Filter<FilterType>;
}
