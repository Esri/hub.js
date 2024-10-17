import { IModel } from "../../types";
import { cloneObject } from "../../util";
import { getFeedConfiguration, getMajorVersion } from "../feed-configuration";
import { getDefaultTemplates } from "./defaults";
import { FeedFormat, IFeedsConfiguration } from "./types";

export interface IGetFeedTemplateOptions {
  feedsConfig: IFeedsConfiguration;
  format: FeedFormat;
  version: string;
}

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
