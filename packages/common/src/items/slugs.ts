import { getItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { slugify } from "../utils";

// TODO: work out how to unify content slug fns
// https: github.com/Esri/hub.js/blob/master/packages/common/src/content/index.ts#L301-L348

/**
 * Uri slugs have `::` as a separator, but we need to use `|` in the typeKeywords. This function
 * converts a uri slug to a typeKeyword slug.
 * @param slug
 * @returns
 */
export function uriSlugToKeywordSlug(slug: string): string {
  if (slug.indexOf("::") > -1) {
    slug = slug.replace("::", "|");
  }
  return slug;
}

/**
 * Convert a typeKeyword slug to a uri slug. This is the reverse of uriSlugToKeywordSlug
 * @param slug
 * @returns
 */
export function keywordSlugToUriSlug(slug: string): string {
  if (slug.indexOf("|") > -1) {
    slug = slug.replace("|", "::");
  }
  return slug;
}

/**
 * Create a slug, namespaced to an org
 * Typically used to lookup items by a human readable name in urls
 *
 * @param title
 * @param orgKey
 * @returns
 */
export function constructSlug(title: string, orgKey: string) {
  return `${orgKey.toLowerCase()}|${slugify(title)}`;
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
 * search for items with `slug|snow-map` in it's typeKeywords array.
 * It also transforms uriSlugs into typeKeyword slugs by replacing `::` with `|`
 * Thus, passing a slug of `"myorg::snow-map"` would search for items with
 * `myorg|snow-map` in it's typeKeywords array.
 *
 * @param slug
 * @param requestOptions
 * @returns
 */
export function getItemBySlug(
  slug: string,
  requestOptions: IRequestOptions
): Promise<IItem> {
  const slugKeyword = uriSlugToKeywordSlug(slug);
  return findItemsBySlug({ slug: slugKeyword }, requestOptions).then(
    (results) => {
      if (results.length) {
        // search results only include a subset of properties of the item, so
        // issue a subsequent call to getItem to get the full item details
        return getItem(results[0].id, requestOptions);
      } else {
        return null;
      }
    }
  );
}

/**
 * Find items by slug typeKeywords.
 *
 * Optional exclude parameter accepts the id of an item we expect to
 * have this particular slug. This is used during update calls
 * where we don't know if the slug specifically has been updated, but we
 * don't want a false-postive from the item we are updating
 *
 * @param slug
 * @param requestOptions
 * @returns
 */
export function findItemsBySlug(
  slugInfo: {
    slug: string;
    exclude?: string;
  },
  requestOptions: IRequestOptions
): Promise<IItem[]> {
  const opts = {
    filter: `typekeywords:"slug|${slugInfo.slug}"`,
  } as ISearchOptions;

  if (requestOptions.authentication) {
    opts.authentication = requestOptions.authentication;
  } else if (requestOptions.portal) {
    opts.portal = requestOptions.portal;
  }

  // We need to check for other items w/ a slug during
  // the update calls. For those scenarios we are interested
  // in any _other_ items which may have a specific slug
  // but not one specific item
  if (slugInfo.exclude) {
    opts.q = `NOT id:${slugInfo.exclude}`;
  }
  return searchItems(opts)
    .then((response) => {
      return response.results;
    })
    .catch((e) => {
      throw e;
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
  slugInfo: {
    slug: string;
    existingId?: string;
  },
  requestOptions: IRequestOptions,
  step: number = 0
): Promise<string> {
  let combinedSlug = slugInfo.slug;
  if (step) {
    combinedSlug = `${slugInfo.slug}-${step}`;
  }
  return findItemsBySlug(
    { slug: combinedSlug, exclude: slugInfo.existingId },
    requestOptions
  )
    .then((results) => {
      if (results.length) {
        step++;
        return getUniqueSlug(slugInfo, requestOptions, step);
      } else {
        return combinedSlug;
      }
    })
    .catch((e) => {
      throw Error(`Error in getUniqueSlug ${e}`);
    });
}
