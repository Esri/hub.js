import { getItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { slugify } from "../utils";
import { uriSlugToKeywordSlug } from "./_internal/slugConverters";

const TYPEKEYWORD_SLUG_PREFIX = "slug";

const TYPEKEYWORD_MAX_LENGTH = 256;

/**
 * Create a slug, namespaced to an org and accounting for the 256 character limit
 * of individual typekeywords. Typically used to lookup items by a human readable name in urls
 *
 * @param title
 * @param orgKey
 * @returns
 */
export function constructSlug(title: string, orgKey: string) {
  // typekeywords have a max length of 256 characters, so we use the slug
  // format that gets persisted in typekeywords as our basis
  return (
    [
      // add the typekeyword slug prefix
      TYPEKEYWORD_SLUG_PREFIX,
      // add the orgKey segment
      orgKey.toLowerCase(),
      // add the slugified title segment
      slugify(title),
    ]
      .join("|")
      // allow some padding at the end for incrementing so we don't wind up w/ weird, inconsistent slugs
      // when the increment goes from single to multiple digits, i.e. avoid producing the following when
      // deduping:
      // slug|qa-pre-a-hub|some-really-really-...-really-long
      // slug|qa-pre-a-hub|some-really-really-...-really-lo-1
      // slug|qa-pre-a-hub|some-really-really-...-really-l-11
      // slug|qa-pre-a-hub|some-really-really-...-really-100
      .substring(0, TYPEKEYWORD_MAX_LENGTH - 4)
      // removing tailing hyphens
      .replace(/-+$/, "")
      // remove typekeyword slug prefix, it's re-added in setSlugKeyword
      .replace(new RegExp(`^${TYPEKEYWORD_SLUG_PREFIX}\\|`), "")
  );
}

/**
 * Adds/Updates the slug typekeyword
 * Returns a new array of keywords
 *
 * @param typeKeywords A collection of typekeywords
 * @param slug The slug to add/update
 * @returns An updated collection of typekeywords
 */
export function setSlugKeyword(typeKeywords: string[], slug: string): string[] {
  // remove slug entry from array
  const updatedTypekeywords = typeKeywords.filter(
    (entry: string) => !entry.startsWith(`${TYPEKEYWORD_SLUG_PREFIX}|`)
  );

  // now add it
  updatedTypekeywords.push([TYPEKEYWORD_SLUG_PREFIX, slug].join("|"));
  return updatedTypekeywords;
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
  const filter = slugInfo.slug.startsWith(`${TYPEKEYWORD_SLUG_PREFIX}|`)
    ? slugInfo.slug
    : [TYPEKEYWORD_SLUG_PREFIX, slugInfo.slug].join("|");
  const opts = {
    filter: `typekeywords:"${filter}"`,
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
  const combinedSlug = step ? [slugInfo.slug, step].join("-") : slugInfo.slug;
  return findItemsBySlug(
    { slug: combinedSlug, exclude: slugInfo.existingId },
    requestOptions
  )
    .then((results) =>
      !results.length
        ? combinedSlug
        : getUniqueSlug(slugInfo, requestOptions, step + 1)
    )
    .catch((e) => {
      throw Error(`Error in getUniqueSlug ${e}`);
    });
}
