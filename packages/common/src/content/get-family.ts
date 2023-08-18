import { HubFamily } from "../types";
import { getCollection, getCollectionTypes } from "../collections";

// private helper functions
function collectionToFamily(collection: string): string {
  const overrides: any = {
    other: "content",
    solution: "template",
  };
  return overrides[collection] || collection;
}

/**
 * return the Hub family given an item's type
 * @param type item type
 * @returns Hub family
 */
export function getFamily(type: string) {
  let family;
  // override default behavior for the rows that are highlighted in yellow here:
  // https://esriis.sharepoint.com/:x:/r/sites/ArcGISHub/_layouts/15/Doc.aspx?sourcedoc=%7BADA1C9DC-4F6C-4DE4-92C6-693EF9571CFA%7D&file=Hub%20Routes.xlsx&nav=MTBfe0VENEREQzI4LUZFMDctNEI0Ri04NjcyLThCQUE2MTA0MEZGRn1fezIwMTIwMEJFLTA4MEQtNEExRC05QzA4LTE5MTAzOUQwMEE1RH0&action=default&mobileredirect=true&cid=df1c874b-c367-4cea-bc13-7bebfad3f2ac
  switch (type.toLowerCase()) {
    // NOTE: we really want to put tiled image services in the maps family
    // but we would need the typekeywords to differentiate them
    // for now send them to the maps route here:
    // https://github.com/ArcGIS/opendata-ui/blob/cdc0dac6b7e8c43afaa60ae219393a7d3aaa7433/packages/ember-arcgis-hub-components/addon/utils/content-routes.js#L39-L44
    case "image service":
      family = "dataset";
      break;
    case "feature service":
    case "raster layer":
      // TODO: check if feature service has > 1 layer first?
      family = "map";
      break;
    case "microsoft excel":
      family = "document";
      break;
    case "cad drawing":
    case "feature collection template":
    case "report template":
      family = "content";
      break;
    case "hub project":
      family = "project";
      break;
    case "discussion":
      family = "discussion";
      break;
    case "hub initiative":
      family = "initiative";
      break;
    default:
      // by default derive from collection
      family = collectionToFamily(getCollection(type));
  }
  return family as HubFamily;
}

/**
 * return the types associated with a provided Hub Family
 * Overrides are provided to match getFamily implementation
 * @param type item type
 * @returns Hub family
 */
export function getFamilyTypes(family: HubFamily): string[] {
  let types;
  // override default behavior for the rows that are highlighted in yellow here:
  // https://esriis.sharepoint.com/:x:/r/sites/ArcGISHub/_layouts/15/Doc.aspx?sourcedoc=%7BADA1C9DC-4F6C-4DE4-92C6-693EF9571CFA%7D&file=Hub%20Routes.xlsx&nav=MTBfe0VENEREQzI4LUZFMDctNEI0Ri04NjcyLThCQUE2MTA0MEZGRn1fezIwMTIwMEJFLTA4MEQtNEExRC05QzA4LTE5MTAzOUQwMEE1RH0&action=default&mobileredirect=true&cid=df1c874b-c367-4cea-bc13-7bebfad3f2ac
  switch (family.toLowerCase()) {
    case "content":
      types = getCollectionTypes("other");
      types = types.concat([
        "CAD Drawing",
        "Feature Collection Template",
        "Report Template",
      ]);
      break;
    case "template":
      types = [
        ...getCollectionTypes("template"),
        ...getCollectionTypes("solution"),
      ];
      break;
    case "dataset":
      types = getCollectionTypes(family.toLowerCase()).filter(
        (type) =>
          type !== "Feature Collection Template" &&
          // Changed as part of https://confluencewikidev.esri.com/x/KYJuDg
          // Remove when reclassification has been completed
          // type !== "Feature Service" &&
          type !== "Raster Layer" &&
          type !== "Microsoft Excel"
      );
      types = types.concat("Image Service");
      break;
    case "map":
      types = getCollectionTypes(family.toLowerCase()).filter(
        (type) => type !== "Image Service"
      );
      types = types.concat([
        // Changed as part of https://confluencewikidev.esri.com/x/KYJuDg
        // Remove when reclassification has been completed
        // "Feature Service",
        "Raster Layer",
      ]);
      break;
    case "document":
      types = getCollectionTypes(family.toLowerCase()).filter(
        (type) => type !== "CAD Drawing" && type !== "Report Template"
      );
      types = types.concat("Microsoft Excel");
      break;
    case "project":
      types = ["Hub Project"];
      break;
    case "discussion":
      types = ["Discussion"];
      break;
    case "initiative":
      types = ["Hub Initiative"];
      break;
    default:
      types = getCollectionTypes(family.toLowerCase());
  }
  return types;
}
