vi.mock("@esri/arcgis-rest-request", async (importOriginal) => ({
  ...(await importOriginal()),
  request: vi.fn(),
}));

import { registerBrowserApp } from "../../src/items/registerBrowserApp";
import * as requestModule from "@esri/arcgis-rest-request";

afterEach(() => vi.restoreAllMocks());

describe("registerBrowserApp", () => {
  it("registers an item as a browser app", async () => {
    const ro = {
      authentication: {
        token: "token",
      },
    } as unknown as requestModule.IRequestOptions;

    const uris = ["foo", "bar"];
    const itemId = "item-id";

    const requestSpy = vi
      .spyOn(requestModule as any, "request")
      .mockResolvedValue({});

    await registerBrowserApp(itemId, uris, ro);

    expect(requestSpy).toHaveBeenCalled();
    expect((requestSpy as any).mock.calls[0][0]).toContain(
      "oauth2/registerApp"
    );
    expect((requestSpy as any).mock.calls[0][1]).toEqual({
      method: "POST",
      authentication: ro.authentication,
      params: {
        itemId,
        appType: "browser",
        redirect_uris: JSON.stringify(uris),
      },
    });
  });
});
