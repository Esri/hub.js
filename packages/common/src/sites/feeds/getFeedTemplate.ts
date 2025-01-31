import { IModel } from "../../types";
import { cloneObject } from "../../util";
import { getMajorVersion } from "./_internal/getMajorVersion";
import { getFeedConfiguration } from "../feed-configuration";
import { getDefaultTemplates } from "./_internal/defaults";
import { FeedFormat, IFeedsConfiguration } from "./types";

export interface IGetFeedTemplateOptions {
  feedsConfig: IFeedsConfiguration;
  format: FeedFormat;
  version: string;
}

/**
 * Get the feed template for a given feed format and version, accounting
 * for version fallbacks and default templates as necessary.
 * @param opts.feedConfig - the raw feeds configuration object
 * @param opts.format - the feed format
 * @param opts.version - the feed version
 * @returns a feed template object
 */
export function getFeedTemplate(
  opts: IGetFeedTemplateOptions
): Record<string, any> {
  const { feedsConfig, format, version } = opts;

  let configuredTemplate;
  if (format === "dcat-us") {
    configuredTemplate = getDcatUsConfig(feedsConfig, version);
  } else if (format === "dcat-ap") {
    configuredTemplate = getDcatApConfig(feedsConfig, version);
  } else if (format === "rss") {
    configuredTemplate = getRssConfig(feedsConfig, version);
  } else {
    throw new Error("Unsupported feed format");
  }

  return configuredTemplate || getDefaultTemplate(format, version);
}

function getDefaultTemplate(
  format: FeedFormat,
  version: string
): Record<string, any> {
  const majorVersion = getMajorVersion(version);
  const defaultTemplates = getDefaultTemplates();

  return cloneObject(defaultTemplates[format][majorVersion]);
}

function getDcatApConfig(feedsConfig: IFeedsConfiguration, version: string) {
  if (getMajorVersion(version) === "2") {
    return feedsConfig.dcatAP2XX || feedsConfig.dcatAP201;
  }

  throw new Error("Unsupported DCAT AP version");
}

function getDcatUsConfig(feedsConfig: IFeedsConfiguration, version: string) {
  if (getMajorVersion(version) === "1") {
    const dcatUsConfig = feedsConfig.dcatUS1X || feedsConfig.dcatUS11;
    // Some sites may have dcat us config with invalid
    // extent value for spatial property i.e. '{{extent}}'
    //
    // Following fixes that by replacing invalid default extent
    // value to valid one i.e. '{{{extent:computeSpatialProperty}}'
    if (
      dcatUsConfig &&
      typeof dcatUsConfig.spatial === "string" &&
      dcatUsConfig.spatial.replace(/\s/g, "") === "{{extent}}"
    ) {
      dcatUsConfig.spatial = "{{extent:computeSpatialProperty}}";
    }
    return dcatUsConfig;
  }

  if (getMajorVersion(version) === "3") {
    return feedsConfig.dcatUS3X;
  }

  throw new Error("Unsupported DCAT US version");
}

function getRssConfig(feedsConfig: IFeedsConfiguration, version: string) {
  if (getMajorVersion(version) === "2") {
    return feedsConfig.rss2;
  }

  throw new Error("Unsupported RSS version");
}
