import { IUser } from "@esri/arcgis-rest-portal";
import {
  WellKnownCatalog,
  getWellKnownCatalog,
} from "../../../search/wellKnownCatalog";

/**
 * Return a catalog structured for picking featured content.
 * @param user
 * @returns
 */
export function getFeaturedContentCatalogs(user: IUser) {
  const catalogNames: WellKnownCatalog[] = [
    "myContent",
    "favorites",
    "organization",
    "world",
  ];
  const catalogs = catalogNames.map((name: WellKnownCatalog) => {
    const opts = { user };
    const catalog = getWellKnownCatalog(
      "shared.fields.featuredContent",
      name,
      "item",
      opts
    );
    return catalog;
  });

  return { catalogs };
}
