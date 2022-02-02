/**
 * General interface for a Layout
 *
 * Optional header and footer are only relevant for
 * a Hub Site
 */
export interface IHubLayout {
  /**
   * Sections are required for all Layouts
   */
  sections: [Record<string, any>];
  /**
   * header is optional; Only used in Sites
   */
  header?: Record<string, any>;
  /**
   * footer is optional; Only used in Sites
   */
  footer?: Record<string, any>;
}
