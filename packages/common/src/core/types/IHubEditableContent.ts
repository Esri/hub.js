import { IWithPermissions, IWithSlug } from "../traits/index";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

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
   * If the item represents a service, shows whether the service has the "Extract"
   * capability enabled. This is a pre-requisite for Hosted Downloads to work.
   */
  serverExtractCapability?: boolean;
  /**
   * Indicates whether an item has opted into the hosted downloads experience
   *
   * NOTE: even if an item has opted into the hosted downloads experience, only items
   * that meet specific criteria will actually see the hosted experience on the live view
   * (i.e., the item is a Hosted Feature Service with the Extract capability enabled).
   */
  hostedDownloads?: boolean;
}

export type IHubContentEditor = IHubItemEntityEditor<IHubEditableContent> & {};
