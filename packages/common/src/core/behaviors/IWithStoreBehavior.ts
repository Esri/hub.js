/**
 * Ensure consitent interfaces for the Hub classes
 */
export interface IWithStoreBehavior<T> {
  /**
   * Export the internal entity to a JSON object. This should be used to get the JSON representation of the entity before passing into a component
   */
  toJson(): T;
  /**
   * Push changes into the Class. This method should be used when applying updates from a component, into the class instance
   * @param changes
   */
  update(changes: Partial<T>): void;
  /**
   * Save the class instance to it's backing store
   */
  save(): Promise<void>;
  /**
   * Delete the class instance from it's backing store
   */
  delete(): Promise<void>;

  /**
   * Can the current user edit the Entity?
   * User must be owner, or member of a shared editing group, to which the item is shared
   */
  canEdit(useCache: boolean): Promise<boolean>;
  /**
   * Can the current user delete the Entity?
   * User must own the entiry or be an org admin in the owner's org
   */
  canDelete(useCache: boolean): Promise<boolean>;
}
