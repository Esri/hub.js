import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Item specific functions that must be implemented by Managers which operate against
 * items stored in the Portal API
 */
export interface IHubItemEntityManager<T> {
  /**
   * Add a thumbnail to an item
   * @param entity
   * @param file
   * @param name
   * @param requestOptions
   */
  updateThumbnail(
    entity: T,
    file: any,
    filename: string,
    requestOptions?: IUserRequestOptions
  ): Promise<T>;

  // TODO: finalize how we leverage AVJ for validation via json schema
  // validate<T>(obj:T, requestOptions: IUserRequestOptions):Promise<IValidationErrors[]>;
  // schema: JSONSchemaType<T>
}
