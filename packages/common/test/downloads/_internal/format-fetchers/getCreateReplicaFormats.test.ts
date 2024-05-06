import { ServiceDownloadFormat } from "../../../../src";
import { IHubEditableContent } from "../../../../src/core/types/IHubEditableContent";
import { getCreateReplicaFormats } from "../../../../src/downloads/_internal/format-fetchers/getCreateReplicaFormats";

describe("getCreateReplicaFormats", () => {
  it("should return available createReplica formats", () => {
    const entity = {
      serverExtractFormats: [
        ServiceDownloadFormat.JSON,
        ServiceDownloadFormat.GEOJSON,
      ],
    } as unknown as IHubEditableContent;
    const result = getCreateReplicaFormats(entity);
    expect(result.map((r) => r.format)).toEqual([
      ServiceDownloadFormat.JSON,
      ServiceDownloadFormat.GEOJSON,
    ]);
  });
  it("should return an empty array if there are no formats", () => {
    const entity = {} as unknown as IHubEditableContent;
    const result = getCreateReplicaFormats(entity);
    expect(result).toEqual([]);
  });
});
