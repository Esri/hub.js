import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { getProp } from "../../../objects";
import { IDynamicDownloadFormat, ServiceDownloadFormat } from "../../types";

/**
 * @private
 * Returns all the download formats that are exposed by an Image Service via the /exportImage operation.
 */
export function getExportImageFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  // TODO: Preserve the order of appearance in the UI
  const supportedFormats = [
    ServiceDownloadFormat.BMP,
    ServiceDownloadFormat.GIF,
    ServiceDownloadFormat.JPG,
    ServiceDownloadFormat.PNG,
    ServiceDownloadFormat.PNG24,
    ServiceDownloadFormat.PNG8,
    ServiceDownloadFormat.TIFF,
  ];

  const serverVersion = getProp(
    entity,
    "extendedProps.extendedProps.server.currentVersion"
  );
  if (serverVersion >= 10.0) {
    supportedFormats.push(ServiceDownloadFormat.JPG_PNG);
  }
  if (serverVersion >= 10.2) {
    supportedFormats.push(ServiceDownloadFormat.PNG32);
  }
  if (serverVersion >= 10.3) {
    supportedFormats.push(
      ServiceDownloadFormat.BIP,
      ServiceDownloadFormat.BSQ,
      ServiceDownloadFormat.LERC
    );
  }

  return supportedFormats.map((format) => ({ type: "dynamic", format }));
}
