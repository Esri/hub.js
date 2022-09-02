/**
 * Composable behavior that adds Thumbnail support to an entity class
 */
export interface IWithThumbnailBehavior {
  /**
   * Set the thumbnail for an item backed entity. This call does not
   * actuall upload the thumbnail until `.save()` is called.
   * @param file
   * @param filename
   */
  setThumbnail(file: any, filename: string): void;
  /**
   * Return the full url to the thumbnail for the item backed entity.
   * Optionally, pass in a width. Default width is 200px, with 1:1.5 aspect ratio.
   * Other widths are: 400px, 800px and 2400px. A request for any other width will
   * snap to the next highest supported width. If the original image dimension is
   * smaller than the size queried, the original image will be returned.
   * @param width
   */
  getThumbnailUrl(width?: number): string;
}
