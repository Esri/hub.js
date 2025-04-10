import { ISearchChannels } from "../../../discussions/api/types";
import { unique } from "../../../util";
import { IFilter, IPredicate } from "../../types/IHubCatalog";

/**
 * Flattens an array of IFilter objects into a map of key/value pairs where the key is the name of the
 * predicate and the value is a unique array of all values for that predicate name spanning all collections
 * and predicates. Uniqueness is only guaranteed for primitives (i.e. strings, boolean, number, etc). E.g.
 *
 * const x = flattenFilters([{
 *   predicates: [{
 *     access: 'public',
 *   }, {
 *     access: 'org',
 *   }],
 * }, {
 *   predicates: [{
 *     access: ['private', 'org]
 *   }]
 * }]);
 *
 * x // => { access: ['public', 'org', 'private']}
 * @param filters An array of IFilter objects
 * @returns an object containing key/value pairs of parameter values
 */
export function flattenFilters(filters: IFilter[]): Record<string, any[]> {
  return filters.reduce<Record<string, any[]>>(
    (acc1, filter) =>
      filter.predicates.reduce<Record<string, any[]>>(
        (acc2, predicate: IPredicate) =>
          Object.keys(predicate).reduce<Record<string, any[]>>(
            (acc3, predicateKey) => {
              const valuesToAdd: any[] = Array.isArray(predicate[predicateKey])
                ? predicate[predicateKey]
                : [predicate[predicateKey]];
              const values = valuesToAdd.reduce(
                (acc4, valueToAdd) =>
                  acc4.includes(valueToAdd) ? acc4 : [...acc4, valueToAdd],
                acc3[predicateKey] || ([] as any[])
              );
              return {
                ...acc3,
                [predicateKey]: values,
              };
            },
            acc2
          ),
        acc1
      ),
    {}
  );
}

/**
 * @private
 * Converts an IFilter array into a partial ISearchChannels
 * object of filter parameters
 * @param filters An array of IFilter objects
 * @returns a partial ISearchChannels object
 */
export function processChannelFilters(
  filters: IFilter[]
): Partial<ISearchChannels> {
  const channelOptions: Partial<ISearchChannels> = {};
  const flattenedFilters = flattenFilters(filters);
  if (flattenedFilters.term?.length) {
    channelOptions.name = flattenedFilters.term[0];
  }
  if (flattenedFilters.groups?.length) {
    channelOptions.groups = flattenedFilters.groups;
  }
  if (flattenedFilters.access?.length) {
    channelOptions.access = flattenedFilters.access;
  }
  if (flattenedFilters.id?.length) {
    const { ids, notIds } = flattenedFilters.id.reduce(
      (acc, id) =>
        id.not
          ? {
              ...acc,
              notIds: [
                ...acc.notIds,
                ...(Array.isArray(id.not) ? id.not : [id.not]),
              ],
            }
          : {
              ...acc,
              ids: [...acc.ids, id],
            },
      { ids: [], notIds: [] }
    );
    if (ids.length) {
      channelOptions.ids = ids;
    }
    if (notIds.length) {
      channelOptions.notIds = notIds.filter(unique);
    }
  }
  return channelOptions;
}
