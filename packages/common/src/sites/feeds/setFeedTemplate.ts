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
