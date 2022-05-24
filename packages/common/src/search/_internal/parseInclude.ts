import { ItemOrServerEnrichment } from "../../items/_enrichments";

/**
 * @private
 */
export interface IIncludeSpec {
  /**
   * The backing enrichment to fetch - group, data, metadata etc
   */
  enrichment: ItemOrServerEnrichment;
  /**
   * The Path in the backing entity to pluck out
   * If not specified, the entire entity will be returned
   */
  path: string;
  /**
   * Property name to use when attaching the information
   * to the search result object
   */
  prop?: string;
}

/**
 * Parse an IncludeSpec from the include string
 * @param include
 * @returns
 */
export function parseInclude(include: string): IIncludeSpec {
  // TODO: Validate enrichment
  // We need the actual list of string values so we can verify
  // what we get in, is infact a valid enrichment.
  const spec: IIncludeSpec = {
    enrichment: include.split(".")[0] as unknown as ItemOrServerEnrichment,
    path: "",
  };
  // split on " AS "
  const parts = include.split(" AS ");
  spec.path = parts[0];

  if (parts[1]) {
    spec.prop = parts[1];
  } else {
    spec.prop = spec.path.split(".").reverse()[0];
  }

  return spec;
}
