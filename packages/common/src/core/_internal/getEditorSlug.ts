import { IWithSlug } from "../traits/IWithSlug";

/**
 * Get the user-editable portion of an entity's slug
 * @param entity
 * @returns
 */
export const getEditorSlug = (entity: IWithSlug): string => {
  const { slug = "", orgUrlKey } = entity;
  if (orgUrlKey) {
    return slug.replace(`${orgUrlKey}|`, "");
  } else {
    return slug;
  }
};
