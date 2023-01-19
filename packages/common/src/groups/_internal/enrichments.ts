import {
  searchGroupContent,
  searchGroupUsers,
  IGroup,
  IUser,
} from "@esri/arcgis-rest-portal";

import { getEnrichmentErrors } from "../../items/_enrichments";
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
  const opId = stack.start("enrichGroupContentCount");
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
const groupEnrichementOperations: IGroupEnrichmentOperations = {
  membershipSummary: enrichGroupMembershipSummary,
  contentCount: enrichGroupContentCount,
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
    const operation = groupEnrichementOperations[enrichment];
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
