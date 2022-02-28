/**
 * Data model for additional resources that are pulled from formal item metadata
 * and transformed into a hub-friendly interface
 */
export interface IHubAdditionalResource {
  name?: string;
  url: string;
  /** whether the url points to the service of the related item */
  isDataSource: boolean;
}
