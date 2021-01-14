export class GraphQLError extends Error {
  constructor(private errors: Error[]) {
    super();
  }

  get message() {
    return this.errors.length
      ? this.errors.map(e => e.message).join(", ")
      : "GraphQL error";
  }
}
