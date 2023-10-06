import { IModel } from "../../src/types";
import { getFeedConfiguration } from "../../src/sites/get-feed-configuration";

describe("getFeedConfiguration", () => {
  it("gets DCAT US config and config path", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatUS1X: dcatUsConfig,
        },
      },
    } as unknown as IModel;
    const format = "dcat-us";
    const version = "1.1";
    const chk = getFeedConfiguration(site, format, version);
    expect(chk?.config).toEqual(dcatUsConfig);
    expect(chk?.configPath).toEqual("data.feeds.dcatUS1X");
  });

  it("gets DCAT US config from old dcatUS11 key", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatUS11: dcatUsConfig,
        },
      },
    } as unknown as IModel;
    const format = "dcat-us";
    const version = "1.1";
    const chk = getFeedConfiguration(site, format, version);
    expect(chk?.config).toEqual(dcatUsConfig);
    expect(chk?.configPath).toEqual("data.feeds.dcatUS1X");
  });

  it("throws error if DCAT US version is not supported", async () => {
    const dcatUsConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatUS11: dcatUsConfig,
        },
      },
    } as unknown as IModel;
    const format = "dcat-us";
    const version = "2.0";
    try {
      getFeedConfiguration(site, format, version);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("gets DCAT AP config and config path", async () => {
    const dcatApConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatAP2XX: dcatApConfig,
        },
      },
    } as unknown as IModel;
    const format = "dcat-ap";
    const version = "2.1.1";
    const chk = getFeedConfiguration(site, format, version);
    expect(chk?.config).toEqual(dcatApConfig);
    expect(chk?.configPath).toEqual("data.feeds.dcatAP2XX");
  });

  it("gets DCAT AP config from old dcatAP201 key", async () => {
    const dcatApConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatAP201: dcatApConfig,
        },
      },
    } as unknown as IModel;
    const format = "dcat-ap";
    const version = "2.0.1";
    const chk = getFeedConfiguration(site, format, version);
    expect(chk?.config).toEqual(dcatApConfig);
    expect(chk?.configPath).toEqual("data.feeds.dcatAP2XX");
  });

  it("throws error if DCAT AP version is not supported", async () => {
    const dcatApConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatAP201: dcatApConfig,
        },
      },
    } as unknown as IModel;
    const format = "dcat-ap";
    const version = "3.0";
    try {
      getFeedConfiguration(site, format, version);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("gets RSS config and config path", async () => {
    const rssConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          rss2: rssConfig,
        },
      },
    } as unknown as IModel;
    const format = "rss";
    const version = "2.0";
    const chk = getFeedConfiguration(site, format, version);
    expect(chk?.config).toEqual(rssConfig);
    expect(chk?.configPath).toEqual("data.feeds.rss2");
  });

  it("throws error if RSS version is not supported", async () => {
    const rssConfig = {
      title: "{{title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          rss2: rssConfig,
        },
      },
    } as unknown as IModel;
    const format = "rss";
    const version = "3.0";
    try {
      getFeedConfiguration(site, format, version);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
