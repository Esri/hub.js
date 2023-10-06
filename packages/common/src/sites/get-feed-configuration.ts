import { IModel } from "../types";

type FeedFormat = "dcat-us" | "dcat-ap" | "rss";

/**
 * Returns feed configuration from a site model
 *
 * @param {IModel} site - site model
 * @param {FeedFormat} format - feed format
 * @param {string} version  - semantic version
 */
export function getFeedConfiguration(
  site: IModel,
  format: FeedFormat,
  version: string
) {
  if (format === "dcat-us") {
    return getDcatUsConfig(site, version);
  }

  if (format === "dcat-ap") {
    return getDcatApConfig(site, version);
  }

  if (format === "rss") {
    return getRssConfig(site, version);
  }

  throw new Error("Unsupported feed format");
}

function getDcatApConfig(site: IModel, version: string) {
  if (getMajorVersion(version) === "2") {
    return {
      config: site.data.feeds.dcatAP2XX || site.data.feeds.dcatAP201,
      configPath: "data.feeds.dcatAP2XX",
    };
  }

  throw new Error("Unsupported DCAT AP version");
}

function getDcatUsConfig(site: IModel, version: string) {
  if (getMajorVersion(version) === "1") {
    return {
      config: site.data.feeds.dcatUS1X || site.data.feeds.dcatUS11,
      configPath: "data.feeds.dcatUS1X",
    };
  }

  throw new Error("Unsupported DCAT US version");
}

function getRssConfig(site: IModel, version: string) {
  if (getMajorVersion(version) === "2") {
    return {
      config: site.data.feeds.rss2,
      configPath: "data.feeds.rss2",
    };
  }

  throw new Error("Unsupported RSS version");
}

function getMajorVersion(version: string) {
  return version.split(".")[0];
}
