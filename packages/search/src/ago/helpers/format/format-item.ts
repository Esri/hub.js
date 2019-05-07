// helper functions to make items look more like datasets
//
// item queries will look like this ->
// {
//   data: [{
//     id: item-id,
//     type: 'item',
//     attributes: {
//       // will have attribute 'parity' with datasets. Many of these values will be null.
//     },
//     meta: { highlights: {} }
//     links: {
//       // computed links for the item result. These can be used throughout the app when linking to
//       // AGO, APIs, etc
//     }
//   }],
//   meta: {
//     aggs: {
//       // built by another query against AGO API and then formatted in the same format as the V3 API
//     },
//     stats: {
//       count:,
//       totalCount:,
//     }
//   }
// }
import { getCategory } from "@esri/hub-common";
import { calcHighlights } from "./highlights";
import { IItem } from "@esri/arcgis-rest-portal";

export function formatItem(item: IItem, query: string) {
  const formattedItem: any = {
    id: item.id,
    type: "item",
    attributes: formatItemAttributes(item)
  };
  if (query) {
    // create highlights since AGO does not return them
    formattedItem.meta = {};
    formattedItem.meta.highlights = highlights(item, query);
  }
  return formattedItem;
}

function formatItemAttributes(item: IItem) {
  const hubType = getCategory(item.type);
  return Object.assign({}, item, {
    // computed or null attributes so items & datasets look the same
    name: item.title,
    searchDescription: item.description,
    hubType: hubType || "Other"
  });
}

function highlights(
  item: IItem,
  query: string
): { name: string; searchDescription: string } {
  // calculate highlights based on AGO restricted item, hence use description field but return as `searchDescription`
  // because the search-result/component expects searchDescription
  return {
    name: calcHighlights(item.title, query, "name"),
    searchDescription: calcHighlights(item.description, query, "description")
  };
}
