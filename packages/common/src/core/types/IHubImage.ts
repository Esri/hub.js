/**
 * Hub Images can either be the name of a resource
 * or a full url to a publicly accessible image
 */
export interface IHubImage {
  /**
   * What type of image does this reference?
   */
  type: "resource" | "url";
  /**
   * The name of the resource, or the url
   */
  value: string;
}

/**
 * Extends IHubImage with a resource property
 * User to send an image file to a store
 */
export interface IHubImageOptions extends IHubImage {
  /**
   * If defined, treated as a file and uploaded
   * into a resource associated with an item
   */
  resource?: any;
}
