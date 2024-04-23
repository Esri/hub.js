import { HUB_PAGING_JOB_FORMATS, IDynamicDownloadFormat } from "../types";

export function getPagingJobFormats(): IDynamicDownloadFormat[] {
  return HUB_PAGING_JOB_FORMATS.map((format) => ({ type: "dynamic", format }));
}
