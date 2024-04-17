import { IDynamicDownloadFormat, PORTAL_EXPORT_TYPES } from "../types";

export function getAllExportItemFormats(): IDynamicDownloadFormat[] {
  return Object.keys(PORTAL_EXPORT_TYPES).map((format) => ({
    type: "dynamic",
    format,
  }));
}
