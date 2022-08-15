/**
 * Ensure consitent interfaces for the Hub classes
 */
export interface IHubClassBehavior<T> {
  /**
   * Export the internal entity to a JSON object. This should be used to get the JSON representation of the entity before passing into a component
   */
  toJson(): T;
  /**
   * Push changes into the Class. This method should be used when applying updates from a component, into the class instance
   * @param changes
   */
  applyChanges(changes: T): void;
  /**
   * Save the class instance to it's backing store
   */
  save(): Promise<void>;
  /**
   * Delete the class instance from it's backing store
   */
  delete(): Promise<boolean>;
}
