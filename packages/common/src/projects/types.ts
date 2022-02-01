import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IUserItemOptions } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IGeometry, IPoint } from "@esri/arcgis-rest-types";

export type IHubProjectOptions = Pick<Partial<IHubProject>, "title" | "org">;

/**
 * Base properties for Hub Models
 * This is a subset of IItem, that can apply to
 * models that are not backed by items
 */
export interface IHubBaseModel {
  readonly id?: string;
  readonly owner?: string;
  title: string;
  description?: string;
  snippet?: string;
  extent?: number[][];
  culture?: string;
  properties?: any;
  url?: string;
  tags?: string[];
  typeKeywords?: string[];
  readonly created?: number;
  readonly modified?: number;
}

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject extends IHubBaseModel, IWithSlug, IWithLayout {
  timeline?: IHubTimeline;
}

export interface IWithSlug {
  slug?: string;
  org: { id: string; key: string };
}

export interface IWithLayout {
  layout?: IHubLayout;
}

/**
 * Defined layout related functions that a module
 * working with IWithLayout objects must implement
 */
export interface IWithLayoutFns {
  listDrafts(id: string, ro: IRequestOptions): Promise<string[]>;
  destroyDraft(
    id: string,
    name: string,
    ro: IUserRequestOptions
  ): Promise<void>;
  saveDraft(
    id: string,
    name: string,
    layout: IHubLayout,
    ro: IUserRequestOptions
  ): Promise<void>;
  loadDraft(id: string, name: string, ro: IRequestOptions): Promise<IHubLayout>;
}

// Stored in item.data.heroImage
// can be resource or url
// Module needs to implement
export interface IWithHeroImage {
  heroImage?: IHubImage;
}

export interface IWithHeroImageFns {
  setHeroImage(
    id: string,
    opts: IHubImageOpts,
    ro: IUserRequestOptions
  ): Promise<IHubImage>;
}

export interface IHubImageOpts extends IHubImage {
  /**
   * If defined, treated as a file and uploaded
   * into a resource
   */
  resource?: any;
}

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
 * Very general interface for a layout
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

// Base props for Hub models - basically a subset of IItem

/**
 * Hub Project model
 */
// export interface IHubProject extends IHubBaseModel {
//   // Item can define it's own slug. It needs to be unique on the platform so
//   // the create/update calls need to do some preflight checks, and the UI should
//   // also verify the value. Default value will be dasherize(title)
//   // Slug is stored in item.data.slug, but on save,
//   // we also update typeKeyword: slug|{{orgkey}}-{{slug}}
//   // What's critical here is that the orgkey is for the org that owns the item, NOT the user's org
//   // Thus, we may need to store the org: {id, key} as the
//   // API does not make it easy to determine the owning orgId, and then the key
//   slug: string; // ninth-street-sewers
//   org: { id: string; key: string };

//   // additional status values tbd
//   status: "active" | "inactive";

//   // optional "features"
//   headerImage?: IHubImage;

//   timeline?: IHubTimeline;

//   // tbd specifically what this is
//   // measures?: IArcGISMetric[];

//   // Project geometry - point, line, polygon
//   // If this is just a single geometry, and used to display many projects on a single map
//   // it would be ideal to store this in item.properties.geometry vs in a resource
//   geometry?: IGeometry;

//   // easier to render on a map at small scales, and is more specific than taking a centroid etc
//   location?: IPoint;

//   // How should the Project be displayed
//   display: "about" | "explore" | "custom";
//   // if display is 'custom' the layout is used
//   layout?: IHubLayout;

//   // We can have a function to get a list of users, but better to store refs
//   contacts: string[]; // ['aturner', 'dbouwman'];

//   // I think how we represent the "collaboration settings" needs to be fleshed out
//   // until then lets use this very loose definition
//   // collaboration: [Record<string, any>];

//   // initiative connection tbd but it's likely some subset of an Initiative
//   // initiatives: Partial<IHubInitiative>[];
//   schemaVersion: number;
// }

/**
 * Hub Timeline Definition
 */
export interface IHubTimeline {
  title: string;
  description: string;
  // schemaVersion: number,
  stages: IHubStage[];
  // alignment: horizontal | vertical,
}

/**
 * Hub Timeline Stage
 */
export interface IHubStage {
  id: number; // guide for lookup reference to the stage
  title: string;
  timeframe: string; // currently a string to support timeframes such as "Late Fall" or "2023 Q3"
  description: string;
  status: string;
  icon: string;
  isEditing: boolean; // render editing ui for a stage
  leadingElement: boolean; // indicates if the move-up button should be disabled
  trailingElement: boolean; // indicates if the move-down button should be disabled
  // type: string, // default to manual (of manual | dateRange),
}
