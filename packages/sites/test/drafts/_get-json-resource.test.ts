import { _getJsonResource } from "../../src/drafts/_get-json-resource";
import * as requestModule from "@esri/arcgis-rest-request";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_getJsonResource", () => {
  it("gets the resource", async () => {
    const portalUrl = "www.myportal.com";
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve()
    );
    const portalSpy = spyOn(portalModule, "getPortalUrl").and.returnValue(
      portalUrl
    );

    const ro = ({ foo: "bar" } as unknown) as IHubRequestOptions;

    await _getJsonResource("item-id", "resource-name", ro);

    expect(portalSpy).toHaveBeenCalledWith(ro);
    expect(requestSpy).toHaveBeenCalled();

    const [url, options] = requestSpy.calls.argsFor(0);

    expect(url).toBe(
      `${portalUrl}/content/items/item-id/resources/resource-name`
    );
    expect(options).toEqual({ foo: "bar", params: { f: "json" } });
  });
});
