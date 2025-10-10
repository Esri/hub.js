/**
 * @ignore
 */
export class RemoteServerError extends Error {
  status: number;
  url: string;

  constructor(message: string, url: string, status: number) {
    super(message);
    this.status = status;
    this.url = url;
  }
}
