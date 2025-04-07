import { ISearchChannels } from "../../../discussions/api/types";
import { IFilter, IPredicate } from "../../types/IHubCatalog";

function flattenFilters(filters: IFilter[]): Record<string, any[]> {
  return filters.reduce<Record<string, any[]>>(
    (acc1, filter) =>
      filter.predicates.reduce<Record<string, any[]>>(
        (acc2, predicate: IPredicate) =>
          Object.keys(predicate).reduce<Record<string, any[]>>(
            (acc3, predicateKey) => {
              const values: any[] = acc3[predicateKey] || [];
              values.push(
                ...(Array.isArray(predicate[predicateKey])
                  ? predicate[predicateKey]
                  : [predicate[predicateKey]])
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
      channelOptions.notIds = notIds;
    }
  }
  return channelOptions;
}
