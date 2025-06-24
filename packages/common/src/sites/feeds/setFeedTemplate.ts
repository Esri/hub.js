import { cloneObject } from "../../util";
import { FeedFormat, IFeedsConfiguration } from "./types";
import { getMajorVersion } from "./_internal/getMajorVersion";

export interface ISetFeedTemplateOptions {
  feedsConfig: IFeedsConfiguration;
  format: FeedFormat;
  version: string;
  updatedTemplate: Record<string, any>;
}

/**
 * Sets the feed template for a given feed format and version. Always use this function
 * to update feed templates rather than interacting with the feeds configuration object directly.
 * @param opts.feedsConfig - the raw feeds configuration object
 * @param opts.format - the feed format
 * @param opts.version - the feed version
 * @param opts.updatedTemplate - the updated feed template
 * @returns a new feeds configuration object with the updated template
 */
export function setFeedTemplate(
  opts: ISetFeedTemplateOptions
): Record<string, any> {
  const { feedsConfig, format, version, updatedTemplate } = opts;
  const updatedConfig = cloneObject(feedsConfig);
  if (format === "dcat-us") {
    setDcatUsConfig(updatedConfig, version, updatedTemplate);
  } else if (format === "dcat-ap") {
    setDcatApConfig(updatedConfig, version, updatedTemplate);
  } else if (format === "rss") {
    setRssConfig(updatedConfig, version, updatedTemplate);
  } else {
    throw new Error("Unsupported feed format");
  }
  return updatedConfig;
}

function setDcatApConfig(
  feedsConfig: IFeedsConfiguration,
  version: string,
  config: Record<string, any>
) {
  if (getMajorVersion(version) === "2") {
    feedsConfig.dcatAP2XX = config;
    return;
  } else if (getMajorVersion(version) === "3") {
    feedsConfig.dcatAP3XX = config;
    return;
  }

  throw new Error("Unsupported DCAT AP Version");
}

function setDcatUsConfig(
  feedsConfig: IFeedsConfiguration,
  version: string,
  config: Record<string, any>
) {
  if (getMajorVersion(version) === "1") {
    feedsConfig.dcatUS1X = config;
    return;
  }

  if (getMajorVersion(version) === "3") {
    feedsConfig.dcatUS3X = config;
    return;
  }

  throw new Error("Unsupported DCAT US Version");
}

function setRssConfig(
  feedsConfig: IFeedsConfiguration,
  version: string,
  config: Record<string, any>
) {
  if (getMajorVersion(version) === "2") {
    feedsConfig.rss2 = config;
    return;
  }

  throw new Error("Unsupported RSS Version");
}
