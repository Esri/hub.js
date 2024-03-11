import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { INewslettersRequestOptions } from "../../../../src/newsletters/api";
import { authenticateRequest } from "../../../../src/events/api/utils/authenticate-request";

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
    getTokenSpy = spyOn(authentication, "getToken").and.callThrough();
  });

  it("returns params.token if provided", async () => {
    const options: INewslettersRequestOptions = { token: "bbb" };

    const result = await authenticateRequest(options);
    expect(result).toEqual("bbb");
    expect(getTokenSpy).not.toHaveBeenCalled();
  });

  it("returns token from authentication if params.token not provided", async () => {
    const options = { authentication } as INewslettersRequestOptions;

    const result = await authenticateRequest(options);
    expect(result).toEqual(token);
    expect(getTokenSpy).toHaveBeenCalledWith(portal);
  });
});
