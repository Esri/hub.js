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
   * If the item represents a hosted feature service, shows whether the service has the "Extract"
   * capability enabled. This is a pre-requisite for Hosted Downloads to work.
   */
  serverExtractCapability?: boolean;
}

export type IHubContentEditor = IHubItemEntityEditor<IHubEditableContent> & {};
