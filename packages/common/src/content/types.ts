import { ResourceObject } from "jsonapi-typescript";

/**
 * JSONAPI dataset resource returned by the Hub API
 */
export type DatasetResource = ResourceObject<
  "dataset",
  {
    // TODO: actually define the attributes?
    // what is the syntax? adding the following causes errors
    // owner: string;
    [k: string]: any;
  }
>;
