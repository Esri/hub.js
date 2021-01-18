/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { GraphQLError } from "../../src";

describe("user errors", () => {
  it("formats a single ClientError", () => {
    const error = new GraphQLError([
      {
        message: "first error"
      }
    ] as Error[]);

    expect(error.message).toEqual("first error");
  });

  it("formats multiple ClientErrors", () => {
    const error = new GraphQLError([
      {
        message: "first error"
      },
      {
        message: "second error"
      },
      {
        message: "third error"
      }
    ] as Error[]);

    expect(error.message).toEqual("first error, second error, third error");
  });

  it("formats some other error", () => {
    let error = new GraphQLError(undefined);
    expect(error.message).toEqual("GraphQL error");

    error = new GraphQLError([]);
    expect(error.message).toEqual("GraphQL error");
  });
});
