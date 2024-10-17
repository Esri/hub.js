import { IArcGISContext } from "../../ArcGISContext";
import { FeedFormat } from "./types";

export interface IPreviewFeedOptions {
  format: FeedFormat;
  version: string;
  previewTemplate: Record<string, any>;
  previewHubId: string;
  context: IArcGISContext;
}

export async function previewFeed(opts: IPreviewFeedOptions): Promise<string> {
  const { format, version, previewHubId, context } = opts;
  const stringifiedTemplate = JSON.stringify(opts.previewTemplate);

  const baseUrl = `${context.hubUrl}/api/feed/${format}/${version}`;

  const searchParams = new URLSearchParams();
  searchParams.set("id", previewHubId);
  format === "rss"
    ? searchParams.set("rssConfig", stringifiedTemplate)
    : searchParams.set("dcatConfig", stringifiedTemplate);

  const response = await fetch(`${baseUrl}?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to preview feed: ${response.statusText}`);
  }

  let preview: string;
  if (format === "rss") {
    const asText = await response.text();
    preview = decodeURIComponent(asText);
  } else {
    const asJson = await response.json();
    preview = JSON.stringify(asJson, null, 2);
  }

  return preview;
}
