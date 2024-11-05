import { IModel } from "../../types";
import { cloneObject } from "../../util";
import { setFeedConfiguration } from "../feed-configuration";
import { FeedFormat, IFeedsConfiguration } from "./types";

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

  // TODO: Remove once we have successfully removed the old feed configuration helpers
  const mockedSite = { data: { feeds: updatedConfig } } as unknown as IModel;
  setFeedConfiguration(mockedSite, format, version, updatedTemplate);
  return updatedConfig;
}
