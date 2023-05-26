import { registerBrowserApp } from "../../src/items/registerBrowserApp";
import * as requestModule from "@esri/arcgis-rest-request";

describe("registerBrowserApp", () => {
  it("registers an item as a browser app", async () => {
    const ro = {
      authentication: {
        token: "token",
      },
    } as unknown as requestModule.IRequestOptions;

    const uris = ["foo", "bar"];
    const itemId = "item-id";

    // NOTE: this spy will work on the first test run when running test:chrome:debug
    // but will subsequently fail if you modify this file or the file under test
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({})
    );

    await registerBrowserApp(itemId, uris, ro);

    expect(requestSpy).toHaveBeenCalled();
    expect(requestSpy.calls.argsFor(0)[0]).toContain(
      "oauth2/registerApp",
      "sent to the correct url"
    );
    expect(requestSpy.calls.argsFor(0)[1]).toEqual(
      {
        method: "POST",
        authentication: ro.authentication,
        params: {
          itemId,
          appType: "browser",
          redirect_uris: JSON.stringify(uris),
        },
      },
      "correct request params"
    );
  });
});
