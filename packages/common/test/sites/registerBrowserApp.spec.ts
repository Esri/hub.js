import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

// Ensure the ESM namespace is mockable: merge original exports and override `request`
vi.mock("@esri/arcgis-rest-request", async (importOriginal) => ({
  ...(await importOriginal()),
  request: vi.fn(),
}));

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

    const requestSpy: any = vi
      .spyOn(requestModule, "request")
      .mockResolvedValue({});

    await registerBrowserApp(itemId, uris, ro);

    expect(requestSpy).toHaveBeenCalled();
    expect(requestSpy.mock.calls[0][0]).toContain(
      "oauth2/registerApp",
      "sent to the correct url"
    );
    expect(requestSpy.mock.calls[0][1]).toEqual(
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
