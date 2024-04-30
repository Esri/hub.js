import { getExportImageFormats } from "../../../../src/downloads/_internal/format-fetchers/getExportImageFormats";

describe("getExportImageDownloadFormats", () => {
  // TODO: flesh out this test once the function is implemented
  it("should throw a non-implemented error", () => {
    try {
      getExportImageFormats();
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("Not implemented");
    }
  });
});
