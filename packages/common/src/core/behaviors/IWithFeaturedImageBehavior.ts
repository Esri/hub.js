/**
 * Composable behavior that adds featured image support to an entity class
 */
export interface IWithFeaturedImageBehavior {
  /**
   * Set the featured image for the item
   * @param file
   * @param clearExisting
   */
  setFeaturedImage(file: any, clearExisting: boolean): Promise<void>;
  /**
   * Clears the featured image for the item
   * @param filename
   */
  clearFeaturedImage(filename: string): Promise<void>;
}
