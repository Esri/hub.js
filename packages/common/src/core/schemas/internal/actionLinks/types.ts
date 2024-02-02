// import { IHubCatalog } from "../../../../search";
// import { IHubActionLinkSection, IHubContentActionLink, IHubExternalActionLink, IHubWellKnownActionLink } from "../../../types";

// /**
//  * Internal action link structure. This should
//  * only be used within the action-links component
//  */
// export type _IActionLink =
//   | _IActionLinkSection
//   | _IContentActionLink
//   | _IExternalActionLink
//   | _IWellKnownActionLink;

// /** internal base action link structure */
// interface _IBaseActionLink {
//   // unique link identifier - this is needed for keeping
//   // track of the link being edited, sorting, etc.
//   key: string;
//   // unique section identifier - this is needed for keeping
//   // track of what section a link is in
//   section?: string;
//   // internal property to distinguish whether the link
//   // is to an external source, existing content.
//   // TODO: well-known actions are not yet implemented
//   source?: 'external' | 'content' | 'well-known';
// }

// /** internal section link structure */
// export interface _IActionLinkSection
//   extends _IBaseActionLink,
//     Omit<IHubActionLinkSection, 'children'> {
//   children?: _IActionLink[];
// }

// /** internal content link structure */
// export interface _IContentActionLink
//   extends _IBaseActionLink,
//     Omit<IHubContentActionLink, 'contentId'> {
//   // for use with the gallery-picker field, we need to
//   // transform the optional contentId into an array
//   contentId?: string[];

//   // for use with action links during editing to allow for linking out to content
//   _href?: string;
// }

// /** internal external link structure */
// export interface _IExternalActionLink extends _IBaseActionLink, IHubExternalActionLink {}

// /** internal well-known link structure (NOTE: not yet implemented in field) */
// export interface _IWellKnownActionLink extends _IBaseActionLink, IHubWellKnownActionLink {}

// /** link editor uiSchema options */
// export interface ILinkUiSchemaOptions {
//   catalogs: IHubCatalog[];
//   facets: any[];
//   type: 'button' | 'block';
//   links: _IActionLink[];
//   editKey: string;
// }
