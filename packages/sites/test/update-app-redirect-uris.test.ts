import { updateAppRedirectUris } from "../src/update-app-redirect-uris";
import * as requestModule from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "@esri/hub-common";

describe("updateAppRedirectUris", () => {
  it("updates the rediect uris", async () => {
    // NOTE: this spy will work on the first test run when running test:chrome:debug
    // but will subsequently fail if you modify this file or the file under test
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({})
    );

    const ro = {
      authentication: {
        token: "token",
      },
    } as IHubRequestOptions;

    const clientId = "abc-clientid";
    const redirectUris = ["foo", "bar"];

    await updateAppRedirectUris(clientId, redirectUris, ro);

    expect(requestSpy.calls.argsFor(0)[0]).toContain(
      `/oauth2/apps/${clientId}/update`,
      "requested to correct url"
    );
    expect(requestSpy.calls.argsFor(0)[1]).toEqual(
      {
        method: "POST",
        authentication: ro.authentication,
        params: {
          client_id: clientId,
          redirect_uris: JSON.stringify(redirectUris),
        },
      },
      "request called with correct config"
    );
  });
});
