import { setFeedTemplate } from "../../../src/sites/feeds/setFeedTemplate";
import {
  IFeedsConfiguration,
  FeedFormat,
} from "../../../src/sites/feeds/types";

describe("setFeedTemplate", () => {
  it("sets DCAT US V1 configuration", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS1X: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result.dcatUS1X).toBeDefined();
    expect(result.dcatUS1X).toEqual(updatedTemplate);
  });
  it("sets DCAT US V3 configuration", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS1X: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-us";
    const version = "3.0";
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result.dcatUS3X).toBeDefined();
    expect(result.dcatUS3X).toEqual(updatedTemplate);
  });
  it("sets DCAT US config from old dcatUS11 key", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS11: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result.dcatUS1X).toBeDefined();
    expect(result.dcatUS1X).toEqual(updatedTemplate);
  });
  it("throws error if DCAT US version is not supported", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS11: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-us";
    const version = "2.0";
    try {
      setFeedTemplate({
        feedsConfig,
        format,
        version,
        updatedTemplate,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("sets DCAT AP configuration", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatAP2XX: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-ap";
    const version = "2.1.1";
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result.dcatAP2XX).toBeDefined();
    expect(result.dcatAP2XX).toEqual(updatedTemplate);
  });
  it("sets DCAT AP config from old dcatAP201 key", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatAP201: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-ap";
    const version = "2.0.1";
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result.dcatAP2XX).toBeDefined();
    expect(result.dcatAP2XX).toEqual(updatedTemplate);
  });
  it("throws error if DCAT AP version is not supported", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatAP201: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "dcat-ap";
    const version = "3.0";
    try {
      setFeedTemplate({
        feedsConfig,
        format,
        version,
        updatedTemplate,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("sets RSS configuration", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      rss2: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "rss";
    const version = "2.0";
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });

    setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result.rss2).toBeDefined();
    expect(result.rss2).toEqual(updatedTemplate);
  });
  it("throws error if RSS version is not supported", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      rss2: {
        title: "{{old_title}}",
      },
    };
    const format: FeedFormat = "rss";
    const version = "3.0";
    try {
      setFeedTemplate({
        feedsConfig,
        format,
        version,
        updatedTemplate,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("throws error if feed is not supported", async () => {
    const updatedTemplate = {
      title: "{{new_title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      rss2: {
        title: "{{old_title}}",
      },
    };
    const format = "unknown-feed" as any;
    const version = "3.0";
    try {
      setFeedTemplate({
        feedsConfig,
        format,
        version,
        updatedTemplate,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
