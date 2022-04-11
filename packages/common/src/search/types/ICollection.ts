import { IFacet } from "./IFacet";
import { Filter, FilterType, ISortOption } from "./types";

/**
 * A Collection is a subset of a Catalog, but can be used independently
 * in Galleries
 */
export interface ICollection {
  // String to show in the UI. translated.
  label: string;
  // Unique key, used for query params and telemetry
  key: string;
  // Default query for the Collectoin
  defaultQuery?: string;
  // Default Sorts
  sortOption: ISortOption;
  // Filter defines the "scope" of the Collection, typically a set of groups or orgids
  filter: Filter<FilterType>;
  // Facets available for this Collection
  facets?: IFacet[];
}
