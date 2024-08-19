import { isHostedFeatureServiceMainEntity } from "../../content";
import { IHubAdditionalResource } from "../../core/types/IHubAdditionalResource";
import {
  IDownloadFormatConfiguration,
  IDownloadFormatConfigurationDisplay,
  IHubEditableContent,
} from "../../core/types/IHubEditableContent";
import { getProp } from "../../objects/get-prop";
import { getDownloadConfiguration } from "../getDownloadConfiguration";
import { getCreateReplicaFormats } from "./format-fetchers/getCreateReplicaFormats";

import { getPagingJobFormats } from "./format-fetchers/getPagingJobFormats";

/**
 * @private
 * Returns configuration objects for each download format that should be displayed
 * in the editing experience of a content entity. This function should not be used
 * to calculate the download formats that should be present on the live UI.
 * @param entity entity to get download format configurations for
 * @returns download format configurations to display
 */
export function getDownloadConfigurationDisplayFormats(
  entity: IHubEditableContent
): IDownloadFormatConfigurationDisplay[] {
  const configuration = getDownloadConfiguration(entity);
  const flowType = configuration.flowType;
  let formats = configuration.formats;

  // For feature or map services that don't meet the criteria to be downloaded (i.e., no flowType)
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
    formats = pagingFormats;
  }

  // For main entities of a hosted feature service with extract disabled, we want to display
  // the list of createReplica formats as a preview of what _could_ be downloaded should
  // the extract capability be enabled
  if (
    isHostedFeatureServiceMainEntity(entity) &&
    flowType !== "createReplica"
  ) {
    const createReplicaFormats: IDownloadFormatConfiguration[] =
      getCreateReplicaFormats(entity).map((f) => {
        return {
          key: f.format,
          hidden: false,
        };
      });
    formats = createReplicaFormats;
  }

  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];

  return formats.map((f) =>
    isAdditionalResourceConfiguration(f)
      ? toAdditionalResourceConfigurationDisplay(f, additionalResources)
      : toDownloadFormatConfigurationDisplay(f)
  );
}

// Returns true if the configuration is for an additional resource
// TODO: Export this function as an internal helper
function isAdditionalResourceConfiguration(
  config: IDownloadFormatConfiguration
): boolean {
  return config.key.startsWith("additionalResource::");
}

// Converts a download format configuration storage object to a display object
// (i.e., adds appropriate labels, etc.)
function toDownloadFormatConfigurationDisplay(
  config: IDownloadFormatConfiguration
): IDownloadFormatConfigurationDisplay {
  return {
    label: `{{shared.fields.download.format.${config.key}:translate}}`,
    ...config,
  };
}

// Converts an additional resource configuration storage object to a display object
// (i.e., adds appropriate labels, etc.)
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
