import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";

import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { authenticateRequest } from "../../../../src/newsletters-scheduler/api/utils/authenticate-request";
import { INewslettersSchedulerRequestOptions } from "../../../../src/newsletters-scheduler/api/types";

describe("authenticateRequest", () => {
  let getTokenSpy: any;

  const portal = "https://foo.com";
  const token = "aaa";
  const authentication = {
    portal,
    async getToken() {
      return token;
    },
  } as IAuthenticationManager;

  beforeEach(() => {
    getTokenSpy = vi.spyOn(authentication, "getToken");
  });

  it("returns params.token if provided", async () => {
    const options: INewslettersSchedulerRequestOptions = { token: "bbb" };

    const result = await authenticateRequest(options);
    expect(result).toEqual("bbb");
    expect(getTokenSpy).not.toHaveBeenCalled();
  });

  it("returns token from authentication if params.token not provided", async () => {
    const options = { authentication } as INewslettersSchedulerRequestOptions;

    const result = await authenticateRequest(options);
    expect(result).toEqual(token);
    expect(getTokenSpy).toHaveBeenCalledWith(portal);
  });
});
