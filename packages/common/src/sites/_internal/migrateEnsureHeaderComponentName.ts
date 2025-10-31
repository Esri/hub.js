import { IModel } from "../../hub-types";
import { getProp } from "../../objects/get-prop";

/**
 * Ensure the header component has a name.
 * Starting ~Sept 15, 2025, up to Nov 4, 2025, Sites created via
 * the "Add Content" flow, had a header component without a name.
 * This resulted in the header not being rendered in the site, but
 * was renderered in the editor. This migration ensures that
 * the header component has a name of "site-header" if it is missing.
 * @param siteModel
 * @returns
 */
export function migrateEnsureHeaderComponentName(siteModel: IModel): IModel {
  const clone = { ...siteModel };
  const header = getProp(clone, "data.values.layout.header");
  if (header && header.component && !header.name) {
    header.name = "site-header";
  }
  return clone;
}
