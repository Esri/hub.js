import {
  previewFeed,
  IPreviewFeedOptions,
} from "../../../src/sites/feeds/previewFeed";
import * as fetchMock from "fetch-mock";
import { IArcGISContext } from "../../../src/IArcGISContext";

describe("previewFeed", () => {
  const context = {
    hubUrl: "https://example.com",
  } as unknown as IArcGISContext;

  const baseOptions = {
    previewTemplate: { key: "value" },
    previewHubId: "hub123",
    context,
  } as unknown as IPreviewFeedOptions;

  afterEach(() => {
    fetchMock.restore();
  });

  it("should preview an RSS feed", async () => {
    const options: IPreviewFeedOptions = {
      ...baseOptions,
      format: "rss",
      version: "2.0",
    };
    const responseText = "<rss>Sample RSS Feed</rss>";
    fetchMock.getOnce(
      "https://example.com/api/feed/rss/2.0?id=hub123&rssConfig=%7B%22key%22%3A%22value%22%7D",
      {
        body: responseText,
        headers: { "Content-Type": "application/xml" },
      }
    );

    const result = await previewFeed(options);
    expect(result).toBe(responseText);
  });

  it("should preview a DCAT feed", async () => {
    const options: IPreviewFeedOptions = {
      ...baseOptions,
      format: "dcat-us",
      version: "1.1",
    };
    const responseJson = { title: "Sample DCAT Feed" };
    fetchMock.getOnce(
      "https://example.com/api/feed/dcat-us/1.1?id=hub123&dcatConfig=%7B%22key%22%3A%22value%22%7D",
      {
        body: responseJson,
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = await previewFeed(options);
    expect(result).toBe(JSON.stringify(responseJson, null, 2));
  });

  it("should throw an error if the response is not ok", async () => {
    fetchMock.getOnce(
      "https://example.com/api/feed/dcat-ap/2.1.1?id=hub123&dcatConfig=%7B%22key%22%3A%22value%22%7D",
      500
    );
    try {
      const options: IPreviewFeedOptions = {
        ...baseOptions,
        format: "dcat-ap",
        version: "2.1.1",
      };
      await previewFeed(options);
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toBe(
        "Failed to preview feed: Internal Server Error"
      );
    }
  });
});
