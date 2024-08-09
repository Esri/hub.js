import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { getProp } from "../../../objects";
import { IDynamicDownloadFormat, ServiceDownloadFormat } from "../../types";
import { EXPORT_IMAGE_FORMATS, ExportImageFormat } from "../_types";

/**
 * @private
 * Returns all the download formats that are exposed by an Image Service via the /exportImage operation.
 */
export function getExportImageFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  const serverVersion =
    getProp(entity, "extendedProps.server.currentVersion") || 0;

  // NOTE: We have to imperatively exclude formats based on the server version
  // because there is no other way to determine which formats are supported.
  // See the EXPORT_IMAGE_FORMATS constant for notes on individual formats.
  const supportedFormats = (
    serverVersion < 10.2
      ? EXPORT_IMAGE_FORMATS.filter((f) => f !== ServiceDownloadFormat.PNG32)
      : EXPORT_IMAGE_FORMATS
  ) as ExportImageFormat[];

  return supportedFormats.map((format: ExportImageFormat) => ({
    type: "dynamic",
    format,
  }));
}
