export class InvalidPaginationInputError extends Error {
  input: any;

  // Istanbul erroneously treats extended class constructors as an uncovered branch: https://github.com/gotwarlost/istanbul/issues/690
  /* istanbul ignore next */
  constructor(message: string, input: any) {
    super(message);
    this.input = input;
  }
}
