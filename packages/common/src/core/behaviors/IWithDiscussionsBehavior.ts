/**
 * Discussions-related behaviors
 */
export interface IWithDiscussionsBehavior {
  /**
   * Updates the isDiscussable property to the specified value
   * @param isDiscussable boolean
   */
  updateIsDiscussable(isDiscussable: boolean): void;
}
