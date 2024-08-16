import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import {
  FlowType,
  IDownloadFormatConfiguration,
  IEntityDownloadConfiguration,
  IHubEditableContent,
} from "../core/types/IHubEditableContent";
import { getProp } from "../objects/get-prop";
import { canUseCreateReplica } from "./canUseCreateReplica";
import { canUseHubDownloadSystem } from "./canUseHubDownloadSystem";
import { IDynamicDownloadFormat } from "./types";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { getCreateReplicaFormats } from "./_internal/format-fetchers/getCreateReplicaFormats";
import { getExportImageFormats } from "./_internal/format-fetchers/getExportImageFormats";
import { getPagingJobFormats } from "./_internal/format-fetchers/getPagingJobFormats";
import { getDownloadFlow } from "./_internal/getDownloadFlow";

export function getDownloadConfiguration(
  entity: IHubEditableContent
): IEntityDownloadConfiguration {
  // TODO: inlcude isEnterprise
  const downloadFlow = getDownloadFlow(entity);
  let serverFormats: IDynamicDownloadFormat[] = [];
  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];
  const existingConfiguration: IEntityDownloadConfiguration = getProp(
    entity,
    "extendedProps.downloads"
  );

  const actionsByFlow: Record<FlowType, () => void> = {
    createReplica: () => {
      serverFormats = getCreateReplicaFormats(entity);
    },
    paging: () => {
      serverFormats = getPagingJobFormats();
    },
    exportImage: () => {
      serverFormats = getExportImageFormats(entity);
    },
  };

  actionsByFlow[downloadFlow]();

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
      key: `additionalResource::${idx}`,
      hidden: false,
    });
  });

  const shouldUseExistingConfiguration =
    existingConfiguration && existingConfiguration.flowType === downloadFlow;

  // Existing configuration matches the current flow
  if (shouldUseExistingConfiguration) {
    const missingDefaultFormats = existingConfiguration.formats.filter((f) => {
      return !combinedDefaultFormats.some((df) => df.key === f.key);
    });
    const validConfiguredFormats = existingConfiguration.formats.filter((f) => {
      return combinedDefaultFormats.some((df) => df.key === f.key);
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
