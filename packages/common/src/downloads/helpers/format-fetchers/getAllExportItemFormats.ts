import { EXPORT_ITEM_FORMATS, IDynamicDownloadFormat } from "../types";

export function getAllExportItemFormats(): IDynamicDownloadFormat[] {
  return EXPORT_ITEM_FORMATS.map((format) => ({
    type: "dynamic",
    format,
  }));
}
