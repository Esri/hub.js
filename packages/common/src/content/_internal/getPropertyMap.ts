import { IPropertyMap } from "../../core/_internal/PropertyMapper";
import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IModel to an IHubProject
 * @returns
 * @private
 */

export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  /**
   * content-specific mappings. Note: we do not need to explicitly map
   * properties from the content item's data.view into the entity's view
   * because that mapping is already defined in the base property map
   */
  // TODO: look into composeContent() for what we can add here

  return map;
}
