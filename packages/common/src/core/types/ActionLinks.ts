export type HubActionLink =
  | IHubActionLinkSection
  | IHubExternalActionLink
  | IHubContentActionLink
  | IHubWellKnownActionLink;

/**
 * base action link properties that all action
 * link interfaces extend
 */
interface IHubBaseActionLink {
  /**
   * translated action label - used for the visible label
   * and/or the underlyiing a11y label
   */
  label: string;
  /**
   * whether the label should be shown in the UI or just be
   * used for the underlying a11y label
   */
  showLabel?: string;
  /** translated action description */
  description?: string;
  /** action icon */
  icon?: string;
}

/**
 * action link interface for sections
 */
export interface IHubActionLinkSection extends IHubBaseActionLink {
  kind: "section";
  /** section links */
  children: HubActionLink[];
}

/**
 * action link interface for linking to an external source
 */
export interface IHubExternalActionLink extends IHubBaseActionLink {
  kind: "external";
  /**
   * specifies the URL of the linked resource, which can be
   * set as an absolute or relative path.
   */
  href: string;
  /** specifies where to open the link */
  target?: "_blank";
}

/**
 * action link interface for linking to existing content
 */
export interface IHubContentActionLink extends IHubBaseActionLink {
  kind: "content";
  /** content id to link to */
  contentId: string;
}

/**
 * action link interface for well-known hub actions
 */
export interface IHubWellKnownActionLink extends IHubBaseActionLink {
  kind: "well-known";
  /** unique action identifier */
  action: string;
}
