import { Blob } from "../../src/resources/_which-blob";
import { mockUserSession } from "../test-helpers/fake-user-session";
import * as fetchImageAsBlobModule from "../../src/resources/fetch-image-as-blob";
import * as portalModule from "@esri/arcgis-rest-portal";

import { fetchAndUploadResource } from "../../src";
import {
  IItemResourceOptions,
  IItemResourceResponse
} from "@esri/arcgis-rest-portal";

describe("fetchAndUploadResource", function() {
  it("fetches and uploads a resource", async function() {
    const owner = "andrew";
    const itemId = "some-id";

    const resourceBlob = new Blob([], { type: "image/png" });
    const fetchImageAsBlobSpy = spyOn(
      fetchImageAsBlobModule,
      "fetchImageAsBlob"
    ).and.returnValue(Promise.resolve(resourceBlob));

    const addResourceRes: IItemResourceResponse = {
      success: true,
      itemId,
      owner,
      folder: null
    };
    const addItemResourceSpy = spyOn(
      portalModule,
      "addItemResource"
    ).and.returnValue(Promise.resolve(addResourceRes));

    const opts = {
      id: itemId,
      owner,
      fileName: "thumbnail.png",
      url: "https://my-image-url",
      authentication: mockUserSession
    };

    const res = await fetchAndUploadResource(opts);

    expect(fetchImageAsBlobSpy.calls.count()).toBe(
      1,
      "fetchImageAsBlob called once"
    );
    const fetchArgs = fetchImageAsBlobSpy.calls.argsFor(0);
    expect(fetchArgs[0]).toBe(
      opts.url,
      "fetchImageAsBlob called with resource url"
    );

    expect(addItemResourceSpy.calls.count()).toBe(
      1,
      "addItemResource called once"
    );
    expect(res).toEqual(
      addResourceRes,
      "resolves to response from addItemResource"
    );
    const addItemOpts: IItemResourceOptions = addItemResourceSpy.calls.argsFor(
      0
    )[0];
    expect(addItemOpts).toEqual(
      {
        id: itemId,
        owner,
        name: opts.fileName,
        resource: resourceBlob,
        authentication: mockUserSession
      },
      "addItemResource called with correct configuration"
    );
  });
});
