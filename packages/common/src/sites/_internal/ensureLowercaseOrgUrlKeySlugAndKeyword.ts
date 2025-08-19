/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { migrateSlugAndOrgUrlKey } from "../../core/_internal/sharedMigrations";
import { IModel } from "../../hub-types";
import { cloneObject } from "../../util";

/**
 * Fix issues caused by mixed case orgUrlKeys in the past.
 * Problems include:
 * - orgUrlKey not being lowercase
 * - slug getting the downcased orgUrlKey prepended to it multiple times
 * - slug typekeyword having an entry with the orgUrlKey prepended to it multiple times
 * @param model
 * @returns
 */
export function ensureLowercaseOrgUrlKeySlugAndKeyword(model: IModel): IModel {
  const clone = cloneObject(model);

  const slug = clone.item.properties.slug || "";
  const orgUrlKey = clone.item.properties.orgUrlKey || "";

  const resp = migrateSlugAndOrgUrlKey(
    slug,
    orgUrlKey,
    clone.item.typeKeywords
  );
  if (resp.slug) {
    // Ensure the slug is set in the properties
    clone.item.properties.slug = resp.slug;
  }
  if (resp.orgUrlKey) {
    clone.item.properties.orgUrlKey = resp.orgUrlKey;
  }

  clone.item.typeKeywords = resp.typeKeywords;

  return clone;
}
