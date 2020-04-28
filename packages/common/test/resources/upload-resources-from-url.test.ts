import {
  uploadResourcesFromUrl,
  IHubRequestOptions,
  IModel,
  cloneObject,
  IItemResource
} from "../../src";
import * as fetchAndUploadResourceModule from "../../src/resources/fetch-and-upload-resource";
import * as fetchAndUploadThumbnailModule from "../../src/resources/fetch-and-upload-thumbnail";
import { IItemResourceResponse } from "@esri/arcgis-rest-portal";

describe("uploadResourcesFromUrl", function() {
  const requestOpts = {
    portalSelf: {
      user: {},
      id: "123",
      isPortal: false,
      name: "some-portal"
    },
    isPortal: false,
    hubApiUrl: "some-url"
  } as IHubRequestOptions;

  const defaultModel: IModel = {
    item: {
      id: "someId",
      protected: false,
      owner: "owner",
      created: 123,
      modified: 123,
      tags: [],
      numViews: 3,
      size: 3,
      title: "title",
      type: "Hub Site Application"
    },
    data: { foo: "bar", baz: { boop: "beep" } }
  };

  function resourceResponse(options: any): Promise<IItemResourceResponse> {
    return Promise.resolve({
      success: true,
      itemId: options.id,
      owner: options.owner,
      folder: null
    });
  }

  it("uploads resources", async function() {
    const model = cloneObject(defaultModel);

    const resources: IItemResource[] = [
      {
        url: "url1",
        name: "name1"
      },
      {
        url: "url2",
        name: "name2"
      },
      {
        url: "url3",
        name: "name3"
      },
      {
        type: "thumbnail",
        url: "thumbnail-url",
        name: "thumbnail-name"
      },
      {
        url: null,
        name: "name5"
      }
    ];

    const fetchAndUploadResourceSpy = spyOn(
      fetchAndUploadResourceModule,
      "fetchAndUploadResource"
    ).and.callFake(resourceResponse);

    const fetchAndUploadThumbnailSpy = spyOn(
      fetchAndUploadThumbnailModule,
      "fetchAndUploadThumbnail"
    ).and.callFake(resourceResponse);

    await uploadResourcesFromUrl(model, resources, requestOpts);

    expect(fetchAndUploadResourceSpy.calls.count()).toBe(
      3,
      "4th resource without URL ignored"
    );
    expect(fetchAndUploadResourceSpy.calls.argsFor(0)[0].url).toBe("url1");
    expect(fetchAndUploadResourceSpy.calls.argsFor(0)[0].fileName).toBe(
      "name1"
    );
    expect(fetchAndUploadResourceSpy.calls.argsFor(1)[0].url).toBe("url2");
    expect(fetchAndUploadResourceSpy.calls.argsFor(1)[0].fileName).toBe(
      "name2"
    );
    expect(fetchAndUploadResourceSpy.calls.argsFor(2)[0].url).toBe("url3");
    expect(fetchAndUploadResourceSpy.calls.argsFor(2)[0].fileName).toBe(
      "name3"
    );

    expect(fetchAndUploadThumbnailSpy.calls.count()).toEqual(
      1,
      "thumbnail got uploaded"
    );
    expect(fetchAndUploadThumbnailSpy.calls.argsFor(0)[0].url).toBe(
      "thumbnail-url"
    );
    expect(fetchAndUploadThumbnailSpy.calls.argsFor(0)[0].fileName).toBe(
      "thumbnail-name"
    );
  });

  it("resolves when resources not an array", async function() {
    const model = cloneObject(defaultModel);

    const resources: any = null;

    const fetchAndUploadResourceSpy = spyOn(
      fetchAndUploadResourceModule,
      "fetchAndUploadResource"
    ).and.callFake(resourceResponse);

    const fetchAndUploadThumbnailSpy = spyOn(
      fetchAndUploadThumbnailModule,
      "fetchAndUploadThumbnail"
    ).and.callFake(resourceResponse);

    const res = await uploadResourcesFromUrl(model, resources, requestOpts);

    expect(res).toEqual(
      [],
      "resolves to empty array when resources is not of type array"
    );
    expect(fetchAndUploadResourceSpy.calls.count()).toBe(
      0,
      "fetchAndUploadSpy not called"
    );
    expect(fetchAndUploadThumbnailSpy.calls.count()).toBe(
      0,
      "fetchAndUploadThumbnailSpy not called"
    );
  });
});
