import { getExportItemDataUrl } from "../../../src/downloads/_internal/getExportItemDataUrl";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("getExportItemDataUrl", () => {
  it("should return the correct data url for the export item", () => {
    const itemId = "abc123";
    const context = {
      portalUrl: "https://www.my-portal.com",
    } as unknown as IArcGISContext;
    const result = getExportItemDataUrl(itemId, context);
    expect(result).toBe(
      `https://www.my-portal.com/sharing/rest/content/items/${itemId}/data`
    );
  });
  it("should return the correct data url for the export item with a token", () => {
    const itemId = "abc123";
    const context = {
      portalUrl: "https://www.my-portal.com",
      hubRequestOptions: {
        authentication: {
          token: "my-token",
        },
      },
    } as unknown as IArcGISContext;
    const result = getExportItemDataUrl(itemId, context);
    expect(result).toBe(
      `https://www.my-portal.com/sharing/rest/content/items/${itemId}/data?token=my-token`
    );
  });
});
