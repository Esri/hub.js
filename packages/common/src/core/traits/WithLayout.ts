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
  /**
   * Given a version name, copy that into the item's /data
   * making it the "active version"
   * @param id
   * @param ro
   */
  setActiveVersion(id: string, ro: IUserRequestOptions): Promise<void>;
  /**
   * Return a list of all the versions by name
   * @param id
   * @param ro
   */
  listVersions(id: string, ro: IRequestOptions): Promise<string[]>;
  /**
   * Destroy the resource backing a version
   * @param id
   * @param name
   * @param ro
   */
  destroyVersion(
    id: string,
    name: string,
    ro: IUserRequestOptions
  ): Promise<void>;
  /**
   * Store a version as a resource, with the given name
   * @param id
   * @param name
   * @param layout
   * @param ro
   */
  saveVersion(
    id: string,
    name: string,
    layout: IHubLayout,
    ro: IUserRequestOptions
  ): Promise<void>;
  /**
   * Fetch the layout from a specific version.
   * Used when editing a specific version.
   * @param id
   * @param name
   * @param ro
   */
  loadVersion(
    id: string,
    name: string,
    ro: IRequestOptions
  ): Promise<IHubLayout>;
}
