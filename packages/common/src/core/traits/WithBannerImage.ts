import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubImage, IHubImageOptions } from "../types/IHubImage";

/**
 * WithBannerImage Trait
 * Adds a .bannerImage property
 */
export interface IWithBannerImage {
  /**
   * Banner Image as IHubImage
   */
  bannerImage?: IHubImage;
}

/**
 * Defines functions for working with Banner Images
 */
export interface IWithBannerImageStore {
  /**
   * Store a banner image
   * @param id
   * @param opts
   * @param ro
   */
  setBannerImage(
    id: string,
    opts: IHubImageOptions,
    ro: IUserRequestOptions
  ): Promise<IHubImage>;
  /**
   * Clear a banner image
   * @param id
   * @param ro
   */
  clearBannerImage(id: string, ro: IUserRequestOptions): Promise<void>;
}
