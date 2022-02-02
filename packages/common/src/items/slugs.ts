import { searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { dasherize } from "..";

// TODO: work out how to unify content slug fns
// https: github.com/Esri/hub.js/blob/master/packages/common/src/content/index.ts#L301-L348

/**
 * Create a slug, namespaced to an org
 * Typically used to lookup items by a human readable name in urls
 *
 * @param title
 * @param orgKey
 * @returns
 */
export function constructSlug(title: string, orgKey: string) {
  return `${orgKey.toLowerCase()}-${dasherize(title)}`;
}

/**
 * Adds/Updates the slug typekeyword
 * Returns a new array of keywords
 * @param typeKeywords
 * @param slug
 * @returns
 */
export function setSlugKeyword(typeKeywords: string[], slug: string): string[] {
  // remove slug entry from array
  const removed = typeKeywords.filter((entry: string) => {
    return !entry.startsWith("slug|");
  });

  // now add it
  removed.push(`slug|${slug}`);
  return removed;
}

/**
 * Get an item by searching for items with a typeKeyword like `slug|{slug-value}`
 *
 * For example, if you pass a slug `"snow-map"` into this function, it will
 * search for items with `slug|snow-map` in it's typeKeywords array,
 *
 * @param slug
 * @param requestOptions
 * @returns
 */
export function getItemBySlug(
  slug: string,
  requestOptions: IRequestOptions
): Promise<IItem> {
  const opts = {
    q: "",
    filter: `typeKeywords:"slug|${slug}"`,
    authentication: requestOptions.authentication,
  };
  return searchItems(opts)
    .then((response) => {
      if (response.results.length) {
        return response.results[0];
      } else {
        return null;
      }
    })
    .catch((e) => {
      throw Error(`Error in getItemBySlug ${e}`);
    });
}

/**
 * Given a slug, search for items using that slug, incrementing the slug name until
 * a unique value is found
 *
 * For example, if a slug of `"snow-map"` into this function and some item exists
 * with that slug, it would return `"snow-map-1"`.
 *
 * @param slug
 * @param requestOptions
 * @param step
 * @returns
 */
export function getUniqueSlug(
  slug: string,
  requestOptions: IRequestOptions,
  step: number = 0
): Promise<string> {
  let combined = slug;
  if (step) {
    combined = `${slug}-${step}`;
  }
  return getItemBySlug(combined, requestOptions)
    .then((result) => {
      if (result) {
        step++;
        return getUniqueSlug(slug, requestOptions, step);
      } else {
        return combined;
      }
    })
    .catch((e) => {
      throw Error(`Error in getUniqueSlug ${e}`);
    });
}
