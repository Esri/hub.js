/**
 * Composable behavior that adds featured image support to an entity class
 */
export interface IWithFeaturedImageBehavior {
  /**
   * Set the featured image for the item
   * @param file
   * @param filename
   */
  setFeaturedImage(file: any, filename: string): Promise<void>;
  /**
   * Clears the featured image for the item
   * @param filename
   */
  clearFeaturedImage(filename: string): Promise<void>;
}
