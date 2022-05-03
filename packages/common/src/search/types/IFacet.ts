import { IFacetOption } from "./IFacetOption";

// User controlled refinements of a query.
// can be static or dynamic (based on stats from the api)

export interface IFacet {
  // Translated label for the facet
  label: string;
  // Unique key, used for query params and telemetry
  key: string;
  // aggregate field for dyanmic facets
  aggField?: string;
  // limit of aggregates returned. Max 200
  aggLimit?: number;
  // Display for this facet. Not all facets will be compatible with all displays
  display: "single-select" | "multi-select" | "date-range" | "histogram";
  // State of the Facet
  state?: "open" | "closed";
  // Individual options for this Facet
  options?: IFacetOption[];
  // Operation when combining the filter options
  operation?: "OR" | "AND";
  // Number of facet options to show by default. Only applies to `multi-select`, and defaults to all.
  optionLimit?: number;

  // DEPRECATE
  accordionClosed?: boolean; // -> state: "closed"
  type?: "single-select" | "multi-select" | "date-range" | "histogram"; // -> display
  pageSize?: number;
}
