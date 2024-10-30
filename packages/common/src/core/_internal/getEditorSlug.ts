import { IWithSlug } from "../traits/IWithSlug";

/**
 * Get the user-editable portion of an entity's slug
 * @param entity
 * @returns
 */
export const getEditorSlug = (entity: IWithSlug) => {
  const { slug = "", orgUrlKey } = entity;
  return slug.replace(`${orgUrlKey}|`, "");
};
