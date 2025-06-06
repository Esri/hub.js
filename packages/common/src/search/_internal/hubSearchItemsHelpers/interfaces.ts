import { IHubSearchOptions } from "../../types/IHubSearchOptions";

// TODO: fill out the 'any' fields of OGC Items
// with more descriptive interfaces
export interface IOgcItem {
  id: string;
  type: "Feature";
  geometry: any; // for simplification
  time: any; // for simplification
  links: any[]; // for simplification
  properties: Record<string, any>;
}

interface IOgcLink {
  rel: "self" | "next" | "prev" | "collection";
  type: string;
  title: string;
  href: string;
}

export interface IOgcItemsResponse {
  type: "FeatureCollection";
  features: IOgcItem[];
  timestamp: string;
  numberMatched: number;
  numberReturned: number;
  links: IOgcLink[];
}

interface IOgcItemFieldAggregation {
  field: string;
  aggregations: Array<{ label: string; value: any }>;
}

export interface IOgcAggregationsResponse {
  aggregations: {
    aggregations: IOgcItemFieldAggregation[];
  };
  timestamp: string;
  links: IOgcLink[];
}

/**
 * @private
 * Interface for the options object passed to the searchOgcItems function.
 * Unlike IHubSearchOptions, this interface does not accept aggregation
 * properties or properties marked for deprecation.
 */
export type ISearchOgcItemsOptions = Omit<
  IHubSearchOptions,
  "aggFields" | "aggLimit" | "api" | "authentication" | "page"
>;
