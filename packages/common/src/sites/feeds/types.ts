export type FeedFormat = "dcat-us" | "dcat-ap" | "rss";

export interface IFeedsConfiguration extends IWithFeedTemplatePaths {
  disabled?: boolean;
}

type IWithFeedTemplatePaths = Partial<
  Record<FeedTemplatePath, Record<string, any>>
>;

type FeedTemplatePath =
  | DcatUSTemplatePaths
  | DcatAPTemplatePaths
  | RssTemplatePaths;

type DcatUSTemplatePaths = "dcatUS1X" | "dcatUS11";
type DcatAPTemplatePaths = "dcatAP2XX" | "dcatAP201";
type RssTemplatePaths = "rss2";
