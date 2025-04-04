import type { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-service";
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
  /**
   * Discriminated union of additional prop hashes, divided by groupings of content item types
   * These additional props are optional enrichments that _may_ be fetched during the
   * fetchHubContent() process. They are not guaranteed to be present.
   */
  extendedProps?: IExtendedProps;
}

/**
 * Represents optional enrichments that can be fetched for a content item.
 * Different groups of content types may have different additional props.
 * This is a discriminated union of the possible additional props.
 */
export type IExtendedProps = IContentExtendedProps | IServiceExtendedProps;

/**
 * Represents the download process that the configuration was created for
 */
export type DownloadFlowType =
  | "createReplica"
  | "paging"
  | "exportImage"
  | "fgdb";

/**
 * Represents the storage object for configuring a single download format
 * TODO: Should this be IDownloadFormatConfigurationStorage?
 */
export interface IDownloadFormatConfiguration {
  /**
   * Key that identifies the download format.
   */
  key: string;
  /**
   * Whether the download format should be hidden from the UI
   */
  hidden?: boolean;
}

/**
 * Represents the display object for configuring a single download format.
 * To be used in editing contexts rather than user-facing contexts.
 */
export interface IDownloadFormatConfigurationDisplay
  extends IDownloadFormatConfiguration {
  /**
   * Translated label to display for the download format
   */
  label: string;
}

/**
 * Represents the configurations for downloading an item
 */
export interface IEntityDownloadConfiguration {
  /**
   * Indicates the download flow that the configuration was created for
   * (i.e., the download process that would have been used at the time of configuration)
   */
  flowType: DownloadFlowType;
  /**
   * Configuration for the download formats that are available for the item.
   * Saved in the order that they should be displayed in the UI.
   */
  formats: IDownloadFormatConfiguration[];
}

/**
 * Optional enrichments that are common to all content types
 */
export interface IBaseExtendedProps {
  /**
   * Discriminator for the kind of extended props object
   */
  kind: "content" | "service";
  /**
   * Formal item metadata
   */
  metadata?: any;
  /**
   * Convenience links to additional resources specified in the formal item metadata
   */
  additionalResources?: IHubAdditionalResource[];

  /**
   * Download configuration for the item
   */
  downloads?: IEntityDownloadConfiguration;
}

/**
 * Enrichments specific to items that are not backed by a service
 */
export interface IContentExtendedProps extends IBaseExtendedProps {
  kind: "content";
}

/**
 * Enrichments specific to service-backed items
 */
export interface IServiceExtendedProps extends IBaseExtendedProps {
  kind: "service";
  /**
   * Definition for the corresponding service (feature service, map service, etc.)
   */
  server?: Partial<IFeatureServiceDefinition>;
  /**
   * If the item represents a feature or map service, shows whether the service has the
   * "Query" capability enabled. This is a pre-requisite for the Hub Download System to work.
   * Convenience property derived from the `server` prop.
   */
  serverQueryCapability?: boolean;
  /**
   * If the item represents a feature service, shows whether the service has the "Extract"
   * capability enabled. This is a pre-requisite for "createReplica" downloads to work.
   * Convenience property derived from the `server` prop.
   *
   */
  serverExtractCapability?: boolean;
  /**
   * If the item represents a feature service with "Extract enabled", shows the formats that
   * can be extracted from the service via the "createReplica" operation.
   * Convenience property derived from the `server` prop.
   */
  serverExtractFormats?: string[];
}

export type IHubContentEditor = IHubItemEntityEditor<IHubEditableContent> & {
  /**
   * Download formats that should be rendered in the editing UI.
   *
   * NOTE: The formats present in this array may or may not be actually accessible.
   * Product has asked that in certain cases, we display formats that _could_ be available
   * if the user were to make the necessary changes to the item / service.
   */
  downloadFormats?: IDownloadFormatConfigurationDisplay[];
};
