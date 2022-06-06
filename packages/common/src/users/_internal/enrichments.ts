import {
  searchGroupContent,
  searchGroupUsers,
  IGroup,
  IUser,
  getUser,
} from "@esri/arcgis-rest-portal";
import { IGroupMembershipSummary } from "../..";
import { getEnrichmentErrors } from "../../items/_enrichments";
import OperationStack from "../../OperationStack";
import { IEnrichmentErrorInfo, IHubRequestOptions } from "../../types";
import { createOperationPipeline, IPipeable } from "../../utils";

/**
 * Possible additional properties available through enrichments
 */
export interface IUserEnrichments {
  groups?: IGroup[];
  /**
   * Any errors encountered when fetching enrichments
   * see https://github.com/ArcGIS/hub-indexer/blob/master/docs/errors.md#response-formatting-for-errors
   */
  errors?: IEnrichmentErrorInfo[];
}

export type UserEnrichment = keyof IUserEnrichments;

/**
 * Merging of the Enrichment and the User
 */
export interface IUserAndEnrichments extends IUserEnrichments {
  user: IUser;
}

/**
 * Define the Function interface for User enrichment functions
 */
interface IUserEnrichmentOperations {
  [key: string]: (
    input: IPipeable<IUserAndEnrichments>
  ) => Promise<IPipeable<IUserAndEnrichments>>;
}

/**
 * Fetch all the groups for the user
 * @param input
 * @returns
 */
const enrichUserGroups = (
  input: IPipeable<IUserAndEnrichments>
): Promise<IPipeable<IUserAndEnrichments>> => {
  const { data, stack, requestOptions } = input;
  const opId = stack.start("enrichUserGroups");
  // w/o the `: any` here, I get a compile error about
  // .authentication being incompatible w/ UserSession
  const options: any = {
    username: data.user.username,
    ...requestOptions,
  };
  return getUser(options)
    .then((results) => {
      stack.finish(opId);
      return {
        data: {
          ...data,
          ...{
            groups: results.groups || [],
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
  input: IPipeable<IUserAndEnrichments>,
  opId: string
): IPipeable<IUserAndEnrichments> => {
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
const groupEnrichementOperations: IUserEnrichmentOperations = {
  groups: enrichUserGroups,
};

/**
 * Fetch enrichments for Users
 * @param group
 * @param enrichments
 * @param requestOptions
 * @returns
 */
export function fetchUserEnrichments(
  user: IUser,
  enrichments: UserEnrichment[],
  requestOptions?: IHubRequestOptions
) {
  // create a pipeline of enrichment operations
  const operations = enrichments.reduce((ops, enrichment) => {
    const operation = groupEnrichementOperations[enrichment];
    // only include the enrichments that we know how to fetch
    operation && ops.push(operation);
    return ops;
  }, []);
  const pipeline = createOperationPipeline<IUserAndEnrichments>(operations);
  // execute pipeline and return the item and enrichments
  return pipeline({
    data: { user },
    stack: new OperationStack(),
    requestOptions,
  }).then((output) => {
    // TODO: send telemetry so we have info on what enrichments are requested and possible errors
    return output.data;
  });
}
