import { IHubRequestOptions } from "../../../src/hub-types";
import { _getAuthHeader } from "../../../src/sites/domains/_get-auth-header";

describe("_getAuthHeader", function () {
  it("gets the auth header", function () {
    const token = "1231241234";
    const ro = { authentication: { token } } as IHubRequestOptions;

    expect(_getAuthHeader(ro)).toEqual({
      Authorization: token,
    });
  });

  it("empty object when no token", function () {
    const ro = {} as IHubRequestOptions;

    expect(_getAuthHeader(ro)).toEqual({});
  });
});
