import { getAdditionalResources } from "../../content/_internal/internalContentUtils";
import { IHubAdditionalResource } from "../../core/types/IHubAdditionalResource";
import {
  FlowType,
  IDownloadFormatConfiguration,
  IDownloadFormatConfigurationDisplay,
  IEntityDownloadConfiguration,
  IHubEditableContent,
} from "../../core/types/IHubEditableContent";
import { getProp } from "../../objects/get-prop";
import { canUseCreateReplica } from "../canUseCreateReplica";
import { canUseHubDownloadSystem } from "../canUseHubDownloadSystem";
import { getDownloadConfiguration } from "../getDownloadConfiguration";
import { IDynamicDownloadFormat } from "../types";
import { canUseExportImageFlow } from "./canUseExportImageFlow";
import { getCreateReplicaFormats } from "./format-fetchers/getCreateReplicaFormats";
import { getExportImageFormats } from "./format-fetchers/getExportImageFormats";
import { getPagingJobFormats } from "./format-fetchers/getPagingJobFormats";

// if (["Feature Service", "Map Service"].includes(entity.type)) {
//   downloadFlow = undefined;
//   serverFormats = getPagingJobFormats();
// }

export function getDownloadConfigurationDisplayFormats(
  entity: IHubEditableContent
): IDownloadFormatConfigurationDisplay[] {
  const downloadConfiguration = getDownloadConfiguration(entity);
  let formats = downloadConfiguration.formats;
  if (
    !downloadConfiguration.flowType &&
    ["Feature Service", "Map Service"].includes(entity.type)
  ) {
    const pagingFormats: IDownloadFormatConfiguration[] =
      getPagingJobFormats().map((f) => {
        return {
          key: f.format,
          hidden: false,
        };
      });
    formats = pagingFormats.concat(formats);
  }

  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];
  formats = formats.map((f) => {
    const isAdditionalResource = f.key.startsWith("additionalResource::");
    // STOPPING POINT
    return {
      label: `{{shared.fields.download.format.${f.key}:translate}}`,
      ...f,
    };
  });
}
