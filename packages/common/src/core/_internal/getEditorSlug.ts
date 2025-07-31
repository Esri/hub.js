import { IWithSlug } from "../traits/IWithSlug";

/**
 * Get the user-editable portion of an entity's slug
 * @param entity
 * @returns
 */
export const getEditorSlug = (entity: IWithSlug): string => {
  const slug = (entity.slug || "").toLowerCase();
  const orgUrlKey = (entity.orgUrlKey || "").toLowerCase();
  if (orgUrlKey) {
    return slug.replace(new RegExp(`${orgUrlKey}\\|`, "gi"), "");
  } else {
    return slug;
  }
};
