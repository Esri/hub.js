import { IWithPermissions, IWithSlug } from "../traits/index";
import { IHubAdditionalResource } from "./IHubAdditionalResource";
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
  /**
   * If the item represents a hosted feature service with "Extract enabled", shows the formats that
   * can be extracted from the service via the "createReplica" operation.
   */
  serverExtractFormats?: string[];
  /**
   * links to additional resources specified in the formal item metadata
   * TODO: which items can have these? And is it only available for public items?
   */
  additionalResources?: IHubAdditionalResource[];
}

export type IHubContentEditor = IHubItemEntityEditor<IHubEditableContent> & {};
