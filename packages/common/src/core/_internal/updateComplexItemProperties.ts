import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { HubEntity, IHubItemEntity } from "../types";
import { deepEqual } from "../../objects/deepEqual";
import { protectItem, unprotectItem } from "@esri/arcgis-rest-portal";

export type PropChangeHash = Record<string, boolean>;

/**
 * Centralized logic for updating non-simple properties for item backed entities.
 * Currently this is limited to `.protected`, and will correctly call `protectItem` or `unprotectItem` as needed.
 * as well as updating the entity's `.protected` property.
 * This could be extended to other properties which require special handling.
 * @param entity
 * @param upstream
 * @param requestOptions
 * @returns
 */
export async function updateComplexItemProperties<T extends IHubItemEntity>(
  entity: T,
  upstream: T,
  requestOptions: IUserRequestOptions
): Promise<T> {
  // Construct a hash of props to compare, defaulting to false (meaning no change)
  const changedProps: Record<string, boolean> = { protected: false };
  // Check those props and update the hash...
  Object.keys(changedProps).forEach((key) => {
    changedProps[key] = !deepEqual(entity[key], upstream[key]);
  });
  // Based on the props that have changed, we can take necessary actions
  if (changedProps.protected) {
    // PROBLEM: simply changing the protected property is not enough, the current user
    // must have `admin` level itemControl inorder to make the change.
    // We happen to map `.canDelete` to `itemControl: "admin"` so we can use that flag.
    // Since the UI layer _must_ also check this, while we check it here as well
    // should the user lack the right access, we will just skip the operation and log a warning
    if (entity.canDelete) {
      if (entity.protected) {
        await protectItem({ id: entity.id, ...requestOptions });
      } else {
        await unprotectItem({ id: entity.id, ...requestOptions });
      }
    } else {
      // TOOD: Wire into centralized logger
      // console.warn(
      //   `User lacks the necessary access to change the protection settings of the ${entity.type} item. The UI layer should be enforcing this logic.`
      // );
      // assign the upstream.protected value to the current entity
      // so we don't make it seem like things worked
      entity.protected = upstream.protected;
    }
  }
  return entity;
}
