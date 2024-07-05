import * as fetchContentModule from "../../src/content/fetchContent";
import * as fetchEditableContentEnrichmentsModule from "../../src/content/_internal/fetchEditableContentEnrichments";
import {
  HOSTED_FEATURE_SERVICE_DEFINITION,
  HOSTED_FEATURE_SERVICE_GUID,
  HOSTED_FEATURE_SERVICE_ITEM,
  PDF_GUID,
  PDF_ITEM,
} from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { fetchHubContent } from "../../src/content/fetchHubContent";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IServiceExtendedProps } from "../../src";

describe("fetchHubContent", () => {
  let fetchContentSpy: jasmine.Spy;
  let fetchEditableContentEnrichmentsSpy: jasmine.Spy;
  beforeEach(() => {
    fetchContentSpy = spyOn(fetchContentModule, "fetchContent");
    fetchEditableContentEnrichmentsSpy = spyOn(
      fetchEditableContentEnrichmentsModule,
      "fetchEditableContentEnrichments"
    );
  });

  it("gets feature service content", async () => {
    fetchContentSpy.and.returnValue(
      Promise.resolve({ item: HOSTED_FEATURE_SERVICE_ITEM })
    );
    fetchEditableContentEnrichmentsSpy.and.returnValue({
      metadata: null,
      server: HOSTED_FEATURE_SERVICE_DEFINITION,
    });

    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
    } as IRequestOptions;

    const chk = await fetchHubContent(
      HOSTED_FEATURE_SERVICE_GUID,
      requestOptions
    );
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    expect(chk.serverExtractCapability).toBeTruthy();
    expect(chk.serverQueryCapability).toBeTruthy();

    expect(fetchContentSpy).toHaveBeenCalledTimes(1);
    expect(fetchContentSpy.calls.argsFor(0)[0]).toBe(
      HOSTED_FEATURE_SERVICE_GUID
    );
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledTimes(1);
    // NOTE: the last argument is an override for which enrichments should be fetched (undefined by default)
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledWith(
      HOSTED_FEATURE_SERVICE_ITEM,
      requestOptions,
      undefined
    );
  });

  it("gets non-service content", async () => {
    fetchContentSpy.and.returnValue(Promise.resolve({ item: PDF_ITEM }));
    fetchEditableContentEnrichmentsSpy.and.returnValue({ metadata: null });

    const requestOptions = { authentication: MOCK_AUTH } as IRequestOptions;
    const chk = await fetchHubContent(PDF_GUID, requestOptions);
    expect(chk.id).toBe(PDF_GUID);
    expect(chk.owner).toBe(PDF_ITEM.owner);
    expect(chk.serverExtractCapability).toBeFalsy();

    expect(fetchContentSpy).toHaveBeenCalledTimes(1);
    expect(fetchContentSpy.calls.argsFor(0)[0]).toBe(PDF_GUID);
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledTimes(1);
    // NOTE: the last argument is an override for which enrichments should be fetched (undefined by default)
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledWith(
      PDF_ITEM,
      requestOptions,
      undefined
    );
  });

  it("allows override of enrichments to fetch", async () => {
    fetchContentSpy.and.returnValue(
      Promise.resolve({ item: HOSTED_FEATURE_SERVICE_ITEM })
    );
    fetchEditableContentEnrichmentsSpy.and.returnValue({
      data: { data: "value" },
    });

    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
    } as IRequestOptions;

    const chk = await fetchHubContent(
      HOSTED_FEATURE_SERVICE_GUID,
      requestOptions,
      ["data"]
    );
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    // NOTE: These are undefined since we didn't explicitly ask for the server to be fetched
    const extendedProps = chk.extendedProps as IServiceExtendedProps;
    expect(extendedProps.serverExtractCapability).toBeUndefined();
    expect(extendedProps.serverQueryCapability).toBeUndefined();

    expect(fetchContentSpy).toHaveBeenCalledTimes(1);
    expect(fetchContentSpy.calls.argsFor(0)[0]).toBe(
      HOSTED_FEATURE_SERVICE_GUID
    );
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledWith(
      HOSTED_FEATURE_SERVICE_ITEM,
      requestOptions,
      ["data"]
    );
  });

  it("normalizes the item type", async () => {
    fetchContentSpy.and.returnValue(
      Promise.resolve({
        item: {
          id: "ae3",
          type: "Web Mapping Application",
          typeKeywords: ["hubSite"],
        },
      })
    );
    fetchEditableContentEnrichmentsSpy.and.returnValue({ metadata: null });

    const chk = await fetchHubContent("ae3", {
      authentication: MOCK_AUTH,
    });

    expect(chk.type).toBe("Hub Site Application");
  });
});
