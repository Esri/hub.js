import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import * as canUseCreateReplicaModule from "../../src/downloads/canUseCreateReplica";
import * as canUseHubDownloadSystemModule from "../../src/downloads/canUseHubDownloadSystem";
import * as getCreateReplicaFormatsModule from "../../src/downloads/_internal/format-fetchers/getCreateReplicaFormats";
import * as getPagingJobFormatsModule from "../../src/downloads/_internal/format-fetchers/getPagingJobFormats";
import * as getFgdbJobFormatsModule from "../../src/downloads/_internal/format-fetchers/getFgdbJobFormats";
import { getHubDownloadApiFormats } from "../../src/downloads/getHubDownloadApiFormats";
import { ServiceDownloadFormat } from "../../src/downloads/types";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("getHubDownloadApiFormats", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return create replica formats if supported by entity", () => {
    const entity = {
      serverExtractCapability: true,
    } as unknown as IHubEditableContent;
    const createReplicaFormats = [{ format: ServiceDownloadFormat.JSON }];
    vi.spyOn(canUseCreateReplicaModule, "canUseCreateReplica").mockReturnValue(
      true
    );
    const getCreateReplicaFormatsSpy = vi
      .spyOn(getCreateReplicaFormatsModule, "getCreateReplicaFormats")
      .mockReturnValue(createReplicaFormats as any);
    const getPagingJobFormatsSpy = vi.spyOn(
      getPagingJobFormatsModule,
      "getPagingJobFormats"
    );
    const result = getHubDownloadApiFormats(entity);
    expect(result.map((r) => r.format)).toEqual(
      createReplicaFormats.map((r) => r.format)
    );
    expect(getCreateReplicaFormatsSpy).toHaveBeenCalledTimes(1);
    expect(getCreateReplicaFormatsSpy).toHaveBeenCalledWith(entity);
    expect(getPagingJobFormatsSpy).not.toHaveBeenCalled();
  });

  it("else should should return paging job formats if supported by entity", () => {
    vi.spyOn(canUseCreateReplicaModule, "canUseCreateReplica").mockReturnValue(
      false
    );
    vi.spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).mockReturnValue(true);
    const pagingJobFormats = [{ format: ServiceDownloadFormat.JSON }];
    const getCreateReplicaFormatsSpy = vi.spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    );
    const getPagingJobFormatsSpy = vi
      .spyOn(getPagingJobFormatsModule, "getPagingJobFormats")
      .mockReturnValue(pagingJobFormats as any);
    const result = getHubDownloadApiFormats(
      {} as unknown as IHubEditableContent
    );
    expect(result.map((r) => r.format)).toEqual(
      pagingJobFormats.map((r) => r.format)
    );
    expect(getCreateReplicaFormatsSpy).not.toHaveBeenCalled();
    expect(getPagingJobFormatsSpy).toHaveBeenCalledTimes(1);
  });

  it("else should should return fgdb job formats if supported by entity", () => {
    vi.spyOn(canUseCreateReplicaModule, "canUseCreateReplica").mockReturnValue(
      false
    );
    vi.spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).mockReturnValue(true);
    const fgdbJobFormats = [{ format: ServiceDownloadFormat.FILE_GDB }];
    const getCreateReplicaFormatsSpy = vi.spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    );
    const getFgdbJobFormatsSpy = vi
      .spyOn(getFgdbJobFormatsModule, "getFgdbJobFormats")
      .mockReturnValue(fgdbJobFormats as any);
    const result = getHubDownloadApiFormats({
      extendedProps: {
        serverExtractCapability: true,
      },
    } as unknown as IHubEditableContent);
    expect(result.map((r) => r.format)).toEqual(
      fgdbJobFormats.map((r) => r.format)
    );
    expect(getCreateReplicaFormatsSpy).not.toHaveBeenCalled();
    expect(getFgdbJobFormatsSpy).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array if paging and create replica are not supported by entity", () => {
    vi.spyOn(canUseCreateReplicaModule, "canUseCreateReplica").mockReturnValue(
      false
    );
    vi.spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).mockReturnValue(false);
    const getCreateReplicaFormatsSpy = vi.spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    );
    const getPagingJobFormatsSpy = vi.spyOn(
      getPagingJobFormatsModule,
      "getPagingJobFormats"
    );
    const result = getHubDownloadApiFormats(
      {} as unknown as IHubEditableContent
    );
    expect(result).toEqual([]);
    expect(getCreateReplicaFormatsSpy).not.toHaveBeenCalled();
    expect(getPagingJobFormatsSpy).not.toHaveBeenCalled();
  });
});
