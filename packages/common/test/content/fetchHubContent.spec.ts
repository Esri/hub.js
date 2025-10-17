import * as fetchContentModule from "../../src/content/fetchContent";
import * as fetchEditableContentEnrichmentsModule from "../../src/content/_internal/fetchEditableContentEnrichments";
import {
  DISCUSSION_SETTINGS,
  HOSTED_FEATURE_SERVICE_DEFINITION,
  HOSTED_FEATURE_SERVICE_GUID,
  HOSTED_FEATURE_SERVICE_ITEM,
  PDF_GUID,
  PDF_ITEM,
} from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { fetchHubContent } from "../../src/content/fetchHubContent";
import * as fetchModelFromItemModule from "../../src/models/fetchModelFromItem";
import * as fetchSettingsModule from "../../src/discussions/api/settings/settings";
import { IHubRequestOptions } from "../../src/hub-types";
import { IServiceExtendedProps } from "../../src/core/types/IHubEditableContent";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("fetchHubContent", () => {
  let fetchContentSpy: any;
  let fetchEditableContentEnrichmentsSpy: any;
  let fetchModelFromItemSpy: any;
  let fetchSettingsSpy: any;

  beforeEach(() => {
    fetchContentSpy = vi.spyOn(fetchContentModule as any, "fetchContent");
    fetchEditableContentEnrichmentsSpy = vi.spyOn(
      fetchEditableContentEnrichmentsModule as any,
      "fetchEditableContentEnrichments"
    );
    fetchModelFromItemSpy = vi.spyOn(
      fetchModelFromItemModule as any,
      "fetchModelFromItem"
    );
    fetchSettingsSpy = vi.spyOn(fetchSettingsModule as any, "fetchSettingV2");
  });

  it("gets feature service content", async () => {
    fetchContentSpy.mockReturnValue(
      Promise.resolve({ item: HOSTED_FEATURE_SERVICE_ITEM })
    );
    fetchEditableContentEnrichmentsSpy.mockReturnValue({
      metadata: null,
      server: HOSTED_FEATURE_SERVICE_DEFINITION,
    });
    fetchModelFromItemSpy.mockReturnValue(
      Promise.resolve(
        Promise.resolve({
          item: HOSTED_FEATURE_SERVICE_ITEM,
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.mockReturnValue(
      Promise.resolve({
        id: HOSTED_FEATURE_SERVICE_GUID,
        ...DISCUSSION_SETTINGS,
      })
    );
    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
      isPortal: false,
    } as IHubRequestOptions;

    const chk = await fetchHubContent(
      HOSTED_FEATURE_SERVICE_GUID,
      requestOptions
    );
    const extendedProps = chk.extendedProps as IServiceExtendedProps;
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    expect(extendedProps.serverExtractCapability).toBeTruthy();
    expect(extendedProps.serverQueryCapability).toBeTruthy();

    expect(fetchContentSpy).toHaveBeenCalledTimes(1);
    expect(fetchContentSpy.mock.calls[0][0]).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledTimes(1);
    // NOTE: the last argument is an override for which enrichments should be fetched (undefined by default)
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledWith(
      HOSTED_FEATURE_SERVICE_ITEM,
      requestOptions,
      undefined
    );
    expect(fetchModelFromItemSpy).toHaveBeenCalledTimes(1);
    expect(fetchSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it("gets non-service content", async () => {
    fetchContentSpy.mockReturnValue(Promise.resolve({ item: PDF_ITEM }));
    fetchEditableContentEnrichmentsSpy.mockReturnValue({ metadata: null });
    fetchModelFromItemSpy.mockReturnValue(
      Promise.resolve(
        Promise.resolve({
          item: PDF_ITEM,
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.mockReturnValue(
      Promise.resolve({
        id: PDF_GUID,
        ...DISCUSSION_SETTINGS,
      })
    );

    const requestOptions = {
      authentication: MOCK_AUTH,
      isPortal: false,
    } as IHubRequestOptions;
    const chk = await fetchHubContent(PDF_GUID, requestOptions);
    expect(chk.id).toBe(PDF_GUID);
    expect(chk.owner).toBe(PDF_ITEM.owner);

    expect(fetchContentSpy).toHaveBeenCalledTimes(1);
    expect(fetchContentSpy.mock.calls[0][0]).toBe(PDF_GUID);
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledTimes(1);
    // NOTE: the last argument is an override for which enrichments should be fetched (undefined by default)
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledWith(
      PDF_ITEM,
      requestOptions,
      undefined
    );
  });

  it("allows override of enrichments to fetch", async () => {
    fetchContentSpy.mockReturnValue(
      Promise.resolve({ item: HOSTED_FEATURE_SERVICE_ITEM })
    );
    fetchEditableContentEnrichmentsSpy.mockReturnValue({
      metadata: { metadata: "value" },
    });
    fetchModelFromItemSpy.mockReturnValue(
      Promise.resolve(
        Promise.resolve({
          item: HOSTED_FEATURE_SERVICE_ITEM,
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.mockReturnValue(
      Promise.resolve({
        id: HOSTED_FEATURE_SERVICE_GUID,
        ...DISCUSSION_SETTINGS,
      })
    );

    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
      isPortal: false,
    } as IHubRequestOptions;

    const chk = await fetchHubContent(
      HOSTED_FEATURE_SERVICE_GUID,
      requestOptions,
      ["metadata"]
    );
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    // NOTE: These are undefined since we didn't explicitly ask for the server to be fetched
    const extendedProps = chk.extendedProps as IServiceExtendedProps;
    expect(extendedProps.serverExtractCapability).toBeUndefined();
    expect(extendedProps.serverQueryCapability).toBeUndefined();

    expect(fetchContentSpy).toHaveBeenCalledTimes(1);
    expect(fetchContentSpy.mock.calls[0][0]).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchEditableContentEnrichmentsSpy).toHaveBeenCalledWith(
      HOSTED_FEATURE_SERVICE_ITEM,
      requestOptions,
      ["metadata"]
    );
  });

  it("normalizes the item type", async () => {
    fetchContentSpy.mockReturnValue(
      Promise.resolve({
        item: {
          id: "ae3",
          type: "Web Mapping Application",
          typeKeywords: ["hubSite"],
        },
      })
    );
    fetchEditableContentEnrichmentsSpy.mockReturnValue({ metadata: null });
    fetchModelFromItemSpy.mockReturnValue(
      Promise.resolve(
        Promise.resolve({
          item: {
            id: "ae3",
            type: "Hub Site Application",
            typeKeywords: ["hubSite"],
          },
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.mockReturnValue(
      Promise.resolve({
        id: "ae3",
        ...DISCUSSION_SETTINGS,
      })
    );

    const chk = await fetchHubContent("ae3", {
      authentication: MOCK_AUTH,
      isPortal: false,
    });

    expect(chk.type).toBe("Hub Site Application");
  });

  it("uses default settings if fetchSettings fails", async () => {
    fetchContentSpy.mockReturnValue(
      Promise.resolve({
        item: {
          id: "ae3",
          type: "Web Mapping Application",
          typeKeywords: ["hubSite"],
        },
      })
    );
    fetchEditableContentEnrichmentsSpy.mockReturnValue({ metadata: null });
    fetchModelFromItemSpy.mockReturnValue(
      Promise.resolve(
        Promise.resolve({
          item: {
            id: "ae3",
            type: "Hub Site Application",
            typeKeywords: ["hubSite"],
          },
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.mockReturnValue(
      Promise.reject(new Error("Failed to fetch settings"))
    );

    const chk = await fetchHubContent("ae3", {
      authentication: MOCK_AUTH,
      isPortal: false,
    });

    expect(chk.type).toBe("Hub Site Application");
  });

  it("does not call fetchSettings if permissions invalid", async () => {
    fetchContentSpy.mockReturnValue(
      Promise.resolve({
        item: {
          id: "ae3",
          type: "Web Mapping Application",
          typeKeywords: ["hubSite"],
        },
      })
    );
    fetchEditableContentEnrichmentsSpy.mockReturnValue({ metadata: null });
    fetchModelFromItemSpy.mockReturnValue(
      Promise.resolve(
        Promise.resolve({
          item: {
            id: "ae3",
            type: "Hub Site Application",
            typeKeywords: ["hubSite"],
          },
          data: { values: {} },
        })
      )
    );

    const chk = await fetchHubContent("ae3", {
      authentication: MOCK_AUTH,
      isPortal: true,
    });

    expect(chk.type).toBe("Hub Site Application");
  });
});
