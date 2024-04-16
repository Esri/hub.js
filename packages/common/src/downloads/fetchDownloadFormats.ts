import { IArcGISContext } from "../ArcGISContext";
import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { canUseExportImage } from "./helpers/canUseExportImage";
import { canUseExportItem } from "./helpers/canUseExportItem";
import { canUseHubDownloadApi } from "./helpers/canUseHubDownloadApi";
import { fetchExportItemFormats } from "./helpers/fetchExportItemFormats";
import { getExportImageDownloadFormats } from "./helpers/getExportImageFormats";
import { getHubDownloadApiFormats } from "./helpers/getHubDownloadApiFormats";
import {
  IDownloadFormat,
  IDynamicDownloadFormat,
  IStaticDownloadFormat,
} from "./helpers/types";

export async function fetchDownloadFormats(
  entity: IHubEditableContent,
  context: IArcGISContext,
  layerId?: string
): Promise<IDownloadFormat[]> {
  // fetch dynamic formats
  let dynamicFormats: IDynamicDownloadFormat[] = [];
  if (canUseHubDownloadApi(entity, context)) {
    dynamicFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportItem(entity)) {
    dynamicFormats = await fetchExportItemFormats(entity, context, layerId);
  } else if (canUseExportImage(entity)) {
    dynamicFormats = getExportImageDownloadFormats();
  }

  // transform additional resources into static formats
  const staticFormats = (entity.additionalResources || []).map(toStaticFormat);

  // combine formats into single list
  return [...dynamicFormats, ...staticFormats];
}

function toStaticFormat(
  resource: IHubAdditionalResource
): IStaticDownloadFormat {
  return {
    type: "static",
    label: resource.name,
    url: resource.url,
  };
}
