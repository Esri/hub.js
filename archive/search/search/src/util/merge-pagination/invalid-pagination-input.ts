export class InvalidPaginationInputError extends Error {
  input: any;

  constructor(message: string, input: any) {
    super(message);
    this.input = input;
  }
}
