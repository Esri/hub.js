import { getProp } from "@esri/hub-common";

export class GraphQLError extends Error {
  constructor(private errors: Error[]) {
    /* istanbul ignore next */
    super();
    Object.setPrototypeOf(this, GraphQLError.prototype);
  }

  get message() {
    return getProp(this.errors, "length")
      ? this.errors.map(e => e.message).join(", ")
      : "GraphQL error";
  }
}
