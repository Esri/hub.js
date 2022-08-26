import {
  IGroup,
  setItemAccess,
  shareItemWithGroup,
  unshareItemWithGroup,
} from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { cloneObject } from "../util";
import { IWithSharingBehavior, IWithStoreBehavior } from "./behaviors";
import { IHubItemEntity, SettableAccessLevel } from "./types";
import { sharedWith } from "./_internal/sharedWith";

/**
 * Base class for all Hub Entities backed by items
 */
export abstract class HubItemEntity<T extends IHubItemEntity>
  implements IWithStoreBehavior<T>, IWithSharingBehavior
{
  protected context: IArcGISContext;
  protected entity: T;
  protected isDestroyed: boolean = false;

  constructor(entity: T, context: IArcGISContext) {
    this.context = context;
    this.entity = entity;
  }

  //#region IWithStoreBehavior

  toJson(): T {
    if (this.isDestroyed) {
      throw new Error("Entity is already destroyed.");
    }
    return cloneObject(this.entity) as unknown as T;
  }
  abstract update(changes: Partial<T>): void;
  abstract save(): Promise<void>;
  abstract delete(): Promise<void>;

  //#endregion IWithStoreBehavior

  //#region IWithSharingBehavior
  /**
   * Share the Entity with the specified group id
   * @param groupId
   */
  async shareWithGroup(groupId: string): Promise<void> {
    await shareItemWithGroup({
      id: this.entity.id,
      groupId,
      owner: this.entity.owner,
      authentication: this.context.session,
    });
  }
  /**
   * Unshare the Entity with the specified group id
   * @param groupId
   */
  async unshareWithGroup(groupId: string): Promise<void> {
    await unshareItemWithGroup({
      id: this.entity.id,
      groupId,
      owner: this.entity.owner,
      authentication: this.context.session,
    });
  }
  /**
   * Set the access level of the backing item
   * @param access
   */
  async setAccess(access: SettableAccessLevel): Promise<void> {
    await setItemAccess({
      id: this.entity.id,
      access,
      authentication: this.context.session,
    });
    // if this succeeded, update the entity
    this.entity.access = access;
  }

  /**
   * Return a list of groups the Entity is shared to.
   * @returns
   */
  async sharedWith(): Promise<IGroup[]> {
    // delegate to a util that merges the three arrays returned from the api, into a single array
    return sharedWith(this.entity.id, this.context.requestOptions);
  }

  //#endregion
}
