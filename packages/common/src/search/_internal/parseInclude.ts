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
 * Include String structure:
 * - `enrichment{.deep.path} AS propertyName`
 *
 * Examples
 * - `server.layers.0.name as layerName` -> use the server enrichment, extract the name of the first layer and attach that as `layerName`
 * - `server.layers` ->  use the `server` enrichment, attach the `layers` array as `layers`
 * @param include
 * @returns
 */
export function parseInclude(include: string): IIncludeSpec {
  // TODO: Validate enrichment
  const parts = include.split(" AS ");
  const path = parts[0];
  const prop = parts[1] || path.split(".").reverse()[0];
  const enrichment = path.split(".")[0] as unknown as ItemOrServerEnrichment;
  // We need the actual list of string values so we can verify
  // what we get in, is infact a valid enrichment.
  const spec: IIncludeSpec = {
    enrichment,
    path,
    prop,
  };
  // split on " AS "
  // const parts = include.split(" AS ");
  // spec.path = parts[0];

  // if (parts[1]) {
  //   spec.prop = parts[1];
  // } else {
  //   spec.prop = spec.path.split(".").reverse()[0];
  // }

  return spec;
}
