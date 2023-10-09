import { IModel } from "../../src/types";
import {
  getFeedConfiguration,
  setFeedConfiguration,
} from "../../src/sites/feed-configuration";

describe("getFeedConfiguration", () => {
  it("gets DCAT US configuration", async () => {
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
    expect(chk).toEqual(dcatUsConfig);
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
    expect(chk).toEqual(dcatUsConfig);
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

  it("gets DCAT AP configuration", async () => {
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
    expect(chk).toEqual(dcatApConfig);
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
    expect(chk).toEqual(dcatApConfig);
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

  it("gets RSS configuration", async () => {
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
    expect(chk).toEqual(rssConfig);
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

  it("throws error if feed is not supported", async () => {
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
    const format = "unknown-feed";
    const version = "3.0";
    try {
      getFeedConfiguration(site, format as any, version);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});

describe("setFeedConfiguration", () => {
  it("sets DCAT US configuration", async () => {
    const newDcatUsConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatUS1X: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "dcat-us";
    const version = "1.1";
    setFeedConfiguration(site, format, version, newDcatUsConfig);
    expect(site?.data?.feeds.dcatUS1X).toBeDefined();
    expect(site?.data?.feeds.dcatUS1X).toEqual(newDcatUsConfig);
  });

  it("gets DCAT US config from old dcatUS11 key", async () => {
    const newDcatUsConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatUS11: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "dcat-us";
    const version = "1.1";
    setFeedConfiguration(site, format, version, newDcatUsConfig);
    expect(site?.data?.feeds.dcatUS1X).toBeDefined();
    expect(site?.data?.feeds.dcatUS1X).toEqual(newDcatUsConfig);
  });

  it("throws error if DCAT US version is not supported", async () => {
    const newDcatUsConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatUS1X: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "dcat-us";
    const version = "2.0";
    try {
      setFeedConfiguration(site, format, version, newDcatUsConfig);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("sets DCAT AP configuration", async () => {
    const newDcatApConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatAP2XX: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "dcat-ap";
    const version = "2.1.1";
    const chk = getFeedConfiguration(site, format, version);
    setFeedConfiguration(site, format, version, newDcatApConfig);
    expect(site?.data?.feeds.dcatAP2XX).toBeDefined();
    expect(site?.data?.feeds.dcatAP2XX).toEqual(newDcatApConfig);
  });

  it("gets DCAT AP config from old dcatAP201 key", async () => {
    const newDcatApConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatAP201: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "dcat-ap";
    const version = "2.0.1";
    setFeedConfiguration(site, format, version, newDcatApConfig);
    expect(site?.data?.feeds.dcatAP2XX).toBeDefined();
    expect(site?.data?.feeds.dcatAP2XX).toEqual(newDcatApConfig);
  });

  it("throws error if DCAT AP version is not supported", async () => {
    const newDcatApConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          dcatAP201: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "dcat-ap";
    const version = "3.0";
    try {
      setFeedConfiguration(site, format, version, newDcatApConfig);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("sets RSS configuration", async () => {
    const newRssConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          rss2: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "rss";
    const version = "2.0";
    setFeedConfiguration(site, format, version, newRssConfig);
    expect(site?.data?.feeds.rss2).toBeDefined();
    expect(site?.data?.feeds.rss2).toEqual(newRssConfig);
  });

  it("throws error if RSS version is not supported", async () => {
    const newRssConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          rss2: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "rss";
    const version = "3.0";
    try {
      setFeedConfiguration(site, format, version, newRssConfig);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("throws error if RSS version is not supported", async () => {
    const newRssConfig = {
      title: "{{new_title}}",
    };

    const site = {
      item: { id: "123s" },
      data: {
        feeds: {
          rss2: {
            title: "{{old_title}}",
          },
        },
      },
    } as unknown as IModel;
    const format = "unknown-feed";
    const version = "3.0";
    try {
      setFeedConfiguration(site, format as any, version, newRssConfig);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
