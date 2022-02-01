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
