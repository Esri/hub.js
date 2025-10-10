import { IModel, getWithDefault } from "@esri/hub-common";
import { getLayoutDependencies } from "../layout/get-layout-dependencies";

/**
 * Return a list of items this page depends on
 */
export function getPageDependencies(model: IModel) {
  const layout = getWithDefault(model, "data.values.layout", {});
  return getLayoutDependencies(layout);
}
