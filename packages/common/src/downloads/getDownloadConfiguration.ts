import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import {
  FlowType,
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

  // TODO: Could we make a formal helper function instead?
  // Maybe something like this:
  //
  // type LogicByFlowMap = Record<FlowType, () => void>;
  // function executeLogicByFlow(
  //  flow: FlowType,
  //  logicByFlow: LogicByFlowMap
  // )
  // OR a switch statement: https://medium.com/technogise/type-safe-and-exhaustive-switch-statements-aka-pattern-matching-in-typescript-e3febd433a7a

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
