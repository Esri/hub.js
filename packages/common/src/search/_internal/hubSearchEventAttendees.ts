import { getUser, IUser } from "@esri/arcgis-rest-portal";
import { GetRegistrationsParams } from "../../events/api";
import {
  getRegistrations,
  IPagedRegistrationResponse,
  IRegistration,
} from "../../events/api/orval/api/orval-events";
import { eventAttendeeToSearchResult } from "../../events/api/utils/search";
import { IPredicate, IQuery } from "../types/IHubCatalog";
import { IHubSearchOptions } from "../types/IHubSearchOptions";
import { IHubSearchResponse } from "../types/IHubSearchResponse";
import { IHubSearchResult } from "../types/IHubSearchResult";
import { setProp } from "../../objects";

export const processGetRegistrationsParams = (
  options: IHubSearchOptions,
  query: IQuery
): GetRegistrationsParams => {
  // valid keys to translate from IQuery predicates
  const validPredicateKeys: Array<keyof IPredicate> = [
    "term",
    "eventId",
    "userId",
    "role",
    "status",
    "type",
    "updatedAtBefore",
    "updatedAtAfter",
  ];
  // valid keys to translate from IHubSearchOptions
  const validPaginationKeys: Array<keyof IHubSearchOptions> = [
    "num",
    "start",
    "sortField",
    "sortOrder",
  ];
  // mappings for keys into GetRegistrationOptions equivalents
  const keyMappings: Record<
    keyof IHubSearchOptions | keyof IPredicate,
    keyof GetRegistrationsParams
  > = {
    sortField: "sortBy",
    // term: "name"
  };
  // translate IQuery filters into GetRegistrationParams
  const filterProps: Record<string, string[]> = {};
  query.filters.forEach((filter) => {
    filter.predicates.forEach((predicate) => {
      Object.keys(predicate).forEach((key: any) => {
        const { [key]: _key = key } = keyMappings;
        if (validPredicateKeys.includes(_key)) {
          filterProps[_key] = predicate[key];
        }
      });
    });
  });
  // translate IHubSearchOptions into GetRegistrationParams
  const paginationProps: Partial<Record<keyof GetRegistrationsParams, any>> =
    {};
  validPaginationKeys.forEach((key) => {
    if (options.hasOwnProperty(key)) {
      const { [key]: mappedKey = key as any } = keyMappings;
      const _key = mappedKey as keyof GetRegistrationsParams;
      const value = options[key];
      if (key && value) {
        paginationProps[_key] = String(value);
      }
    }
  });
  // assemble GetRegistrationParams object
  return {
    ...filterProps,
    ...paginationProps,
  };
};

/**
 * @private
 * Convert the Events API getRegistrations response into an
 * IHubSearchResponse necessary for supporting hubSearch results
 * @param {IPagedRegistrationResponse} eventAttendeesResponse
 * @param {IQuery} query
 * @param {IHubSearchOptions} options
 * @returns IHubSearchResponse<IHubSearchResult>
 */
export const eventAttendeesToHubSearchResults = async (
  eventAttendeesResponse: IPagedRegistrationResponse,
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> => {
  const { total, items, nextStart } = eventAttendeesResponse;
  return {
    total,
    results: await Promise.all(
      items.map((attendees) => eventAttendeeToSearchResult(attendees))
    ),
    hasNext: nextStart > -1,
    next: () => {
      return hubSearchEventAttendees(query, {
        ...options,
        start: nextStart,
      });
    },
  };
};

/**
 * @private
 * Execute event attendees search against the Events API
 * @param query
 * @param options
 * @returns
 */
export const hubSearchEventAttendees = async (
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> => {
  // Pull useful info out of query
  const params: GetRegistrationsParams = processGetRegistrationsParams(
    options,
    query
  );
  // Call to getRegistrations
  const eventAttendeesResponse: IPagedRegistrationResponse =
    await getRegistrations(params);
  // Parse into <IHubSearchResponse<IHubSearchResult>>
  return eventAttendeesToHubSearchResults(
    eventAttendeesResponse,
    query,
    options
  );
};
