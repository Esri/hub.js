import { IWellKnownApis, IApiDefinition, NamedApis } from "../../types/types";

/**
 * Well known APIs
 * Short-forms for specifying common APIs
 * We will likely deprecate this
 */
export const SEARCH_APIS: IWellKnownApis = {
  arcgis: {
    label: "ArcGIS Online",
    url: "https://www.arcgis.com",
    type: "arcgis",
  },
  arcgisQA: {
    label: "ArcGIS Online QAEXT",
    url: "https://qaext.arcgis.com",
    type: "arcgis",
  },
  arcgisDEV: {
    label: "ArcGIS Online DEVEXT",
    url: "https://devext.arcgis.com",
    type: "arcgis",
  },
  hub: {
    label: "ArcGIS Hub",
    url: "https://hub.arcgis.com/api",
    type: "arcgis-hub",
  },
  hubDEV: {
    label: "ArcGIS Hub DEV",
    url: "https://hubdev.arcgis.com/api",
    type: "arcgis-hub",
  },
  hubQA: {
    label: "ArcGIS Hub QA",
    url: "https://hubqa.arcgis.com/api",
    type: "arcgis-hub",
  },
};

/**
 * @private
 * Convert an api "name" into a full ApiDefinition
 * @param api
 * @returns
 */
export function expandApi(api: NamedApis | IApiDefinition): IApiDefinition {
  if (typeof api === "string" && api in SEARCH_APIS) {
    return SEARCH_APIS[api];
  } else {
    // it's an object, so we trust that it's well formed
    return api as IApiDefinition;
  }
}
