export type IHubActionLink =
  | IHubActionLinkSection
  | IHubExternalActionLink
  | IHubContentActionLink
  | IHubWellKnownActionLink;

interface IHubBaseActionLink {
  label: string;
  description?: string;
  icon?: string;
}

export interface IHubActionLinkSection extends IHubBaseActionLink {
  kind: "section";
  children: IHubActionLink[];
}

export interface IHubExternalActionLink extends IHubBaseActionLink {
  kind: "external";
  href: string;
  target?: "_blank";
}

export interface IHubContentActionLink extends IHubBaseActionLink {
  kind: "content";
  contentId: string;
}

export interface IHubWellKnownActionLink extends IHubBaseActionLink {
  kind: "well-known";
  action: string;
}
