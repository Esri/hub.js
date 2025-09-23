import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import * as canUseCreateReplicaModule from "../../src/downloads/canUseCreateReplica";
import * as canUseHubDownloadSystemModule from "../../src/downloads/canUseHubDownloadSystem";
import * as getCreateReplicaFormatsModule from "../../src/downloads/_internal/format-fetchers/getCreateReplicaFormats";
import * as getPagingJobFormatsModule from "../../src/downloads/_internal/format-fetchers/getPagingJobFormats";
import * as getFgdbJobFormatsModule from "../../src/downloads/_internal/format-fetchers/getFgdbJobFormats";
import { getHubDownloadApiFormats } from "../../src/downloads/getHubDownloadApiFormats";
import { ServiceDownloadFormat } from "../../src/downloads/types";
describe("getHubDownloadApiFormats", () => {
  it("should return create replica formats if supported by entity", () => {
    const entity = {
      serverExtractCapability: true,
    } as unknown as IHubEditableContent;
    const createReplicaFormats = [{ format: ServiceDownloadFormat.JSON }];
    spyOn(canUseCreateReplicaModule, "canUseCreateReplica").and.returnValue(
      true
    );
    const getCreateReplicaFormatsSpy = spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    ).and.returnValue(createReplicaFormats);
    const getPagingJobFormatsSpy = spyOn(
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
    spyOn(canUseCreateReplicaModule, "canUseCreateReplica").and.returnValue(
      false
    );
    spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).and.returnValue(true);
    const pagingJobFormats = [{ format: ServiceDownloadFormat.JSON }];
    const getCreateReplicaFormatsSpy = spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    );
    const getPagingJobFormatsSpy = spyOn(
      getPagingJobFormatsModule,
      "getPagingJobFormats"
    ).and.returnValue(pagingJobFormats);
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
    spyOn(canUseCreateReplicaModule, "canUseCreateReplica").and.returnValue(
      false
    );
    spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).and.returnValue(true);
    const fgdbJobFormats = [{ format: ServiceDownloadFormat.FILE_GDB }];
    const getCreateReplicaFormatsSpy = spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    );
    const getFgdbJobFormatsSpy = spyOn(
      getFgdbJobFormatsModule,
      "getFgdbJobFormats"
    ).and.returnValue(fgdbJobFormats);
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
    spyOn(canUseCreateReplicaModule, "canUseCreateReplica").and.returnValue(
      false
    );
    spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).and.returnValue(false);
    const getCreateReplicaFormatsSpy = spyOn(
      getCreateReplicaFormatsModule,
      "getCreateReplicaFormats"
    );
    const getPagingJobFormatsSpy = spyOn(
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
