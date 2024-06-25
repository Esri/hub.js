import { IFeatureServiceDefinition } from "@esri/arcgis-rest-types";
import { IWithPermissions, IWithSlug } from "../traits/index";
import { IHubAdditionalResource } from "./IHubAdditionalResource";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";
import { IHubSchedule } from "./IHubSchedule";

/**
 * Defines the properties of an editable Hub Content object
 */
export interface IHubEditableContent
  extends IHubItemEntity,
    IWithSlug,
    IWithPermissions {
  /**
   * TODO: add additional props
   * perhaps using Pick from IHubContent
   */
  licenseInfo: string;
  /**
   * @deprecated use `extendedProps.serverQueryCapability` instead
   * If the item represents a feature or map service, shows whether the service has the
   * "Query" capability enabled. This is a pre-requisite for the Hub Download System to work.
   */
  serverQueryCapability?: boolean;
  /**
   * @deprecated use `extendedProps.serverExtractCapability` instead
   * If the item represents a feature service, shows whether the service has the "Extract"
   * capability enabled. This is a pre-requisite for Create Replica Downloads to work.
   */
  serverExtractCapability?: boolean;
  /**
   * @deprecated use `extendedProps.server.supportedExportFormats` instead
   * If the item represents a feature service with "Extract enabled", shows the formats that
   * can be extracted from the service via the "createReplica" operation.
   */
  serverExtractFormats?: string[];
  /**
   * @deprecated use `extendedProps.additionalResources` instead
   * links to additional resources specified in the formal item metadata
   */
  additionalResources?: IHubAdditionalResource[];
  /**
   * The schedule at which the reharvest of the item will occur
   */
  schedule?: IHubSchedule;

  extendedProps?: IExtendedProps;
}

type IExtendedProps = IContentExtendedProps | IServiceExtendedProps;

export interface IBaseExtendedProps {
  kind: "content" | "service";
  data?: any;
  metadata?: any;
  additionalResources?: IHubAdditionalResource[];
}

export interface IContentExtendedProps extends IBaseExtendedProps {
  kind: "content";
}

export interface IServiceExtendedProps extends IBaseExtendedProps {
  kind: "service";
  server?: Partial<IFeatureServiceDefinition>;
  serverQueryCapability?: boolean;
  serverExtractCapability?: boolean;
  serverExtractFormats?: string[];
}

export type IHubContentEditor = IHubItemEntityEditor<IHubEditableContent> & {};
