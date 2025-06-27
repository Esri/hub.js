/**
 * Represents the feed format types that are supported in Hub
 */
export type FeedFormat = "dcat-us" | "dcat-ap" | "rss";

/**
 * Configuration object for feeds. Stores feed templates for various feed formats and versions
 * as well as miscellaneous configuration options. Always interact with this object through the
 * configuration helpers (getFeedTemplate(), setFeedTemplate(), etc.) when possible.
 */
export interface IFeedsConfiguration extends IWithFeedTemplatePaths {
  /**
   * Whether or not the feeds capability as a whole has been disabled
   */
  disabled?: boolean;
}

type IWithFeedTemplatePaths = Partial<
  Record<FeedTemplatePath, Record<string, any>>
>;

type FeedTemplatePath =
  | DcatUSTemplatePaths
  | DcatAPTemplatePaths
  | RssTemplatePaths;

type DcatUSTemplatePaths =
  // Original path for DCAT-US 1.1 configuration. We have an in-memory migration
  // that automatically migrates this value to an updated path. Some older sites
  // that haven't been saved in a while will still have this path present.
  | "dcatUS11"
  // Updated path for the primary DCAT-US 1.X template. This should be the default
  // template for all DCAT-US 1.X feeds (unless overriden by a more specific version)
  | "dcatUS1X"
  // Primary DCAT-US 3.X template. This should be the default template for all
  // DCAT-US 3.X feeds (unless overriden by a more specific version)
  | "dcatUS3X";

type DcatAPTemplatePaths =
  // Original path for DCAT-AP 2.0.1 configuration. We no longer support editing 2.0.1
  // templates, but we still expose an API endpoint for the 2.0.1 version. We'll
  // need to keep this value for backwards compatibility.
  | "dcatAP201"
  // Updated path for the primary DCAT-AP 2.X.X template. This should be the default
  // template for all DCAT-AP 2.X.X feeds (unless overriden by a more specific version).
  // 2.1.1 is the latest version of 2.X.X as of this writing.
  | "dcatAP2XX"
  // Updated path for the primary DCAT-AP 3.X.X template. This should be the default
  // template for all DCAT-AP 3.X.X feeds (unless overriden by a more specific version).
  // 3.0.0 is the latest version of 3.X.X as of this writing.
  | "dcatAP3XX";

type RssTemplatePaths = "rss2"; // Original path for the RSS 2.0 feed
