import { MockOptions } from "fetch-mock";

// This is needed because @types/fetch-mock only goes to 7.3.x
// but we are using 7.7.x
declare module "fetch-mock" {
  // tslint:disable-next-line interface-name
  interface MockOptions {
    /**
     * The number of milliseconds to delay before the response is sent
     */
    delay?: number;
  }
}
