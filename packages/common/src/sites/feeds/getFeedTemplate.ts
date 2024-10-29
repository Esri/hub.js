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

  // TODO: Remove once we have successfully removed the old feed configuration helpers
  const mockedSite = { data: { feeds: feedsConfig } } as unknown as IModel;
  const configuredTemplate = getFeedConfiguration(mockedSite, format, version);

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
