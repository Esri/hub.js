import { IHubEditableContent } from "../../../../src/core/types/IHubEditableContent";
import * as canUseCreateReplicaModule from "../../../../src/downloads/canUseCreateReplica";
import * as getCreateReplicaFormatsModule from "../../../../src/downloads/_internal/format-fetchers/getCreateReplicaFormats";
import * as getPagingJobFormatsModule from "../../../../src/downloads/_internal/format-fetchers/getPagingJobFormats";
import { getHubDownloadApiFormats } from "../../../../src/downloads/_internal/format-fetchers/getHubDownloadApiFormats";
import { ServiceDownloadFormat } from "../../../../src";
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
  it("else should return paging job formats", () => {
    spyOn(canUseCreateReplicaModule, "canUseCreateReplica").and.returnValue(
      false
    );
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
});
