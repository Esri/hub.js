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

/**
 * Returns feed configuration from a site model
 *
 * @param {IModel} site - site model
 * @param {FeedFormat} format - feed format
 * @param {string} version  - semantic version
 * @param {Record<string, any>} feedConfig - feed configuration
 */
export function setFeedConfiguration(
  site: IModel,
  format: FeedFormat,
  version: string,
  feedConfig: Record<string, any>
) {
  if (format === "dcat-us") {
    setDcatUsConfig(site, version, feedConfig);
    return;
  }

  if (format === "dcat-ap") {
    setDcatApConfig(site, version, feedConfig);
    return;
  }

  if (format === "rss") {
    setRssConfig(site, version, feedConfig);
    return;
  }

  throw new Error("Unsupported feed format");
}

function getDcatApConfig(site: IModel, version: string) {
  if (getMajorVersion(version) === "2") {
    return site.data.feeds.dcatAP2XX || site.data.feeds.dcatAP201;
  }

  throw new Error("Unsupported DCAT AP version");
}

function getDcatUsConfig(site: IModel, version: string) {
  if (getMajorVersion(version) === "1") {
    return site.data.feeds.dcatUS1X || site.data.feeds.dcatUS11;
  }

  throw new Error("Unsupported DCAT US version");
}

function getRssConfig(site: IModel, version: string) {
  if (getMajorVersion(version) === "2") {
    return site.data.feeds.rss2;
  }

  throw new Error("Unsupported RSS version");
}

function setDcatApConfig(
  site: IModel,
  version: string,
  config: Record<string, any>
) {
  if (getMajorVersion(version) === "2") {
    site.data.feeds.dcatAP2XX = config;
    return;
  }

  throw new Error("Unsupported DCAT AP Version");
}

function setDcatUsConfig(
  site: IModel,
  version: string,
  config: Record<string, any>
) {
  if (getMajorVersion(version) === "1") {
    site.data.feeds.dcatUS1X = config;
    return;
  }

  throw new Error("Unsupported DCAT US Version");
}

function setRssConfig(
  site: IModel,
  version: string,
  config: Record<string, any>
) {
  if (getMajorVersion(version) === "2") {
    site.data.feeds.rss2 = config;
    return;
  }

  throw new Error("Unsupported RSS Version");
}

function getMajorVersion(version: string) {
  return version.split(".")[0];
}
