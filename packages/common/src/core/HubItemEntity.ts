import {
  IGroup,
  IItem,
  getGroup,
  removeItemResource,
  setItemAccess,
  updateGroup,
} from "@esri/arcgis-rest-portal";
import type { IArcGISContext } from "../types/IArcGISContext";
import HubError from "../HubError";
import { uploadImageResource } from "../items/uploadImageResource";
import { unshareItemFromGroups } from "../items/unshare-item-from-groups";
import { shareItemToGroups } from "../items/share-item-to-groups";
import { deleteItemThumbnail } from "../items/deleteItemThumbnail";
import { setItemThumbnail } from "../items/setItemThumbnail";
import {
  addPermissionPolicy,
  checkPermission,
  IPermissionAccessResponse,
  IEntityPermissionPolicy,
  Permission,
  removePermissionPolicy,
} from "../permissions";
import { getItemThumbnailUrl, IThumbnailOptions } from "../resources";
import { cloneObject } from "../util";
import {
  IWithSharingBehavior,
  IWithStoreBehavior,
  IWithFeaturedImageBehavior,
  IWithPermissionBehavior,
} from "./behaviors";

import { IWithThumbnailBehavior } from "./behaviors/IWithThumbnailBehavior";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { SettableAccessLevel } from "./types/types";
import { sharedWith } from "./_internal/sharedWith";
import { IWithDiscussionsBehavior } from "./behaviors/IWithDiscussionsBehavior";
import { setDiscussableKeyword } from "../discussions";
import { IWithFollowersBehavior } from "./behaviors/IWithFollowersBehavior";

const FEATURED_IMAGE_FILENAME = "featuredImage.png";

/**
 * Base class for all Hub Entities backed by items
 */
export abstract class HubItemEntity<T extends IHubItemEntity>
  implements
    IWithStoreBehavior<T>,
    IWithSharingBehavior,
    IWithThumbnailBehavior,
    IWithFeaturedImageBehavior,
    IWithPermissionBehavior,
    IWithDiscussionsBehavior,
    IWithFollowersBehavior
{
  protected context: IArcGISContext;
  protected entity: T;
  protected isDestroyed: boolean = false;
  protected thumbnailCache: { file?: any; filename?: string; clear?: boolean } =
    null;

  constructor(entity: T, context: IArcGISContext) {
    this.context = context;
    this.entity = entity;
  }

  /**
   * Check if current user has a specific permission, accounting for
   * both system and entity level policies
   * @param permission
   * @returns
   */
  checkPermission(permission: Permission): IPermissionAccessResponse {
    return checkPermission(permission, this.context, this.entity);
  }
  /**
   * Get all policies related to a specific permission
   * @param permission
   * @returns
   */
  getPermissionPolicies(permission: Permission): IEntityPermissionPolicy[] {
    const permissions = this.entity.permissions || [];
    return permissions.filter((p) => p.permission === permission);
  }
  /**
   * Add a policy to the entity
   * @param policy
   */
  addPermissionPolicy(policy: IEntityPermissionPolicy): void {
    this.entity.permissions = addPermissionPolicy(
      this.entity.permissions,
      policy
    );
  }
  /**
   * Remove a policy from the entity
   * @param permission
   * @param id
   */
  removePermissionPolicy(permission: Permission, id: string): void {
    this.entity.permissions = removePermissionPolicy(
      this.entity.permissions,
      permission,
      id
    );
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
  get canEdit(): boolean {
    return this.entity.canEdit;
  }

  /**
   * Can the current user delete the Entity?
   * In order to delete an item, the user must be the owner of the item or a full org_admin
   * in the owner's organization.
   * @returns
   */
  get canDelete() {
    return this.entity.canDelete;
  }

  /**
   * The orgId of the Entity, if available
   * @returns the entity orgId, when available
   */
  get orgId() {
    return this.entity.orgId;
  }

  //#endregion IWithStoreBehavior

  //#region IWithSharingBehavior
  /**
   * Share the Entity with the specified group id
   * @param groupId
   */
  async shareWithGroup(groupId: string): Promise<void> {
    if (!this.context.currentUser) {
      throw new HubError(
        "Share Item With Group",
        "Cannot share item with group when no user is logged in."
      );
    }
    await shareItemToGroups(
      this.entity.id,
      [groupId],
      this.context.requestOptions,
      this.entity.owner
    );
  }

  /**
   * Share the Entity with the specified group ids
   * @param groupIds
   */
  async shareWithGroups(groupIds: string[]): Promise<void> {
    await shareItemToGroups(
      this.entity.id,
      groupIds,
      this.context.requestOptions,
      this.entity.owner
    );
  }

  /**
   * Unshare the Entity with the specified group id
   * @param groupId
   */
  async unshareWithGroup(groupId: string): Promise<void> {
    await unshareItemFromGroups(
      this.entity.id,
      [groupId],
      this.context.requestOptions,
      this.entity.owner
    );
  }

  /**
   * Unshare the Entity with the specified group ids
   * @param groupIds
   */
  async unshareWithGroups(groupIds: string[]): Promise<void> {
    await unshareItemFromGroups(
      this.entity.id,
      groupIds,
      this.context.requestOptions,
      this.entity.owner
    );
  }

  /**
   * Set the access level of the backing item
   * @param access
   */
  async setAccess(access: SettableAccessLevel): Promise<void> {
    await setItemAccess({
      id: this.entity.id,
      access,
      owner: this.entity.owner,
      authentication: this.context.session,
    });
    // if this succeeded, update the entity
    this.entity.access = access;
  }

  /**
   * Returns the followers group
   */
  async getFollowersGroup(): Promise<IGroup> {
    let group;
    try {
      if (this.entity.followersGroupId) {
        group = await getGroup(
          this.entity.followersGroupId,
          this.context.userRequestOptions
        );
      }
    } catch (error) {
      group = null;
    }

    return group;
  }

  /**
   * Sets the access level of the followers group
   * @param access
   */
  async setFollowersGroupAccess(access: SettableAccessLevel): Promise<void> {
    await updateGroup({
      group: {
        id: this.entity.followersGroupId,
        access,
      },
      authentication: this.context.session,
    });
  }

  /**
   * Sets whether or not the followers group is discussable
   * @param isDiscussable
   */
  async setFollowersGroupIsDiscussable(isDiscussable: boolean) {
    const group = await this.getFollowersGroup();
    const typeKeywords = setDiscussableKeyword(
      group.typeKeywords,
      isDiscussable
    );
    await updateGroup({
      group: {
        id: group.id,
        typeKeywords,
      },
      authentication: this.context.session,
    });
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
    // if we're not making changes to the thumbnail, this prop will not be defined
    if (this.thumbnailCache) {
      if (this.thumbnailCache.clear) {
        await deleteItemThumbnail(
          this.entity.id,
          this.entity.owner,
          this.context.userRequestOptions
        );
        this.thumbnailCache = null;
        this.entity.thumbnail = null;
        this.entity.thumbnailUrl = null;
      } else {
        // save the thumbnail
        await setItemThumbnail(
          this.entity.id,
          this.thumbnailCache.file,
          this.thumbnailCache.filename,
          this.context.userRequestOptions,
          this.entity.owner
        );

        // Note: updating the thumbnail alone does not update the modified date of the item
        // thus we can just set props on the entity w/o re-fetching
        this.entity.thumbnail = `thumbnail/${this.thumbnailCache.filename}`;
        this.entity.thumbnailUrl = this.getThumbnailUrl();
        // clear the thumbnail cache
        this.thumbnailCache = null;
      }
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
   * Clear the thumbnail from the item, if one exists. Persisted on next `.save()` call
   */
  clearThumbnail(): void {
    this.thumbnailCache = { clear: true };
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

  //#region IWithFeaturedImageBehavior
  /**
   * Set a featured image on the Entity, if one already exists it is cleared out before the new one is set
   * to keep the number of resources in control
   * @param file
   */
  async setFeaturedImage(
    file: any,
    clearExisting: boolean = false
  ): Promise<void> {
    try {
      // If we have a featured image then clear it out.
      if (this.entity.view?.featuredImageUrl || clearExisting) {
        await this.clearFeaturedImage();
      }
      // add the new featured image
      const featuredImageUrl = await uploadImageResource(
        this.entity.id,
        this.entity.owner,
        file,
        FEATURED_IMAGE_FILENAME,
        this.context.userRequestOptions
      );
      // If successful, update the entity
      this.entity.view = {
        ...this.entity.view,
        featuredImageUrl,
      };
      // save the entity
      await this.save();
    } catch (err) {
      // If the featured image url has been cleared, but the resource hasn't
      // Been removed then we'll get the following error message.
      // In that case, we'll try again with clearExisting set to true.
      if (
        err instanceof Error &&
        err.message === "CONT_00942: Resource already present"
      ) {
        return this.setFeaturedImage(file, true);
      } else {
        throw err;
      }
    }
  }
  /**
   * Remove the featured image from the item
   */
  async clearFeaturedImage(): Promise<void> {
    try {
      // remove the resource
      const response = await removeItemResource({
        id: this.entity.id,
        owner: this.entity.owner,
        resource: FEATURED_IMAGE_FILENAME,
        ...this.context.userRequestOptions,
      });
      // if not successful throw an error
      if (response && !response.success) {
        throw new HubError(
          "Clear Item Featured Image",
          "Unknown error clearing featured image."
        );
      }
      // If successful, clear the featured image url
      this.entity.view.featuredImageUrl = null;
      // save the entity
      await this.save();
    } catch (err) {
      if (err instanceof Error) {
        throw new HubError("Clear Item Featured Image", err.message, err);
      } else {
        throw new HubError(
          "Clear Item Featured Image",
          "Unknown error clearing featured image."
        );
      }
    }
  }
  //#endregion IWithFeaturedImageBehavior

  /**
   * Updates the isDiscussable property
   * @param isDiscussable whether to enable or disable discussions
   */
  updateIsDiscussable(isDiscussable: boolean): void {
    const typeKeywords = setDiscussableKeyword(
      this.entity.typeKeywords,
      isDiscussable
    );
    this.update({ typeKeywords, isDiscussable } as Partial<T>);
  }
}
