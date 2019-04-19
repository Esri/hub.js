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
import { hubTypeLookup } from "./hub-type-map";
import { calcHighlights } from "./highlights";
import { IItem } from "@esri/arcgis-rest-common-types";

export function formatItem(item: IItem, query: string) {
  const formattedItem: any = {
    id: item.id,
    type: "item",
    attributes: formatItemAttributes(item)
  };
  if (query) {
    if (!item.meta) {
      // create highlights since AGO deos not return them
      formattedItem.meta = {};
      formattedItem.meta.highlights = highlights(item, query);
    }
  }
  return formattedItem;
}

function formatItemAttributes(item: IItem) {
  const hubTypes = hubTypeLookup(item.type);
  return Object.assign({}, item, {
    /* computed or null attributes so items & datasets look the same */
    name: item.title,
    searchDescription: item.description,
    hubType: hubTypes[0] || "Other"
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
