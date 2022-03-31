import { Filter, FilterType } from "./types";

// Facet Options shown in the UI

export interface IFacetOption {
  // Translated label for the option
  label: string;
  // Unique key, used for query params and telemetry
  key: string;
  // For aggregate based Facets, the count of entries in the index with this value
  count?: number;
  // is this option selected when the UI loads
  selected: boolean;
  // Filter to be applied when this option is selected
  filter: Filter<FilterType>;

  // DEPRECATED
  // value?: any;
}
