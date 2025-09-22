import { IHubEditableContent } from "../../../../src/core/types/IHubEditableContent";
import { getCreateReplicaFormats } from "../../../../src/downloads/_internal/format-fetchers/getCreateReplicaFormats";
import { ServiceDownloadFormat } from "../../../../src/downloads/types";

describe("getCreateReplicaFormats", () => {
  it("should return an empty array if there are no formats", () => {
    const entity = {} as unknown as IHubEditableContent;
    const result = getCreateReplicaFormats(entity);
    expect(result).toEqual([]);
  });
  it("should return recognized createReplica formats in a predefined order", () => {
    const entity = {
      serverExtractFormats: [
        // Out of order
        ServiceDownloadFormat.JSON,
        ServiceDownloadFormat.GEOJSON,
      ],
    } as unknown as IHubEditableContent;
    const result = getCreateReplicaFormats(entity);
    expect(result.map((r) => r.format)).toEqual([
      ServiceDownloadFormat.GEOJSON,
      ServiceDownloadFormat.JSON,
    ]);
  });
  it("should return unrecognized createReplica formats at the end", () => {
    const entity = {
      serverExtractFormats: [
        ServiceDownloadFormat.GEOJSON,
        "unknown-format",
        ServiceDownloadFormat.JSON,
      ],
    } as unknown as IHubEditableContent;
    const result = getCreateReplicaFormats(entity);
    expect(result.map((r) => r.format)).toEqual([
      ServiceDownloadFormat.GEOJSON,
      ServiceDownloadFormat.JSON,
      "unknown-format" as ServiceDownloadFormat,
    ]);
  });
});
