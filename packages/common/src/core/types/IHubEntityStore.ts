import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { Filter, IHubSearchOptions, ISearchResponse } from "../..";

// Classe implement this for a specific type

export interface IHubEntityStore<T> {
  create(obj: T, requestOptions: IUserRequestOptions): Promise<T>;
  update(obj: T, requestOptions: IUserRequestOptions): Promise<T>;
  destroy(id: string, requestOptions: IUserRequestOptions): Promise<void>;
  get(identifier: string, requestOptions: IRequestOptions): Promise<T>;
  search(
    filter: Filter<"content">,
    opts: IHubSearchOptions
  ): Promise<ISearchResponse<T>>;
}
