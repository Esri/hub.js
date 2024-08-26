import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import {
  DownloadFlowType,
  IDownloadFormatConfiguration,
  IEntityDownloadConfiguration,
  IHubEditableContent,
} from "../core/types/IHubEditableContent";
import { getProp } from "../objects/get-prop";
import { IDynamicDownloadFormat } from "./types";
import { getCreateReplicaFormats } from "./_internal/format-fetchers/getCreateReplicaFormats";
import { getExportImageFormats } from "./_internal/format-fetchers/getExportImageFormats";
import { getPagingJobFormats } from "./_internal/format-fetchers/getPagingJobFormats";
import { getDownloadFlow } from "./_internal/getDownloadFlow";

/**
 * Returns the download configuration for an entity at this moment in time.
 *
 * If no configuration exists, a default configuration is returned based on the entity's current download flow.
 * If a configuration exists but is no longer valid, the default configuration will also be returned.
 *
 * @param entity entity to get download configuration for
 * @returns the current download configuration for the entity
 */
export function getDownloadConfiguration(
  entity: IHubEditableContent
): IEntityDownloadConfiguration {
  // TODO: account for enterprise environments
  const downloadFlow = getDownloadFlow(entity);
  let serverFormats: IDynamicDownloadFormat[] = [];
  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];
  const existingConfiguration: IEntityDownloadConfiguration = getProp(
    entity,
    "extendedProps.downloads"
  );

  // TODO: Could we make a formal helper function instead?
  // Maybe something like this:
  //
  // type LogicByFlowMap = Record<DownloadFlowType, () => void>;
  // function executeLogicByFlow(
  //  flow: DownloadFlowType,
  //  logicByFlow: LogicByFlowMap
  // )
  // OR a switch statement: https://medium.com/technogise/type-safe-and-exhaustive-switch-statements-aka-pattern-matching-in-typescript-e3febd433a7a

  const actionsByFlow: Record<DownloadFlowType, () => void> = {
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

  actionsByFlow[downloadFlow] && actionsByFlow[downloadFlow]();

  // Base combined default formats
  const combinedDefaultFormats: IDownloadFormatConfiguration[] =
    serverFormats.map((f): IDownloadFormatConfiguration => {
      return {
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
    const missingDefaultFormats = combinedDefaultFormats.filter((f) => {
      return !existingConfiguration.formats.find((df) => df.key === f.key);
    });
    const validConfiguredFormats = existingConfiguration.formats.filter((f) => {
      return combinedDefaultFormats.find((df) => df.key === f.key);
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
