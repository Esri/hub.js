import { IArcGISContext } from "../../ArcGISContext";
import { IHubAdditionalResource } from "../../core/types/IHubAdditionalResource";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { canUseHubDownloadApi } from "../canUseHubDownloadApi";
import { getHubDownloadApiFormats } from "../getHubDownloadApiFormats";
import { IDownloadFormat, IStaticDownloadFormat } from "../types";
import { canUseExportImageFlow } from "./canUseExportImageFlow";
import { getExportImageFormats } from "./format-fetchers/getExportImageFormats";

export function getBaseDownloadFormats(
  entity: IHubEditableContent,
  context: IArcGISContext
): IDownloadFormat[] {
  let baseFormats: IDownloadFormat[] = [];
  if (canUseHubDownloadApi(entity, context)) {
    baseFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportImageFlow(entity)) {
    baseFormats = getExportImageFormats(entity);
  }

  // add additional resource links as static formats
  // TODO: change to use `extendedProps.additionalResources`
  const additionalFormats = (entity.additionalResources || []).map(
    toStaticFormat
  );

  // combine formats into single list
  return [...baseFormats, ...additionalFormats];
}

function toStaticFormat(
  resource: IHubAdditionalResource
): IStaticDownloadFormat {
  return {
    type: "static",
    label:
      resource.name ||
      (resource.isDataSource && `{{dataSource:translate}}`) || // if the additional resource is the datasource
      `{{noTitle:translate}}`, // if the additional resource has no name
    url: resource.url,
  };
}
