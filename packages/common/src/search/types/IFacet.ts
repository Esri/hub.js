import { IFacetOption } from "./IFacetOption";

/**
 * Definition of a Facet shown in the Gallery UI.
 *
 * If a `field` is specified, the Facet will be "dynamic" in that
 * it will request aggregations for the field and use the returned
 * values to create the FacetOptions.
 *
 * `Facet` contains and array if `FacetOptions`. When selected
 * in the UI, a FilterGroup is constructed from the `Facet.operation`
 * and the `Filters` are from the selected `FacetOptions`.
 */
export interface IFacet {
  /**
   * Translated label for the facet
   */
  label?: string;
  /**
   * Unique key, used for query params and telemetry
   */
  key?: string;
  /**
   * field to generate the facet from
   */
  field?: string;
  /**
   * limit of aggregates returned. Max 200
   */
  aggLimit?: number;
  /**
   * Display for this facet. Not all facets will be compatible with all displays
   */
  display?:
    | "map"
    | "single-select"
    | "multi-select"
    | "date-range"
    | "histogram";
  /**
   * State of the Facet
   */
  state?: "open" | "closed";
  /**
   * Individual options for this Facet
   */
  options?: IFacetOption[];
  /**
   * Operation is passed into the FilterGroup that is constructed
   * when the Facet is serialized.
   * Implemetations should default to "OR" if not specified
   */
  operation?: "OR" | "AND";
  /**
   * Number of facet options to show by default. Only applies to `multi-select`, and defaults to all.
   */
  optionLimit?: number;
  /**
   * Specifies how to order the facet options. Only applies to `multi-select`, and defaults to count.
   * - count: orders by `option.count` in descending order of frequency
   * - label: orders by `option.label` in ascending alphabetical order
   */
  orderBy?: "count" | "label";
  // DEPRECATE
  accordionClosed?: boolean; // -> state: "closed"
  type?: "single-select" | "multi-select" | "date-range" | "histogram"; // -> display
  pageSize?: number; // -> optionLimit
  aggField?: string; // -> field
}
