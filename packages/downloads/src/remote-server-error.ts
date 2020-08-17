/**
 * @ignore
 */
export class RemoteServerError extends Error {
  status: number;
  url: string;
  
  // Istanbul erroneously treats extended class constructors as an uncovered branch: https://github.com/gotwarlost/istanbul/issues/690
  /* istanbul ignore next */
  constructor (message: string, url: string, status: number) {
    super(message);
    this.status = status;
    this.url = url;
  }
}