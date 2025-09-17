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
import {
  IArcGISContext,
  IHubRequestOptions,
  IServiceExtendedProps,
} from "../../src";
import * as modelsModule from "../../src/models";
import * as fetchSettingsModule from "../../src/discussions/api/settings/settings";
import * as checkPermissionModule from "../../src/permissions/checkPermission";

describe("fetchHubContent", () => {
  let fetchContentSpy: jasmine.Spy;
  let fetchEditableContentEnrichmentsSpy: jasmine.Spy;
  let fetchModelFromItemSpy: jasmine.Spy;
  let fetchSettingsSpy: jasmine.Spy;
  let checkPermissionSpy: jasmine.Spy;

  beforeEach(() => {
    fetchContentSpy = spyOn(fetchContentModule, "fetchContent");
    fetchEditableContentEnrichmentsSpy = spyOn(
      fetchEditableContentEnrichmentsModule,
      "fetchEditableContentEnrichments"
    );
    fetchModelFromItemSpy = spyOn(modelsModule, "fetchModelFromItem");
    fetchSettingsSpy = spyOn(fetchSettingsModule, "fetchSettingV2");
    checkPermissionSpy = spyOn(checkPermissionModule, "checkPermission");
  });

  it("gets feature service content", async () => {
    fetchContentSpy.and.returnValue(
      Promise.resolve({ item: HOSTED_FEATURE_SERVICE_ITEM })
    );
    fetchEditableContentEnrichmentsSpy.and.returnValue({
      metadata: null,
      server: HOSTED_FEATURE_SERVICE_DEFINITION,
    });
    fetchModelFromItemSpy.and.returnValue(
      Promise.resolve(
        Promise.resolve({
          item: HOSTED_FEATURE_SERVICE_ITEM,
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.and.returnValue(
      Promise.resolve({
        id: HOSTED_FEATURE_SERVICE_GUID,
        ...DISCUSSION_SETTINGS,
      })
    );
    checkPermissionSpy.and.returnValue(true);
    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
    } as IHubRequestOptions;
    const context = { requestOptions } as any as IArcGISContext;

    const chk = await fetchHubContent(HOSTED_FEATURE_SERVICE_GUID, context);
    const extendedProps = chk.extendedProps as IServiceExtendedProps;
    expect(chk.id).toBe(HOSTED_FEATURE_SERVICE_GUID);
    expect(chk.owner).toBe(HOSTED_FEATURE_SERVICE_ITEM.owner);
    expect(extendedProps.serverExtractCapability).toBeTruthy();
    expect(extendedProps.serverQueryCapability).toBeTruthy();

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
    expect(fetchModelFromItemSpy).toHaveBeenCalledTimes(1);
    expect(fetchSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it("gets non-service content", async () => {
    fetchContentSpy.and.returnValue(Promise.resolve({ item: PDF_ITEM }));
    fetchEditableContentEnrichmentsSpy.and.returnValue({ metadata: null });
    fetchModelFromItemSpy.and.returnValue(
      Promise.resolve(
        Promise.resolve({
          item: PDF_ITEM,
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.and.returnValue(
      Promise.resolve({
        id: PDF_GUID,
        ...DISCUSSION_SETTINGS,
      })
    );
    checkPermissionSpy.and.returnValue(true);

    const requestOptions = { authentication: MOCK_AUTH } as IHubRequestOptions;
    const context = { requestOptions } as any as IArcGISContext;
    const chk = await fetchHubContent(PDF_GUID, context);
    expect(chk.id).toBe(PDF_GUID);
    expect(chk.owner).toBe(PDF_ITEM.owner);

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
      metadata: { metadata: "value" },
    });
    fetchModelFromItemSpy.and.returnValue(
      Promise.resolve(
        Promise.resolve({
          item: HOSTED_FEATURE_SERVICE_ITEM,
          data: { values: {} },
        })
      )
    );
    fetchSettingsSpy.and.returnValue(
      Promise.resolve({
        id: HOSTED_FEATURE_SERVICE_GUID,
        ...DISCUSSION_SETTINGS,
      })
    );
    checkPermissionSpy.and.returnValue(true);

    const requestOptions = {
      portal: MOCK_AUTH.portal,
      authentication: MOCK_AUTH,
    } as IHubRequestOptions;
    const context = { requestOptions } as any as IArcGISContext;

    const chk = await fetchHubContent(HOSTED_FEATURE_SERVICE_GUID, context, [
      "metadata",
    ]);
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
      ["metadata"]
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
    fetchModelFromItemSpy.and.returnValue(
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
    fetchSettingsSpy.and.returnValue(
      Promise.resolve({
        id: "ae3",
        ...DISCUSSION_SETTINGS,
      })
    );
    checkPermissionSpy.and.returnValue(true);

    const chk = await fetchHubContent("ae3", {
      hubRequestOptions: {
        authentication: MOCK_AUTH,
      },
    } as any as IArcGISContext);

    expect(chk.type).toBe("Hub Site Application");
  });

  it("uses default settings if fetchSettings fails", async () => {
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
    fetchModelFromItemSpy.and.returnValue(
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
    fetchSettingsSpy.and.returnValue(
      Promise.reject(new Error("Failed to fetch settings"))
    );
    checkPermissionSpy.and.returnValue(true);

    const chk = await fetchHubContent("ae3", {
      hubRequestOptions: {
        authentication: MOCK_AUTH,
      },
    } as any as IArcGISContext);

    expect(chk.type).toBe("Hub Site Application");
  });
});
