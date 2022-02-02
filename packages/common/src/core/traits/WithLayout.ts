import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubLayout } from "../types/IHubLayout";

/**
 * Properties associated with a Layout
 */
export interface IWithLayout {
  /**
   * Layout property
   */
  layout?: IHubLayout;
}
/**
 * Defined layout related functions that a module
 * working with IWithLayout objects must implement
 */
export interface IWithLayoutStore {
  setActiveVersion(id: string, ro: IUserRequestOptions): Promise<void>;
  listVersions(id: string, ro: IRequestOptions): Promise<string[]>;
  destroyVersion(
    id: string,
    name: string,
    ro: IUserRequestOptions
  ): Promise<void>;
  saveVersion(
    id: string,
    name: string,
    layout: IHubLayout,
    ro: IUserRequestOptions
  ): Promise<void>;
  loadVersion(
    id: string,
    name: string,
    ro: IRequestOptions
  ): Promise<IHubLayout>;
}
