import { getFeedTemplate } from "../../../src/sites/feeds/getFeedTemplate";
import {
  FeedFormat,
  IFeedsConfiguration,
} from "../../../src/sites/feeds/types";
describe("getFeedTemplate", () => {
  it("gets DCAT US V1 configuration", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS1X: dcatUsConfig,
    };
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(dcatUsConfig);
  });
  it("gets DCAT US V3 configuration", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS3X: dcatUsConfig,
    };
    const format: FeedFormat = "dcat-us";
    const version = "3.0";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(dcatUsConfig);
  });
  it("gets DCAT US config from old dcatUS11 key", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS11: dcatUsConfig,
    };
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(dcatUsConfig);
  });
  it("gets DCAT US configuration containing spatial field with valid extent value", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
      spatial: "   {{  extent  }}   ",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS1X: dcatUsConfig,
    };
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(dcatUsConfig);
    expect(chk).toBeDefined();
    expect(chk.spatial).toEqual("{{extent:computeSpatialProperty}}");
    expect(chk.title).toEqual("{{title}}");
  });
  it("throws error if DCAT US version is not supported", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatUS11: dcatUsConfig,
    };
    const format: FeedFormat = "dcat-us";
    const version = "2.0";
    try {
      getFeedTemplate({ feedsConfig, format, version });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("gets DCAT AP configuration", async () => {
    const dcatApConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatAP2XX: dcatApConfig,
    };
    const format: FeedFormat = "dcat-ap";
    const version = "2.1.1";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(dcatApConfig);
  });
  it("gets DCAT AP config from old dcatAP201 key", async () => {
    const dcatApConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatAP201: dcatApConfig,
    };
    const format: FeedFormat = "dcat-ap";
    const version = "2.0.1";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(dcatApConfig);
  });
  it("throws error if DCAT AP version is not supported", async () => {
    const dcatApConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      dcatAP201: dcatApConfig,
    };
    const format: FeedFormat = "dcat-ap";
    const version = "3.0";
    try {
      getFeedTemplate({ feedsConfig, format, version });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("gets RSS configuration", async () => {
    const rssConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      rss2: rssConfig,
    };
    const format: FeedFormat = "rss";
    const version = "2.0";
    const chk = getFeedTemplate({ feedsConfig, format, version });
    expect(chk).toEqual(rssConfig);
  });
  it("throws error if RSS version is not supported", async () => {
    const rssConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      rss2: rssConfig,
    };
    const format: FeedFormat = "rss";
    const version = "3.0";
    try {
      getFeedTemplate({ feedsConfig, format, version });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("throws error if feed is not supported", async () => {
    const rssConfig = {
      title: "{{title}}",
    };
    const feedsConfig: IFeedsConfiguration = {
      rss2: rssConfig,
    };
    const format = "unknown-feed" as any;
    const version = "3.0";
    try {
      getFeedTemplate({ feedsConfig, format, version });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it("gets the default template if no template is configured", () => {
    const feedsConfig: IFeedsConfiguration = {};
    const format: FeedFormat = "dcat-ap";
    const version = "2.1.1";
    const result = getFeedTemplate({ feedsConfig, format, version });
    expect(result).toEqual({
      "dct:title": "{{name}}",
      "dct:description": "{{description}}",
      "dcat:contactPoint": {
        "vcard:fn": "{{owner}}",
        "vcard:hasEmail": "{{orgContactEmail}}",
      },
    });
  });
});
