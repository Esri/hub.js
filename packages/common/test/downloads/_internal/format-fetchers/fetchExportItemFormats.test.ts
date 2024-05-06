import { IArcGISContext } from "../../../../src/ArcGISContext";
import { IHubEditableContent } from "../../../../src/core/types/IHubEditableContent";
import { fetchExportItemFormats } from "../../../../src/downloads/_internal/format-fetchers/fetchExportItemFormats";

describe("fetchExportItemFormats", () => {
  // TODO: Flesh out this test once the function is implemented
  it("should throw a not implemented error", async () => {
    try {
      const entity = { id: "123" } as unknown as IHubEditableContent;
      const context = {} as unknown as IArcGISContext;
      const layers = [0];
      await fetchExportItemFormats(entity, context, layers);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("Not implemented");
    }
  });
});
