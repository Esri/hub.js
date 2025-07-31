/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IModel } from "../../hub-types";
import { cloneObject } from "../../util";

export function ensureLowercaseOrgUrlKey(model: IModel): IModel {
  const clone = cloneObject(model);
  // Ensure the orgUrlKey is always lowercase
  if (clone.item.properties.orgUrlKey) {
    clone.item.properties.orgUrlKey =
      clone.item.properties.orgUrlKey.toLowerCase();
  }

  // The slug property may have duplicated the orgUrlKey
  // e.g. esso1|esso1|esso1|my-site
  // We need to ensure that the slug is only prefixed with the orgUrlKey once
  // and that it is all lowercase
  if (clone.item.properties.slug && clone.item.properties.orgUrlKey) {
    const orgUrlKey = clone.item.properties.orgUrlKey as string;
    let slug = (clone.item.properties.slug as string).toLowerCase();
    // remove any orgUrlKey prefixes from the slug
    // e.g. esso1|esso1|esso1|my-site -> my-site
    slug = slug.replace(new RegExp(`${orgUrlKey}\\|`, "gi"), "");
    // prefix the slug with the orgUrlKey
    // e.g. my-site -> esso1|my-site
    // and ensure it is lowercase
    // e.g. ESSIso1|my-site -> essiso1|my-site
    clone.item.properties.slug = `${orgUrlKey}|${slug}`.toLowerCase();

    // If there is an entry in the typeKeywords that starts with `slug|` remove it
    // and re-add it with the updated slug
    const slugKeywordIndex = clone.item.typeKeywords.findIndex((tk: string) =>
      tk.startsWith("slug|")
    );
    // remove the old slug keyword if it exists and add the new one
    // this is to ensure that the slug keyword is always in the
    // format `slug|orgUrlKey|user-defined-slug`
    // where orgUrlKey is always lowercase
    // and user-defined-slug is always the slug property
    // which is also always lowercase
    if (slugKeywordIndex !== undefined && slugKeywordIndex > -1) {
      clone.item.typeKeywords.splice(slugKeywordIndex, 1);
    }
    clone.item.typeKeywords.push(
      `slug|${clone.item.properties.slug as string}`
    );
  }

  return clone;
}
