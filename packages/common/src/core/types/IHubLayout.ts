/**
 * General interface for a Layout
 *
 * Optional header and footer are only used for
 * a Hub Site
 *
 * TODO: once hub.js is merged into the hub-ui
 * monorepo, remove IHubLayout in favor of
 * ILayoutV1
 */
export interface IHubLayout {
  /**
   * Sections are required for all Layouts
   */
  sections: Array<Record<string, any>>;
  /**
   * header is optional; Only used in Sites
   */
  header?: Record<string, any>;
  /**
   * footer is optional; Only used in Sites
   */
  footer?: Record<string, any>;
}
