import { IModel, getProp } from "@esri/hub-common";
import { getLayoutDependencies } from "./layout";

/**
 * Return a list of items this site depends on
 */
export function getDependencies(model: IModel) {
  const pages = getProp(model, "data.values.pages") || [];
  const pageIds = pages.map((p: any) => p.id);
  const layout = getProp(model, "data.values.layout") || {};
  const layoutDepIds = getLayoutDependencies(layout);
  return layoutDepIds.concat(pageIds);
}
