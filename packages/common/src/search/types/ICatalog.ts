import { ICollection } from "./ICollection";
import { Filter, FilterType, IFilterGroup, ISortOption } from "./types";

/**
 * Catalog is the definition which powers what options
 * are available in a Gallery. It controls not only
 * the scoping of the search, but also the options
 * available to the UX.
 *
 * Thus the lower-level `searchContent`, `searchUser`, `searchGroup` functions
 * do not take Catalogs, rather they accept [Filters](../Filter)
 *
 * ```ts
 * const simpleCatalog:Catalog = {
 *   title: "Select Map",
 *   filters: [
 *    {
 *     fitlerType: "item",
 *      operation: "AND",
 *      fitlers
 *     filterType: "content",
 *     type: "Web Map",
 *     owner: "jsmith"
 *   }
 * }
 * ```
 *
 * ## Collections
 * The key feature of a Catalog is the ability to defined [Collections](../Collection).
 * These are essentially sub-sets of content, typically organized around
 * generalized content types, i.e. "Datasets", vs "Maps", vs "Documents"
 *
 *
 * ```ts
 * const complex:Catalog = {
 *   filter: {
 *    type: "content",
 *    groups: ["3ef", "bc4"]
 *   },
 *   collections: [
 *     {
 *       label: "Documents",
 *       filter: {
 *         filterType: "content",
 *         type: ["Microsoft Word", "PDF", "Microsoft Excel"]
 *       }
 *     },
 *     {
 *       label: "Datasets",
 *       filter: {
 *         filterType: "content",
 *         type: ["Feature Layer", "Feature Service", "Map Service", "CSV"]
 *       }
 *     }
 *   ]
 * }
 * ```
 */
export interface ICatalog {
  /**
   * Title for the Gallery
   */
  title?: string;
  /**
   * Scope is a set of FilterGroups which define the limits of the Catalog.
   * Typically it is just a set of group ids, but it may be arbitrarily complex.
   * If one was to "search a catalog", this is the description of what would be returned.
   */
  scope?: Array<IFilterGroup<FilterType>>;
  /**
   * Filter defines the "scope" of the Catalog, typically a set of groups or orgids
   * DEPRECATED: Use `scope`
   */
  filter?: Filter<FilterType>;
  /**
   * Sort options to be shown in the Gallery
   */
  sort?: ISortOption[];
  /**
   * Collections within the Catalog
   */
  collections?: ICollection[];
}
