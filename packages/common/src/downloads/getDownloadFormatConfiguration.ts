import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import {
  IDownloadFormatConfiguration,
  FlowType,
  IEntityDownloadConfiguration,
  IHubEditableContent,
} from "../core/types/IHubEditableContent";
import { getProp } from "../objects/get-prop";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { getCreateReplicaFormats } from "./_internal/format-fetchers/getCreateReplicaFormats";
import { getExportImageFormats } from "./_internal/format-fetchers/getExportImageFormats";
import { getPagingJobFormats } from "./_internal/format-fetchers/getPagingJobFormats";
import { canUseCreateReplica } from "./canUseCreateReplica";
import { canUseHubDownloadSystem } from "./canUseHubDownloadSystem";
import { IDynamicDownloadFormat, IStaticDownloadFormat } from "./types";

/**
 * Given an entity, return the download configuration for the entity
 * @param entity
 * @param context
 * @returns IEntityDownloadConfiguration - the download configuration for the entity
 */
export function getDownloadFormatConfiguration(
  entity: IHubEditableContent
): IEntityDownloadConfiguration {
  let downloadFlow: FlowType;
  let serverFormats: IDynamicDownloadFormat[] = [];
  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];
  const existingConfiguration: IEntityDownloadConfiguration =
    getProp(entity, "extendedProps.downloads") || {};

  if (canUseCreateReplica(entity)) {
    downloadFlow = "createReplica";
    serverFormats = getCreateReplicaFormats(entity);
  } else if (canUseHubDownloadSystem(entity)) {
    downloadFlow = "paging";
    serverFormats = getPagingJobFormats();
  } else if (canUseExportImageFlow(entity)) {
    downloadFlow = "exportImage";
    serverFormats = getExportImageFormats(entity);
  }

  // Base combined default formats
  const combinedDefaultFormats: IDownloadFormatConfiguration[] =
    serverFormats.map((f) => {
      return {
        label: `{{shared.fields.download.format.${f.format}:translate}}`,
        key: f.format,
        hidden: false,
      };
    });
  additionalResources.forEach((f, idx) => {
    combinedDefaultFormats.push({
      label:
        f.name ||
        (f.isDataSource && `{{shared.fields.download.dataSource:translate}}`) || // if the additional resource is the datasource
        `{{shared.fields.download.noTitle:translate}}`, // if the additional resource has no name,
      key: `additionalResource::${idx}`,
      hidden: false,
    });
  });

  // Existing configuration matches the current flow
  if (existingConfiguration.flowType === downloadFlow) {
    const missingDefaultFormats = existingConfiguration.formats.filter((f) => {
      return !combinedDefaultFormats.some((df) => df.key === f.key);
    });
    const validConfiguredFormats = existingConfiguration.formats
      .filter((f) => {
        return combinedDefaultFormats.some((df) => df.key === f.key);
      })
      .map((f) => {
        // append label
        const defaultFormat = combinedDefaultFormats.find(
          (df) => df.key === f.key
        );
        return {
          ...f,
          label: defaultFormat?.label || f.label,
        };
      });
    return {
      flowType: downloadFlow,
      formats: [...validConfiguredFormats, ...missingDefaultFormats],
    };
  }

  // Existing configuration does not match the current flow
  return {
    flowType: downloadFlow,
    formats: combinedDefaultFormats,
  };
}
