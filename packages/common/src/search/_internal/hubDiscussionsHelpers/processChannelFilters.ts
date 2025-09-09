import {
  ChannelFilter,
  ISearchChannels,
  Role,
  SharingAccess,
} from "../../../discussions/api/types";
import { unique } from "../../../util";
import { IFilter, IPredicate } from "../../types/IHubCatalog";
import { IDateRange } from "../../types/types";

/**
 * @private
 *
 * Transforms an array of unknown values into an object containing `ids` and `notIds` arrays.
 *
 * @param values An array of unknown values
 * @returns and object containing an `ids` and `notIds` array
 */
export const parseIdsAndNotIds = (
  values: unknown[]
): { ids: string[]; notIds: string[] } => {
  return values.reduce(
    (
      acc: { ids: string[]; notIds: string[] },
      id: unknown
    ): { ids: string[]; notIds: string[] } => {
      if (typeof id === "object" && id !== null && "not" in id) {
        return {
          ...acc,
          notIds: [
            ...acc.notIds,
            ...(Array.isArray((id as { not: string | string[] }).not)
              ? (id as { not: string[] }).not
              : ([(id as { not: string }).not] as string[])),
          ],
        };
      } else if (typeof id === "string") {
        return {
          ...acc,
          ids: [...acc.ids, id],
        };
      } else {
        return acc;
      }
    },
    {
      ids: [],
      notIds: [],
    }
  );
};

/**
 * @private
 *
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
export function flattenFilters(filters: IFilter[]): Record<string, unknown[]> {
  return filters.reduce<Record<string, unknown[]>>(
    (
      acc1: Record<string, unknown[]>,
      filter: IFilter
    ): Record<string, unknown[]> =>
      filter.predicates.reduce<Record<string, unknown[]>>(
        (
          acc2: Record<string, unknown[]>,
          predicate: IPredicate
        ): Record<string, unknown[]> =>
          Object.keys(predicate).reduce<Record<string, unknown[]>>(
            (
              acc3: Record<string, unknown[]>,
              predicateKey: string
            ): Record<string, unknown[]> => {
              const valuesToAdd: unknown[] = Array.isArray(
                predicate[predicateKey]
              )
                ? (predicate[predicateKey] as unknown[])
                : [predicate[predicateKey]];
              const values = valuesToAdd.reduce(
                (acc4: unknown[], valueToAdd: unknown) =>
                  acc4.includes(valueToAdd) ? acc4 : [...acc4, valueToAdd],
                acc3[predicateKey] || ([] as unknown[])
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

  // term
  if (flattenedFilters.term?.length) {
    channelOptions.name = flattenedFilters.term[0] as string;
  }

  // group
  if (flattenedFilters.group?.length) {
    channelOptions.groups = flattenedFilters.group as string[];
  }

  // access
  if (flattenedFilters.access?.length) {
    channelOptions.access = flattenedFilters.access as SharingAccess[];
  }

  // orgId
  if (flattenedFilters.orgId?.length) {
    channelOptions.orgIds = flattenedFilters.orgId as string[];
  }

  // discussion
  if (flattenedFilters.discussion?.length) {
    channelOptions.discussion = flattenedFilters.discussion[0] as string;
  }

  // hasUserPosts
  if (flattenedFilters.hasUserPosts?.[0] === true) {
    channelOptions.filterBy = ChannelFilter.HAS_USER_POSTS;
  }

  // role
  if (flattenedFilters.role?.length) {
    channelOptions.roles = flattenedFilters.role as Role[];
  }

  // owner
  if (flattenedFilters.owner?.length) {
    channelOptions.creator = flattenedFilters.owner[0] as string;
  }

  // id
  if (flattenedFilters.id?.length) {
    const { ids, notIds } = parseIdsAndNotIds(flattenedFilters.id);
    if (ids.length) {
      channelOptions.ids = ids;
    }
    if (notIds.length) {
      channelOptions.notIds = notIds.filter(unique);
    }
  }

  // createdDateRange
  if (flattenedFilters.createdDateRange?.length) {
    channelOptions.createdBefore = new Date(
      (flattenedFilters.createdDateRange[0] as IDateRange<string | number>).to
    );
    channelOptions.createdAfter = new Date(
      (flattenedFilters.createdDateRange[0] as IDateRange<string | number>).from
    );
  }

  // updatedDateRange
  if (flattenedFilters.updatedDateRange?.length) {
    channelOptions.updatedBefore = new Date(
      (flattenedFilters.updatedDateRange[0] as IDateRange<string | number>).to
    );
    channelOptions.updatedAfter = new Date(
      (flattenedFilters.updatedDateRange[0] as IDateRange<string | number>).from
    );
  }

  return channelOptions;
}
