import { IHubAdditionalResource } from "../../core/types/IHubAdditionalResource";
import {
  IDownloadFormatConfiguration,
  IDownloadFormatConfigurationDisplay,
  IHubEditableContent,
} from "../../core/types/IHubEditableContent";
import { getProp } from "../../objects/get-prop";
import { getDownloadConfiguration } from "../getDownloadConfiguration";

import { getPagingJobFormats } from "./format-fetchers/getPagingJobFormats";

export function getDownloadConfigurationDisplayFormats(
  entity: IHubEditableContent
): IDownloadFormatConfigurationDisplay[] {
  const configuration = getDownloadConfiguration(entity);
  const flowType = configuration.flowType;
  let formats = configuration.formats;

  // For feature or map services don't meet the criteria to be downloaded (i.e., no flowType)
  // Product wants to show paging formats as a preview of what _could_ be downloaded should
  // the criteria be met.
  if (!flowType && ["Feature Service", "Map Service"].includes(entity.type)) {
    const pagingFormats: IDownloadFormatConfiguration[] =
      getPagingJobFormats().map((f) => {
        return {
          key: f.format,
          hidden: false,
        };
      });
    // TODO: Should we just show paging formats as a preview or include additional resources?
    formats = pagingFormats.concat(formats);
  }

  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];

  return formats.map((f) =>
    isAdditionalResourceConfiguration(f)
      ? toAdditionalResourceConfigurationDisplay(f, additionalResources)
      : toDownloadFormatConfigurationDisplay(f)
  );
}

function isAdditionalResourceConfiguration(
  config: IDownloadFormatConfiguration
): boolean {
  return config.key.startsWith("additionalResource::");
}

function toDownloadFormatConfigurationDisplay(
  config: IDownloadFormatConfiguration
): IDownloadFormatConfigurationDisplay {
  return {
    label: `{{shared.fields.download.format.${config.key}:translate}}`,
    ...config,
  };
}

function toAdditionalResourceConfigurationDisplay(
  config: IDownloadFormatConfiguration,
  additionalResources: IHubAdditionalResource[]
): IDownloadFormatConfigurationDisplay {
  const resourceIndex = parseInt(config.key.split("::")[1], 10);
  const { name, isDataSource } = additionalResources[resourceIndex] || {};
  return {
    label:
      name ||
      (isDataSource && `{{shared.fields.download.dataSource:translate}}`) || // if the additional resource is the datasource
      `{{shared.fields.download.noTitle:translate}}`, // if the additional resource has no name,
    ...config,
  };
}
