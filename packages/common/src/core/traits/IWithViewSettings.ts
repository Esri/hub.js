/**
 * Hub Project view: defines the display properties of a project
 */
export interface IWithViewSettings {
  /**
   * Should the map be shown or not
   */
  showMap?: boolean;
  /**
   * Url of the items featured image
   */
  featuredImageUrl?: string;

  featuredContentIds: string[];
}
