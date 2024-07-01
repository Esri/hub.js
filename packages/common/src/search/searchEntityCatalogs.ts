import { HubEntity } from "../core";
import { getWithDefault } from "../objects/get-with-default";
import { Catalog } from "./Catalog";
import {
  IHubCatalog,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "./types";

export function searchEntityCatalogs(
  entity: HubEntity,
  query: string | IQuery,
  options: IHubSearchOptions
): Promise<Array<IHubSearchResponse<IHubSearchResult>>> {
  // collect all the catalogs from the entity, and search them
  const catalogs = getWithDefault(entity, "catalogs", []) as IHubCatalog[];
  return searchCatalogs(catalogs, query, options);
}

export function searchCatalogs(
  catalogs: IHubCatalog[],
  query: string | IQuery,
  options: IHubSearchOptions
): Promise<Array<IHubSearchResponse<IHubSearchResult>>> {
  // iterate the passed catalog json objects and instantiate Catalog instances
  const instances = catalogs.map((catalog) => Catalog.fromJson(catalog));
  // execute search on all catalogs

  // return Promise.all(
  //   instances.map(async (cat) => cat.searchCollections(query, options))
  // );

  throw new Error("Method not implemented.");
}
