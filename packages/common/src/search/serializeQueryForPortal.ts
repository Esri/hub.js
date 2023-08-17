import { ISearchOptions } from "@esri/arcgis-rest-portal";
import {
  IDateRange,
  IFilter,
  IMatchOptions,
  IPredicate,
  IQuery,
} from "./types";
import { getTopLevelPredicate } from "./_internal/commonHelpers/getTopLevelPredicate";
import { expandPredicate } from "./_internal/expandPredicate";

/**
 * Serialize IQuery into ISearchOptions for ArcGIS Portal
 * @param query
 * @returns
 */
export function serializeQueryForPortal(query: IQuery): ISearchOptions {
  const filterSearchOptions = query.filters.map(serializeFilter);
  // remove any empty entries
  const nonEmptyOptions = filterSearchOptions.filter(removeEmptyEntries);
  const result = mergeSearchOptions(nonEmptyOptions, "AND");

  const bboxPredicate = getTopLevelPredicate("bbox", query.filters);
  if (bboxPredicate) {
    result.params = { bbox: bboxPredicate.bbox };
  }

  return result;
}

/**
 * Predicate to remove things from array
 * @param e
 * @returns
 */
function removeEmptyEntries(e: any): boolean {
  return !(typeof e === "undefined" || e === null || e === "");
}

function mergeSearchOptions(
  options: ISearchOptions[],
  operation: "AND" | "OR"
): ISearchOptions {
  const result: ISearchOptions = options.reduce(
    (acc, entry) => {
      // walk the props
      Object.entries(entry).forEach(([key, value]) => {
        // if prop exists and is not empty string
        if (acc[key] && value !== "") {
          // combine via operation
          acc[key] = `${acc[key]} ${operation} ${value}`;
        } else {
          // just copy the value if it's not empty string
          if (value !== "") {
            acc[key] = value;
          }
        }
      });

      return acc;
    },
    { q: "" }
  );
  return result;
}

/**
 * Serialize the filters in a FitlerGroup into a Portal Query
 * @param filter
 * @returns
 */
function serializeFilter(filter: IFilter): ISearchOptions {
  const operation = filter.operation || "AND";
  const predicates = filter.predicates.map(expandPredicate);

  const predicateSearchOptions = predicates
    .map(serializePredicate)
    .filter((e) => e !== undefined && e !== null);

  // combine these searchOptions
  const searchOptions = mergeSearchOptions(predicateSearchOptions, operation);
  // wrap in parens if we have more than one predicate
  if (predicates.length > 1) {
    searchOptions.q = `(${searchOptions.q})`;
  }
  return searchOptions;
}
/**
 * Serialize a Filter into a Portal Query
 * @param predicate
 * @returns
 */
function serializePredicate(predicate: IPredicate): ISearchOptions {
  const dateProps = ["created", "modified"];
  const boolProps = ["isopendata", "isviewonly"];
  // In order to not get "expanded", these also need to be listed
  // in the `expandPredicate` function
  const passThroughProps = [
    "searchUserAccess",
    "searchUserName",
    "memberType",
    "name",
    "categoriesAsParam",
    "categoryFilter",
    "bbox",
    "joined",
  ];
  const specialProps = [
    "filterType",
    "term",
    ...dateProps,
    ...boolProps,
    ...passThroughProps,
  ];
  const portalAllowList = [
    "access",
    "capabilities",
    "created",
    "categories",
    "categoriesAsParam",
    "categoryFilter",
    "description",
    "disabled",
    "email",
    "emailstatus",
    "firstname",
    "fullname",
    "group",
    "id",
    "isInvitationOnly",
    "isopendata",
    "joined",
    "lastlogin",
    "lastname",
    "memberType",
    "modified",
    "name",
    "orgid",
    "orgIds",
    "owner",
    "provider",
    "role",
    "searchUserAccess",
    "searchUserName",
    "snippet",
    "tags",
    "term",
    "title",
    "type",
    "typekeywords",
    "userlicensetype",
    "username",
    "isviewonly",
  ];

  // TODO: Look at using reduce vs .map and remove the `.filter`
  const opts = Object.entries(predicate)
    .map(([key, value]) => {
      // When serializing for portal we limit predicate properties to
      // a list of known properties that the portal api accepts. This will
      // not attempt to ensure the properties are used in the correct combinations
      if (portalAllowList.includes(key)) {
        const so: ISearchOptions = { q: "" };
        if (!specialProps.includes(key) && key !== "term") {
          so.q = serializeMatchOptions(key, value);
        }
        if (dateProps.includes(key)) {
          so.q = serializeDateRange(
            key,
            value as unknown as IDateRange<number>
          );
        }
        if (boolProps.includes(key)) {
          so.q = `${key}:${value}`;
        }
        if (passThroughProps.includes(key)) {
          // Because the groups/:id/userlist API takes a specific format for
          // `joined` (dates), therefore for group members, we have to
          // add a separate `joined` field with the specific format for the value
          if (key === "joined") {
            so[key] = `${value.from},${value.to}`;
          } else {
            so[key] = value;
          }
        }
        if (key === "term") {
          so.q = value;
        }
        return so;
      }
    })
    .filter(removeEmptyEntries);

  // merge up all the searchOptions
  if (opts.length) {
    const searchOptions = mergeSearchOptions(opts, "AND");
    if (searchOptions.q) {
      searchOptions.q = `(${searchOptions.q})`;
    }
    return searchOptions;
  } else {
    return null;
  }
}

/**
 * Serialize MatchOptions into portal syntax
 * @param key
 * @param value
 * @returns
 */
function serializeMatchOptions(key: string, value: IMatchOptions): string {
  let result = "";
  if (value.any) {
    result = `${serializeStringOrArray("OR", key, value.any)}`;
  }
  if (value.all) {
    result =
      (result ? result + " AND " : "") +
      `${serializeStringOrArray("AND", key, value.all)}`;
  }
  if (value.not) {
    // negate the entries if they are not
    result =
      (result ? result + " AND " : "") +
      `${serializeStringOrArray("OR", `-${key}`, value.not)}`;
  }

  return result;
}

/**
 * Serialize a date-range into Portal syntax
 * @param key
 * @param range
 * @returns
 */
function serializeDateRange(key: string, range: IDateRange<number>): string {
  return `${key}:[${range.from} TO ${range.to}]`;
}

/**
 * Serialize a `string` or `string[]` into a string
 * @param join
 * @param key
 * @param value
 * @returns
 */
function serializeStringOrArray(
  join: "AND" | "OR",
  key: string,
  value: string | string[]
): string {
  let q = "";
  if (Array.isArray(value)) {
    q = `${key}:"${value.join(`" ${join} ${key}:"`)}"`;
    if (value.length > 1) {
      q = `(${q})`;
    }
  } else {
    q = `${key}:"${value}"`;
  }
  return q;
}
