import { IArcGISContext } from "../ArcGISContext";
import HubError from "../HubError";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { canUseExportImage } from "./helpers/canUseExportImage";
import { canUseExportItem } from "./helpers/canUseExportItem";
import { canUseHubDownloadApi } from "./helpers/canUseHubDownloadApi";

interface IFetchDownloadFileUrlOptions {
  entity: IHubEditableContent;
  format: string;
  context: IArcGISContext;
  layers?: number[]; // layers to download; when not specified, all layers will be downloaded
  geometry?: any; // geometry to filter results by
  where?: string; // where clause to filter results by
  progressCallback?: (state: DownloadOperationState, percent?: number) => void;
}

type DownloadOperationState =
  | "pending"
  | "processing"
  | "creating"
  | "complete";

export async function fetchDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  let fetchingFn;
  if (canUseHubDownloadApi(options.entity, options.context)) {
    fetchingFn = fetchHubApiDownloadFileUrl;
  } else if (canUseExportItem(options.entity)) {
    fetchingFn = fetchExportItemDownloadFileUrl;
  } else if (canUseExportImage(options.entity)) {
    fetchingFn = fetchExportImageDownloadFileUrl;
  } else {
    throw new HubError(
      "fetchDownloadFileUrl",
      " Downloads are not supported for this item in this environment"
    );
  }
  return fetchingFn(options);
}

async function fetchHubApiDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  return null;
}

async function fetchExportItemDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  return null;
}

async function fetchExportImageDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  return null;
}
