import { IHubRequestOptions, IItemResource } from "../../src/hub-types";
import * as fetchAndUploadResourceModule from "../../src/resources/fetch-and-upload-resource";
import * as fetchAndUploadThumbnailModule from "../../src/resources/fetch-and-upload-thumbnail";
import { uploadResourcesFromUrl } from "../../src/resources/upload-resources-from-url";
import { cloneObject } from "../../src/util";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { vi, describe, it, expect, afterEach } from "vitest";

describe("uploadResourcesFromUrl", () => {
  afterEach(() => vi.restoreAllMocks());

  const requestOpts = {
    portalSelf: {
      user: {},
      id: "123",
      isPortal: false,
      name: "some-portal",
    },
    isPortal: false,
    hubApiUrl: "some-url",
    authentication: mockUserSession,
  } as IHubRequestOptions;

  const defaultModel = {
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
      type: "Hub Site Application",
    },
    data: { foo: "bar", baz: { boop: "beep" } },
  } as any;

  function resourceResponse(options: any): Promise<any> {
    return Promise.resolve({
      success: true,
      itemId: options.id,
      owner: options.owner,
      folder: null,
    } as any);
  }

  it("uploads resources", async () => {
    const model = cloneObject(defaultModel);
    const portalUrl = requestOpts.authentication.portal;
    const resources: IItemResource[] = [
      { url: "url1", name: "name1" },
      { url: `${portalUrl}/url2`, name: "name2" },
      { url: "url3", name: "name3" },
      { type: "thumbnail", url: "thumbnail-url", name: "thumbnail-name" },
      { url: null, name: "name5" },
    ];

    const fetchAndUploadResourceSpy = vi
      .spyOn(fetchAndUploadResourceModule, "fetchAndUploadResource")
      .mockImplementation(resourceResponse as any);

    const fetchAndUploadThumbnailSpy = vi
      .spyOn(fetchAndUploadThumbnailModule, "fetchAndUploadThumbnail")
      .mockImplementation(resourceResponse as any);

    await uploadResourcesFromUrl(model, resources, requestOpts);

    expect((fetchAndUploadResourceSpy as any).mock.calls.length).toBe(3);
    expect((fetchAndUploadResourceSpy as any).mock.calls[0][0].url).toBe(
      "url1"
    );
    expect((fetchAndUploadResourceSpy as any).mock.calls[0][0].fileName).toBe(
      "name1"
    );
    expect((fetchAndUploadResourceSpy as any).mock.calls[1][0].url).toBe(
      `${portalUrl}/url2?token=fake-token`
    );
    expect((fetchAndUploadResourceSpy as any).mock.calls[1][0].fileName).toBe(
      "name2"
    );
    expect((fetchAndUploadResourceSpy as any).mock.calls[2][0].url).toBe(
      "url3"
    );
    expect((fetchAndUploadResourceSpy as any).mock.calls[2][0].fileName).toBe(
      "name3"
    );

    expect((fetchAndUploadThumbnailSpy as any).mock.calls.length).toBe(1);
    expect((fetchAndUploadThumbnailSpy as any).mock.calls[0][0].url).toBe(
      "thumbnail-url"
    );
    expect((fetchAndUploadThumbnailSpy as any).mock.calls[0][0].fileName).toBe(
      "thumbnail-name"
    );
  });

  it("resolves when resources not an array", async () => {
    const model = cloneObject(defaultModel);

    const resources: any = null;

    const fetchAndUploadResourceSpy = vi
      .spyOn(fetchAndUploadResourceModule, "fetchAndUploadResource")
      .mockImplementation(resourceResponse as any);

    const fetchAndUploadThumbnailSpy = vi
      .spyOn(fetchAndUploadThumbnailModule, "fetchAndUploadThumbnail")
      .mockImplementation(resourceResponse as any);

    const res = await uploadResourcesFromUrl(model, resources, requestOpts);

    expect(res).toEqual([]);
    expect((fetchAndUploadResourceSpy as any).mock.calls.length).toBe(0);
    expect((fetchAndUploadThumbnailSpy as any).mock.calls.length).toBe(0);
  });
});
