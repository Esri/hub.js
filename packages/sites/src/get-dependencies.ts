import { getSiteDependencies } from "./get-site-dependencies";
import { IModel } from "@esri/hub-common";

/**
 * Return a list of items this site depends on
 */
/* istanbul ignore next */
export function getDependencies(model: IModel) {
  /* istanbul ignore next */
  getSiteDependencies(model);
}
