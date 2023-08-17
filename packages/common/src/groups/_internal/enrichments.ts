import {
  searchGroupContent,
  searchGroupUsers,
  IGroup,
  getGroup,
  GroupMembership,
} from "@esri/arcgis-rest-portal";

import { getEnrichmentErrors } from "../../items/_enrichments";
import { getProp } from "../../objects/get-prop";
import OperationStack from "../../OperationStack";
import { IEnrichmentErrorInfo, IHubRequestOptions } from "../../types";
import { createOperationPipeline, IPipeable } from "../../utils";
import { IGroupMembershipSummary } from "../types";

/**
 * Possible additional properties available through enrichments
 */
export interface IGroupEnrichments {
  contentCount?: number;
  membershipSummary?: IGroupMembershipSummary;
  userMembership?: GroupMembership;
  /**
   * Represents who can become _members_ of the group. This is separate from the `access`
   * field, which represents who can _see_ the group.
   *
   * While technically not documented for the `getGroup` endpoint, the enrichment _does_ come
   * back when requesting a specific group's information. As such, we're not totally sure
   * that this enum is perfectly accurate. CONFIRM VALUES BEFORE USE!
   *
   * All information about this enum (and its values) was taken from this search documentation page:
   * https://developers.arcgis.com/rest/users-groups-and-items/common-parameters.htm
   */
  membershipAccess?: "org" | "collaboration" | "none";
  /**
   * Any errors encountered when fetching enrichments
   * see https://github.com/ArcGIS/hub-indexer/blob/master/docs/errors.md#response-formatting-for-errors
   */
  errors?: IEnrichmentErrorInfo[];
}

export type GroupEnrichment = keyof IGroupEnrichments;

/**
 * Merging of the Enrichment and the Group
 */
export interface IGroupAndEnrichments extends IGroupEnrichments {
  group: IGroup;
}

/**
 * Define the Function interface for Group enrichment functions
 */
interface IGroupEnrichmentOperations {
  [key: string]: (
    input: IPipeable<IGroupAndEnrichments>
  ) => Promise<IPipeable<IGroupAndEnrichments>>;
}

/**
 * Fetch the count of items shared to the group.
 * This is done by searching for content in the group
 * and using the returned `total` value
 * @param input
 * @returns
 */
const enrichGroupContentCount = (
  input: IPipeable<IGroupAndEnrichments>
): Promise<IPipeable<IGroupAndEnrichments>> => {
  const { data, stack, requestOptions } = input;
  const opId = stack.start("enrichGroupContentCount");
  // w/o the : any here, I get a compile error about
  // .authentication being incompatible w/ UserSession
  const options: any = {
    groupId: data.group.id,
    num: 1,
    ...requestOptions,
  };
  return searchGroupContent(options)
    .then((results) => {
      stack.finish(opId);
      return {
        data: { ...data, ...{ contentCount: results.total } },
        stack,
        requestOptions,
      };
    })
    .catch((error) => handleEnrichmentError(error, input, opId));
};

/**
 * Create a summary of the Group membership by searching for members,
 * limiting to three for a sample, and using the `total`.
 * @param input
 * @returns
 */
const enrichGroupMembershipSummary = (
  input: IPipeable<IGroupAndEnrichments>
): Promise<IPipeable<IGroupAndEnrichments>> => {
  const { data, stack, requestOptions } = input;
  const opId = stack.start("enrichGroupMembershipSummary");
  // w/o the `: any` here, I get a compile error about
  // .authentication being incompatible w/ UserSession
  const options: any = {
    num: 3,
    ...requestOptions,
  };
  return searchGroupUsers(data.group.id, options)
    .then((results) => {
      stack.finish(opId);
      return {
        data: {
          ...data,
          ...{
            membershipSummary: { total: results.total, users: results.users },
          },
        },
        stack,
        requestOptions,
      };
    })
    .catch((error) => handleEnrichmentError(error, input, opId));
};

/**
 * Get the requesting user's membership in the target group, as well
 * as the membership access requirements for the target group
 * @param input
 * @returns
 */
const enrichGroupUserMembership = (
  input: IPipeable<IGroupAndEnrichments>
): Promise<IPipeable<IGroupAndEnrichments>> => {
  const { data, stack, requestOptions } = input;
  const opId = stack.start("enrichGroupUserMembership");
  return getGroup(data.group.id, requestOptions)
    .then((result) => {
      stack.finish(opId);
      return {
        data: {
          ...data,
          ...{
            membershipAccess: result.membershipAccess,
            userMembership: getProp(result, "userMembership.memberType"),
          },
        },
        stack,
        requestOptions,
      };
    })
    .catch((error) => handleEnrichmentError(error, input, opId));
};

// add the error to the content.errors,
// log current stack operation as finished with an error
// and return output that can be piped into the next operation
const handleEnrichmentError = (
  error: Error | string,
  input: IPipeable<IGroupAndEnrichments>,
  opId: string
): IPipeable<IGroupAndEnrichments> => {
  const { data, stack, requestOptions } = input;
  stack.finish(opId, { error });
  return {
    data: {
      ...data,
      errors: getEnrichmentErrors(error, data.errors),
    },
    stack,
    requestOptions,
  };
};

/**
 * Available enrichments for Groups
 */
const groupEnrichmentOperations: IGroupEnrichmentOperations = {
  membershipSummary: enrichGroupMembershipSummary,
  contentCount: enrichGroupContentCount,
  userMembership: enrichGroupUserMembership,
};

/**
 * Fetch enrichments for Groups
 * @param group
 * @param enrichments
 * @param requestOptions
 * @returns
 */
export function fetchGroupEnrichments(
  group: IGroup,
  enrichments: GroupEnrichment[],
  requestOptions?: IHubRequestOptions
) {
  // create a pipeline of enrichment operations
  const operations = enrichments.reduce((ops, enrichment) => {
    const operation = groupEnrichmentOperations[enrichment];
    // only include the enrichments that we know how to fetch
    operation && ops.push(operation);
    return ops;
  }, []);
  const pipeline = createOperationPipeline<IGroupAndEnrichments>(operations);
  // execute pipeline and return the item and enrichments
  return pipeline({
    data: { group },
    stack: new OperationStack(),
    requestOptions,
  }).then((output) => {
    // TODO: send telemetry so we have info on what enrichments are requested and possible errors
    return output.data;
  });
}
