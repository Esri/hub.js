import {
  getUser,
  IGroup,
  IItem,
  setItemAccess,
  shareItemWithGroup,
  unshareItemWithGroup,
} from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { setItemThumbnail } from "../items/setItemThumbnail";
import { getItemThumbnailUrl, IThumbnailOptions } from "../resources";
import { cloneObject } from "../util";
import { mapBy } from "../utils";
import { IWithSharingBehavior, IWithStoreBehavior } from "./behaviors";

import { IWithThumbnailBehavior } from "./behaviors/IWithThumbnailBehavior";
import { IHubItemEntity, SettableAccessLevel } from "./types";
import { sharedWith } from "./_internal/sharedWith";

/**
 * Base class for all Hub Entities backed by items
 */
export abstract class HubItemEntity<T extends IHubItemEntity>
  implements
    IWithStoreBehavior<T>,
    IWithSharingBehavior,
    IWithThumbnailBehavior
{
  protected context: IArcGISContext;
  protected entity: T;
  protected isDestroyed: boolean = false;
  protected thumbnailCache: { file: any; filename: string } = null;

  constructor(entity: T, context: IArcGISContext) {
    this.context = context;
    this.entity = entity;
  }

  // Although we don't expose all the properties, we do expose a few for convenience
  /**
   * Return the entity id
   */
  get id() {
    return this.entity.id;
  }

  /**
   * Return the entity owner
   */
  get owner() {
    return this.entity.owner;
  }

  //#region IWithStoreBehavior

  /**
   * Return the backing entity as an object literal
   * @returns
   */
  toJson(): T {
    if (this.isDestroyed) {
      throw new Error("Entity is already destroyed.");
    }
    return cloneObject(this.entity) as unknown as T;
  }
  abstract update(changes: Partial<T>): void;
  abstract save(): Promise<void>;
  abstract delete(): Promise<void>;

  /**
   * Can the current user edit the Entity?
   * In order to edit an item, the user must be the owner of the item
   * or be a member of a shared editing group, to which the item is shared.
   * @returns
   */
  async canEdit(): Promise<boolean> {
    const user = this.context.currentUser;
    // owner can always edit
    if (user.username === this.entity.owner) {
      return Promise.resolve(true);
    }

    // Fetch the user's groups by fetching the user
    // we do this each time to ensure we have the latest groups
    const u = await getUser(user.username);
    const usersGroups = u.groups;

    if (!usersGroups.length) {
      // if user is not owner and not in any groups they can't have edit access
      return Promise.resolve(false);
    }
    // get the groups the entity is shared to
    const entityGroups = await this.sharedWith();
    // filter to shared edit groups
    const editGroupIds = entityGroups
      .filter((g) => {
        const caps = (g.capabilities as string[]) || [];
        return caps.includes("updateitemcontrol");
      })
      .map((g) => g.id);
    // get the user's groups ids
    const usersGroupsIds = mapBy("id", usersGroups) as string[];
    // check for any overlap
    let isMemberOfEditGroup = false;
    for (const id of usersGroupsIds) {
      isMemberOfEditGroup = editGroupIds.includes(id);
      if (isMemberOfEditGroup) {
        break;
      }
    }
    return Promise.resolve(isMemberOfEditGroup);
  }

  /**
   * Can the current user delete the Entity?
   * In order to delete an item, the user must be the owner of the item or a full org_admin
   * in the owner's organization.
   * @returns
   */
  async canDelete(): Promise<boolean> {
    const user = this.context.currentUser;
    // owner can always delete
    if (user.username === this.entity.owner) {
      return Promise.resolve(true);
    }
    // if not owner, check if user is org_admin in same org as owner
    if (user.role === "org_admin" && !user.roleId) {
      // need to get the owner, and see if the orgid matches
      const ownerUser = await getUser({
        username: this.entity.owner,
        authentication: this.context.session,
      });
      // ensure owner orgId is not null and matched current user
      const adminCanDelete = ownerUser.orgId && ownerUser.orgId === user.orgId;
      return Promise.resolve(adminCanDelete);
    } else {
      // not org admin, can't edit
      return Promise.resolve(false);
    }
  }

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

  /**
   * Hook that subclasses should call to invoke shared post-save behavior
   */
  async afterSave(): Promise<void> {
    // Handle Thumbnails
    // check if there is a thumbnail in the cache
    if (this.thumbnailCache) {
      // save the thumbnail
      await setItemThumbnail(
        this.entity.id,
        this.thumbnailCache.file,
        this.thumbnailCache.filename,
        this.context.userRequestOptions
      );

      // Note: updating the thumbnail alone does not update the modified date of the item
      // thus we can just set props on the entity w/o re-fetching
      this.entity.thumbnail = `thumbnail/${this.thumbnailCache.filename}`;
      this.entity.thumbnailUrl = this.getThumbnailUrl();
      // clear the thumbnail cache
      this.thumbnailCache = null;
    }
  }

  //#region IWithThumbnailBehavior

  /**
   * Store thumbnail information to be sent with the next `.save()` call
   * @param file
   * @param filename
   */
  setThumbnail(file: any, filename: string): void {
    // subclass is responsible for handling the implementation during the `.save()` call
    this.thumbnailCache = { file, filename };
  }
  /**
   * Return the full url to the thumbnail, optionally with a width parameter
   * @param width
   */
  getThumbnailUrl(width: number = 200): string {
    const minimalItem = {
      id: this.entity.id,
      access: this.entity.access,
      thumbnail: this.entity.thumbnail,
    } as unknown as IItem;

    const opts: IThumbnailOptions = {
      token: this.context.session.token,
      width,
    };

    return getItemThumbnailUrl(minimalItem, this.context.requestOptions, opts);
  }
  //#endregion IWithThumbnailBehavior
}
